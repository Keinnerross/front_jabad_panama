import React from 'react';
import Link from 'next/link';
import { FiChevronDown, FiShoppingCart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useCart } from '../../../context/CartContext';

export const MobileNavigation = ({ 
    isMenuOpen,
    menuItems,
    activeDropdown,
    toggleMobileDropdown,
    closeMobileMenu,
    setIsCartOpen,
    pathDonate
}) => {
    const { itemCount } = useCart();

    return (
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ${isMenuOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
                {menuItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
                        {!item.hasDropdown ? (
                            <Link
                                href={item.path}
                                className="w-full flex justify-between items-center text-myBlack font-medium py-2 hover:text-primary transition-colors duration-200"
                                onClick={closeMobileMenu} // Cerrar menú al hacer clic
                            >
                                <span className="transform hover:translate-x-1 transition-transform duration-200">
                                    {item.name}
                                </span>
                            </Link>
                        ) : (
                            <button
                                className="w-full flex justify-between items-center text-myBlack font-medium py-2 hover:text-primary transition-colors duration-200"
                                onClick={() => toggleMobileDropdown(index)}
                            >
                                <span className="transform hover:translate-x-1 transition-transform duration-200">
                                    {item.name}
                                </span>
                                <FiChevronDown
                                    className={`transition-transform duration-300 ${activeDropdown === index ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </button>
                        )}

                        {item.hasDropdown && item.subItems && (
                            <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === index
                                ? 'max-h-96 opacity-100'
                                : 'max-h-0 opacity-0'
                                }`}>
                                <div className="pl-4 pt-2">
                                    <p className="font-bold text-sm text-myBlack mb-2">{item.name}</p>
                                    {item.subItems.map((sub, i) => {
                                        const IconComponent = sub.icon;
                                        return (
                                            <Link
                                                key={i}
                                                href={sub.path}
                                                className="flex items-center py-2 text-sm text-gray-700 hover:text-primary font-medium rounded-md hover:bg-gray-50 px-2 transition-all duration-200 transform hover:translate-x-1"
                                                onClick={closeMobileMenu} // Cerrar menú al hacer clic en sub-item
                                            >
                                                <IconComponent className="mr-3 text-sm" />
                                                <span>{sub.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Carrito en móvil */}
                <button
                    onClick={() => { setIsCartOpen(true); closeMobileMenu(); }}
                    className="w-full flex items-center justify-center text-red-500 hover:text-red-600 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-all duration-300"
                >
                    <FiShoppingCart className="mr-2 w-5 h-5" />
                    <span className="font-semibold">Cart ({itemCount})</span>
                </button>

                <a
                    href={pathDonate}
                    className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg mt-4 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={closeMobileMenu} // Cerrar menú al ir a donación
                >
                    <FaHeart className="mr-2 animate-pulse" />
                    <span className="font-bold">Donate</span>
                </a>
            </div>
        </div>
    );
};