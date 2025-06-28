'use client'
import React, { useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const menuItems = [
        {
            name: "Chabat House",
            hasDropdown: false,
            subItems: [
                { name: "Programs", path: "/chabat/programs" },
                { name: "Services", path: "/chabat/services" }
            ],
            path: "/about"
        },
        {
            name: "Visiting Panama",
            hasDropdown: true,
            subItems: [
                { name: "Accommodations", path: "/accommodations" },
                { name: "Restaurants", path: "/restaurants" },
                { name: "Activities", path: "/activities" },
                { name: "Packages", path: "/packages" }
            ]
        },
        { name: "About us", hasDropdown: false, path: "/about" },
        { name: "Contact", hasDropdown: false, path: "/contact" }
    ];

    const toggleMobileDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <header className="w-full bg-white relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <Link href={"/"} className="w-32 md:w-40 lg:w-48 h-auto transform scale-[1.5]">
                        <div className="w-full h-12 md:h-14 relative">
                            <div className="w-28 h-28">
                                <Image src="/assets/site/logo.png" alt="Chabad Logo" fill className="object-contain" />
                            </div>
                        </div>
                    </Link>

                    <div className="flex justify-end gap-8">
                        <nav className="hidden md:flex items-center space-x-8">
                            {menuItems.map((item, index) => (
                                <div key={index} className="relative group">
                                    <button className="flex items-center text-myBlack  text-sm lg:text-base hover:text-primary transition-colors">
                                        {item.name} {item.hasDropdown && <FiChevronDown className="ml-1 text-xs" />}
                                    </button>
                                    {item.hasDropdown && item.subItems && (
                                        <div className="absolute hidden group-hover:block pt-2 left-0 w-56 bg-white rounded-xl shadow z-10">
                                            <p className="px-4 pt-3 pb-2 font-bold text-sm text-myBlack">{item.name}</p>
                                            {item.subItems.map((sub, i) => (
                                                <Link key={i} href={sub.path} className="block px-4 py-2 text-sm text-gray-700 hover:text-primary">
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-4 md:space-x-6">
                            <button className="relative flex items-center text-myBlack hover:text-primary transition-colors gap-1">
                                <FiShoppingCart className="text-xl" />
                                <p>Cart</p>
                                <span className="ml-1 text-sm font-medium">(2)</span>
                            </button>

                            <Link href="/donation" className="hidden md:flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
                                <FaHeart className="mr-2" />
                                <span className="text-sm font-bold">Donate</span>
                            </Link>

                            <button className="md:hidden text-myBlack" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-3">
                        {menuItems.map((item, index) => (
                            <div key={index} className="border-b border-gray-100 pb-2">
                                <button className="w-full flex justify-between items-center text-myBlack font-medium py-2" onClick={() => toggleMobileDropdown(index)}>
                                    {item.name}
                                    {item.hasDropdown && <FiChevronDown />}
                                </button>

                                {item.hasDropdown && item.subItems && activeDropdown === index && (
                                    <div className="pl-4 pt-2">
                                        <p className="font-bold text-sm text-myBlack mb-2">{item.name}</p>
                                        {item.subItems.map((sub, i) => (
                                            <Link key={i} href={sub.path} className="block py-1 text-sm text-gray-700 hover:text-primary">
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
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
