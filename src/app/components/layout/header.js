'use client'
import React, { useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { ButtonTheme } from "../ui/common/buttonTheme";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [hoveredDropdown, setHoveredDropdown] = useState(null);
    
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
                    <Link href={"/"} className="w-32 md:w-40 lg:w-48 h-auto transform scale-[1.5] hover:scale-[1.55] transition-transform duration-300">
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
                                    <button className="flex items-center text-myBlack font-medium text-sm lg:text-base hover:text-primary transition-all duration-300 cursor-pointer group">
                                        <span className="transform group-hover:scale-105 transition-transform duration-200">
                                            {item.name}
                                        </span>
                                        {item.hasDropdown && (
                                            <FiChevronDown 
                                                className={`ml-1 text-xs transition-transform duration-300 ${
                                                    hoveredDropdown === index ? 'rotate-180' : 'rotate-0'
                                                }`} 
                                            />
                                        )}
                                    </button>
                                    
                                    {item.hasDropdown && item.subItems && (
                                        <div className={`absolute left-0 w-56 bg-white rounded-xl shadow-lg z-10 transition-all duration-300 ${
                                            hoveredDropdown === index 
                                                ? 'opacity-100 visible translate-y-0' 
                                                : 'opacity-0 invisible -translate-y-2'
                                        }`}>
                                            <div className="pt-4 pb-4 px-4">
                                                <p className="px-4 pt-3 pb-2 font-bold text-myBlack">{item.name}</p>
                                                {item.subItems.map((sub, i) => (
                                                    <Link 
                                                        key={i} 
                                                        href={sub.path} 
                                                        className="block px-4 py-2 text-gray-600 hover:text-primary cursor-pointer font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-1"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                        
                        <div className="flex items-center space-x-4 md:space-x-6">
                            <Link 
                                href="/donation" 
                                className="hidden md:flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            >
                                <FaHeart className="mr-2 animate-pulse" />
                                <span className="font-bold">Donate</span>
                            </Link>

                            <button 
                                className="md:hidden text-myBlack relative w-10 h-10 flex flex-col justify-center items-center group" 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <div className="relative w-7 h-7 flex flex-col justify-center items-center">
                                    <span 
                                        className={`absolute block w-9 bg-current rounded-full transition-all duration-300 ease-in-out ${
                                            isMenuOpen ? 'rotate-45' : '-translate-y-2'
                                        }`}
                                        style={{ height: '3.5px' }}
                                    ></span>
                                    <span 
                                        className={`absolute block w-9 bg-current rounded-full transition-all duration-300 ease-in-out ${
                                            isMenuOpen ? '-rotate-45' : 'translate-y-2'
                                        }`}
                                        style={{ height: '3.5px' }}
                                    ></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Absolute positioning */}
                <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ${
                    isMenuOpen 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible -translate-y-4'
                }`}>
                    <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
                        {menuItems.map((item, index) => (
                            <div key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
                                <button 
                                    className="w-full flex justify-between items-center text-myBlack font-medium py-2 hover:text-primary transition-colors duration-200" 
                                    onClick={() => toggleMobileDropdown(index)}
                                >
                                    <span className="transform hover:translate-x-1 transition-transform duration-200">
                                        {item.name}
                                    </span>
                                    {item.hasDropdown && (
                                        <FiChevronDown 
                                            className={`transition-transform duration-300 ${
                                                activeDropdown === index ? 'rotate-180' : 'rotate-0'
                                            }`} 
                                        />
                                    )}
                                </button>

                                {item.hasDropdown && item.subItems && (
                                    <div className={`overflow-hidden transition-all duration-300 ${
                                        activeDropdown === index 
                                            ? 'max-h-96 opacity-100' 
                                            : 'max-h-0 opacity-0'
                                    }`}>
                                        <div className="pl-4 pt-2">
                                            <p className="font-bold text-sm text-myBlack mb-2">{item.name}</p>
                                            {item.subItems.map((sub, i) => (
                                                <Link 
                                                    key={i} 
                                                    href={sub.path} 
                                                    className="block py-2 text-sm text-gray-700 hover:text-primary font-medium rounded-md hover:bg-gray-50 px-2 transition-all duration-200 transform hover:translate-x-1"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <button className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg mt-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                            <FaHeart className="mr-2 animate-pulse" />
                            <span className="font-bold">Donate</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};