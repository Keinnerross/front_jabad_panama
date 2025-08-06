import React from 'react';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';

export const DesktopNavigation = ({
    menuItems,
    hoveredDropdown,
    setHoveredDropdown
}) => {
    return (
        <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className="relative group"
                    onMouseEnter={() => setHoveredDropdown(index)}
                    onMouseLeave={() => setHoveredDropdown(null)}
                >
                    {/* Renderizar como Link si no tiene dropdown, como button si lo tiene */}
                    {!item.hasDropdown ? (
                        <Link
                            href={item.path}
                            className="flex items-center text-myBlack font-medium text-sm lg:text-base hover:text-primary transition-all duration-300 cursor-pointer group"
                        >
                            <span >
                                {item.name}
                            </span>
                        </Link>
                    ) : (
                        <button className="flex items-center text-myBlack font-medium text-sm lg:text-base hover:text-primary transition-all duration-300 cursor-pointer group">
                            <span>
                                {item.name}
                            </span>
                            <FiChevronDown
                                className={`ml-1 mt-1 text-lg transition-transform duration-300 ${hoveredDropdown === index ? 'rotate-180' : 'rotate-0'
                                    }`}
                            />
                        </button>
                    )}

                    {item.hasDropdown && item.subItems && (
                        <div className={`absolute left-0 w-56 bg-white rounded-xl shadow-lg z-10 transition-all duration-300 ${hoveredDropdown === index
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible -translate-y-2'
                            }`}>
                            <div className="pt-4 pb-4 px-4">
                                <p className="px-4 pt-3 pb-2 font-bold text-myBlack">{item.name}</p>
                                {item.subItems.map((sub, i) => {
                                    const IconComponent = sub.icon;
                                    return (
                                        <Link
                                            key={i}
                                            href={sub.path}
                                            className="flex items-center px-4 py-2 text-gray-600 hover:text-primary cursor-pointer font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-1"
                                        >
                                            <IconComponent className={`${IconComponent.name === 'GoTriangleRight' ? 'mr-1 text-xl -translate-x-1' : 'mr-3   text-base'}`} />
                                            <span>{sub.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
};