'use client'
import React, { useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiShoppingCart } from "react-icons/fi";
import { FaHeart, FaHome, FaCog, FaBed, FaUtensils, FaMapMarkedAlt, FaGift } from "react-icons/fa";
import { MdInfo, MdContactMail } from "react-icons/md";
import Link from "next/link";
import { ButtonTheme } from "../ui/common/buttonTheme";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [hoveredDropdown, setHoveredDropdown] = useState(null);

    // Estado para el carrito
    const [cartItemsCount, setCartItemsCount] = useState(0); // Ejemplo con 1 item

    const menuItems = [
        {
            name: "Chabat House",
            hasDropdown: false,
            subItems: [
                { name: "Programs", path: "/chabat/programs", icon: FaHome },
                { name: "Services", path: "/chabat/services", icon: FaCog }
            ],
            path: "/about"
        },
        {
            name: "Visiting Panama",
            hasDropdown: true,
            subItems: [
                { name: "Packages", path: "/packages", icon: FaGift },
                { name: "Activities", path: "/activities", icon: FaMapMarkedAlt },
                { name: "Restaurants", path: "/restaurants", icon: FaUtensils },
                { name: "Accommodations", path: "/accommodations", icon: FaBed },
            ]
        },
        { name: "About us", hasDropdown: false, path: "/about", icon: MdInfo },
        { name: "Contact", hasDropdown: false, path: "http://wa.me/50762430666", icon: MdContactMail }
    ];

    const toggleMobileDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    // Función para cerrar el menú móvil
    const closeMobileMenu = () => {
        setIsMenuOpen(false);
        setActiveDropdown(null); // También cerramos cualquier dropdown abierto
    };

    return (
        <header className="w-full bg-white relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="w-32 md:w-40 lg:w-48 h-auto transform scale-[1.5] hover:scale-[1.55] transition-transform duration-300">
                        <div className="w-full h-12 md:h-14 relative">
                            <div className="w-28 h-28">
                                <Image src="/assets/site/logo.png" alt="Chabad Logo" fill className="object-contain" />
                            </div>
                        </div>
                    </Link>

                    <div className="flex justify-end gap-8">
                        <nav className="hidden md:flex items-center space-x-8">
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
                                            {...(item.name === "Contact" && { target: "_blank", rel: "noopener noreferrer" })}
                                        >
                                            <span className="transform group-hover:scale-105 transition-transform duration-200">
                                                {item.name}
                                            </span>
                                        </Link>
                                    ) : (
                                        <button className="flex items-center text-myBlack font-medium text-sm lg:text-base hover:text-primary transition-all duration-300 cursor-pointer group">
                                            <span className="transform group-hover:scale-105 transition-transform duration-200">
                                                {item.name}
                                            </span>
                                            <FiChevronDown
                                                className={`ml-1 text-xs transition-transform duration-300 ${hoveredDropdown === index ? 'rotate-180' : 'rotate-0'
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
                        </nav>

                        <div className="flex items-center space-x-4 md:space-x-6">
                            {/* Carrito de compras */}
                            <Link
                                href="/#"
                                className="flex items-center text-myBlack font-medium text-sm lg:text-base hover:text-primary transition-all duration-300 gap-2 group relative"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                                    <g clipPath="url(#clip0_3719_23275)">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.9325 11.3559L13.3345 6.53784C12.9702 4.81861 11.9391 4.11111 10.9561 4.11111H3.058C2.06128 4.11111 0.995823 4.76909 0.686497 6.53784L0.0815925 11.3559C-0.41333 14.8934 1.40826 15.7778 3.78663 15.7778H10.2344C12.6059 15.7778 14.3725 14.4972 13.9325 11.3559ZM4.74186 8.11561C4.36223 8.11561 4.05447 7.79886 4.05447 7.40811C4.05447 7.01737 4.36223 6.70062 4.74186 6.70062C5.1215 6.70062 5.42925 7.01737 5.42925 7.40811C5.42925 7.79886 5.1215 8.11561 4.74186 8.11561ZM8.55707 7.40811C8.55707 7.79886 8.86483 8.11561 9.24446 8.11561C9.6241 8.11561 9.93186 7.79886 9.93186 7.40811C9.93186 7.01737 9.6241 6.70062 9.24446 6.70062C8.86483 6.70062 8.55707 7.01737 8.55707 7.40811Z" fill="#FC5761" />
                                        <path d="M10.8686 3.93559C10.871 3.99592 10.8594 4.05599 10.8347 4.11112H9.71694C9.69529 4.05507 9.68382 3.99564 9.68306 3.93559C9.68306 2.4442 8.46989 1.23519 6.97336 1.23519C5.47683 1.23519 4.26365 2.4442 4.26365 3.93559C4.2739 3.99365 4.2739 4.05306 4.26365 4.11112H3.1188C3.10854 4.05306 3.10854 3.99365 3.1188 3.93559C3.20578 1.86016 4.91944 0.222229 7.00384 0.222229C9.08825 0.222229 10.8019 1.86016 10.8889 3.93559H10.8686Z" fill="#111828" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_3719_23275">
                                            <rect width="14" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>

                                <span className="transform group-hover:scale-105 transition-transform duration-200">Cart</span>
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-[6px] -right-[12px] bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                                    </span>
                                )}
                            </Link>

                            <a
                                href="https://api.whatsapp.com/send/?phone=50762430666&text&type=phone_number&app_absent=0"
                                target="blank"
                                className="hidden md:flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            >
                                <FaHeart className="mr-2 animate-pulse" />
                                <span className="font-bold">Donate</span>
                            </a>

                            <button
                                className="md:hidden text-myBlack relative w-10 h-10 flex flex-col justify-center items-center group"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <div className="relative w-7 h-7 flex flex-col justify-center items-center">
                                    <span
                                        className={`absolute block w-9 bg-current rounded-full transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45' : '-translate-y-2'
                                            }`}
                                        style={{ height: '3.5px' }}
                                    ></span>
                                    <span
                                        className={`absolute block w-9 bg-current rounded-full transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45' : 'translate-y-2'
                                            }`}
                                        style={{ height: '3.5px' }}
                                    ></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Absolute positioning */}
                <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ${isMenuOpen
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
                                        {...(item.name === "Contact" && { target: "_blank", rel: "noopener noreferrer" })}
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
                        <Link
                            href="/cart"
                            className="w-full flex items-center justify-center text-red-500 hover:text-red-600 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-all duration-300"
                            onClick={closeMobileMenu} // Cerrar menú al ir al carrito
                        >
                            <FiShoppingCart className="mr-2 w-5 h-5" />
                            <span className="font-semibold">Cart ({cartItemsCount})</span>
                        </Link>

                        <a
                            href="https://api.whatsapp.com/send/?phone=50762430666&text&type=phone_number&app_absent=0"
                            className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg mt-4 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            onClick={closeMobileMenu} // Cerrar menú al ir a donación
                        >
                            <FaHeart className="mr-2 animate-pulse" />
                            <span className="font-bold">Donate</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};