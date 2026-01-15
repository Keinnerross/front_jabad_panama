import React from 'react';
import { MegaMenuColumn } from './MegaMenuColumn';

export const MEGA_MENU_THRESHOLD = 8;

/**
 * Determina el número de columnas basado en la cantidad de items
 */
const getColumnCount = (itemCount) => {
    if (itemCount <= 12) return 2;
    if (itemCount <= 18) return 3;
    return 4;
};

/**
 * Distribuye los items equitativamente entre columnas
 */
const distributeItems = (items, columnCount) => {
    const columns = Array.from({ length: columnCount }, () => []);
    const itemsPerColumn = Math.ceil(items.length / columnCount);

    items.forEach((item, index) => {
        const columnIndex = Math.floor(index / itemsPerColumn);
        const targetColumn = Math.min(columnIndex, columnCount - 1);
        columns[targetColumn].push(item);
    });

    return columns;
};

const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
};

export const MegaMenu = ({
    menuTitle,
    subItems,
    isVisible,
    topPosition = 79
}) => {
    const columnCount = getColumnCount(subItems.length);
    const columns = distributeItems(subItems, columnCount);

    return (
        <div
            style={{ top: `${topPosition}px` }}
            className={`fixed left-1/2 -translate-x-1/2 min-w-[320px] max-w-[90vw] w-max bg-white rounded-xl shadow-lg z-50 transition-all duration-300 ${isVisible
                ? 'opacity-100 visible'
                : 'opacity-0 invisible'
                }`}
        >
            <div className="p-4">
                <p className="px-3 pb-3 font-bold text-myBlack border-b border-gray-100 mb-3">
                    {menuTitle}
                </p>

                <div className={`grid ${gridClasses[columnCount]} gap-x-4 gap-y-1`}>
                    {columns.map((columnItems, colIndex) => (
                        <MegaMenuColumn
                            key={colIndex}
                            items={columnItems}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
