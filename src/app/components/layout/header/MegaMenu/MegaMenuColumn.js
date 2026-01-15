import React from 'react';
import { MegaMenuItem } from './MegaMenuItem';

export const MegaMenuColumn = ({ items }) => {
    return (
        <div className="flex flex-col gap-2">
            {items.map((item, index) => (
                <MegaMenuItem key={index} item={item} />
            ))}
        </div>
    );
};
