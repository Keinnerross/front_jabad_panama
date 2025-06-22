'use client'
import React, { useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Datos del menú (podrían venir de Strapi)
    const menuItems = [
        { name: "Chabat House", hasDropdown: true },
        { name: "Visiting Panama", hasDropdown: true },
        { name: "About us", hasDropdown: false, path: "/about" },
        { name: "Contact", hasDropdown: false, path: "/contact"}
    ];

    return (
        <header className="w-full bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href={"/"} className="w-32 md:w-40 lg:w-48 h-auto">
                        <div className="w-full h-12 md:h-14 bg-red-300 relative">
                            {/* Reemplazar con Image de Next.js */}
                            {/* <Image src={logo} alt="Chabad Logo" fill className="object-contain" /> */}
                        </div>
                    </Link>

                    <div className="flex justify-end gap-8">


                        {/* Menú para desktop */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {menuItems.map((item, index) => (
                                <div key={index} className="relative group">
                                    <Link href={item.path ?? "#"} className="flex items-center text-myBlack font-medium text-sm lg:text-base hover:text-primary transition-colors">
                                        {item.name}
                                        {item.hasDropdown && (
                                            <FiChevronDown className="ml-1 text-xs" />
                                        )}
                                    </Link>

                                    {/* Dropdown (ejemplo) */}
                                    {item.hasDropdown && (
                                        <div className="absolute hidden group-hover:block pt-2 left-0 w-48 bg-white shadow-lg rounded-md z-10">
                                            <div className="py-1">
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-text hover:bg-blueBackground">
                                                    Submenu Item
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Botones de acción */}
                        <div className="flex items-center space-x-4 md:space-x-6">
                            {/* Carrito */}
                            <button className="relative flex items-center text-myBlack hover:text-primary transition-colors gap-1">
                                <FiShoppingCart className="text-xl" />
                                <p>Cart</p>
                                <span className="ml-1 text-sm font-medium">(2)</span>
                            </button>

                            {/* Botón Donate */}
                            <button className="hidden md:flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
                                <FaHeart className="mr-2" />
                                <span className="text-sm font-bold">Donate</span>
                            </button>

                            {/* Menú móvil */}
                            <button
                                className="md:hidden text-myBlack"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>

                {/* Menú móvil desplegable */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-3">
                        {menuItems.map((item, index) => (
                            <div key={index} className="border-b border-gray-100 pb-2">
                                <button className="w-full flex justify-between items-center text-myBlack font-medium py-2">
                                    {item.name}
                                    {item.hasDropdown && <FiChevronDown />}
                                </button>
                            </div>
                        ))}

                        <button className="w-full flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg mt-2">
                            <FaHeart className="mr-2" />
                            <span className="font-bold">Donate</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};