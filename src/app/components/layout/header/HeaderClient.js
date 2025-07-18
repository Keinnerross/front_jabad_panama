'use client'
import React, { useState, lazy, Suspense } from "react";
import { FaHome, FaBed, FaUtensils, FaMapMarkedAlt, FaGift } from "react-icons/fa";
import { MdInfo, MdContactMail } from "react-icons/md";

// Lazy load cart popup for better performance
const CartPopup = lazy(() =>
    import("../../ui/cart/cartPopup").then(module => ({
        default: module.CartPopup
    }))
);

// Componentes modulares del header
import { Logo } from "./Logo";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { CartButton } from "./CartButton";
import { DonateButton } from "./DonateButton";
import { MobileMenuButton } from "./MobileMenuButton";

export const HeaderClient = ({ data, colorTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [hoveredDropdown, setHoveredDropdown] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const pathDonate = "/donation";

    const menuItems = [
        {
            name: "Chabat House",
            hasDropdown: true,
            subItems: [
                { name: "Visitor Information", path: "/visitor-information", icon: FaHome },
                { name: "Shabbat & Holidays Meals", path: "/shabbat-holidays", icon: FaUtensils }
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
        { name: "Contact", hasDropdown: false, path: "/contact", icon: MdContactMail }
    ];

    const toggleMobileDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
        setActiveDropdown(null);
    };

    return (
        <header className="w-full bg-white relative z-50">
            <div className="max-w-7xl mx-auto py-4 md:py-6">
                <div className="flex items-center justify-between px-4 lg:px-0">
                    {/* Logo */}
                    <Logo logo={data.logo} />

                    <div className="flex justify-end gap-8">
                        {/* Desktop Navigation */}
                        <DesktopNavigation
                            menuItems={menuItems}
                            hoveredDropdown={hoveredDropdown}
                            setHoveredDropdown={setHoveredDropdown}
                            colorTheme={colorTheme}
                        />

                        <div className="flex items-center space-x-6">
                            {/* Cart Button */}
                            <CartButton onClick={() => setIsCartOpen(true)} colorTheme={colorTheme} />

                            {/* Donate Button */}
                            <DonateButton pathDonate={pathDonate} colorTheme={colorTheme} />

                            {/* Mobile Menu Button */}
                            <MobileMenuButton
                                isMenuOpen={isMenuOpen}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                colorTheme={colorTheme}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <MobileNavigation
                    isMenuOpen={isMenuOpen}
                    menuItems={menuItems}
                    activeDropdown={activeDropdown}
                    toggleMobileDropdown={toggleMobileDropdown}
                    closeMobileMenu={closeMobileMenu}
                    setIsCartOpen={setIsCartOpen}
                    pathDonate={pathDonate}
                    colorTheme={colorTheme}
                />
            </div>

            {/* Lazy loaded Cart Popup with suspense boundary */}
            <Suspense fallback={null}>
                <CartPopup
                    isOpen={isCartOpen}
                    handleModal={setIsCartOpen}
                    colorTheme={colorTheme}
                />
            </Suspense>
        </header>
    );
};