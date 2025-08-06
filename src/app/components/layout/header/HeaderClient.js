'use client'
import React, { useState, lazy, Suspense } from "react";
import { FaHome, FaBed, FaUtensils, FaMapMarkedAlt, FaGift } from "react-icons/fa";
import { GoTriangleRight } from "react-icons/go";
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

export const HeaderClient = ({ data, colorTheme, customPagesData }) => {



    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [hoveredDropdown, setHoveredDropdown] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const pathDonate = "/donation";

    

    // Función para procesar las páginas personalizadas (Custom Pages)
    const processCustomPages = (customPagesData) => {
        if (!customPagesData) return { mainNav: [], chabadHouse: [], visitingPanama: [] };
        
        const mainNav = [];
        const chabadHouse = [];
        const visitingPanama = [];

        customPagesData.forEach(page => {
            const customPage = {
                name: page.title,
                path: `/single-page/${page.documentId}`,
                icon: GoTriangleRight,
                hasDropdown: false
            };

            switch (page.position) {
                case "Main navigation":
                    mainNav.push(customPage);
                    break;
                case "Chabad house":
                    chabadHouse.push(customPage);
                    break;
                case "Visiting section":
                    visitingPanama.push(customPage);
                    break;
            }
        });

        // Ordenar alfabéticamente todas las secciones
        mainNav.sort((a, b) => a.name.localeCompare(b.name));
        chabadHouse.sort((a, b) => a.name.localeCompare(b.name));
        visitingPanama.sort((a, b) => a.name.localeCompare(b.name));

        return { mainNav, chabadHouse, visitingPanama };
    };

    const customPages = processCustomPages(customPagesData);

    // Lógica inteligente: 1 página = directa, 2+ = todas a "More"
    const mainNavPages = customPages.mainNav;
    const showDirectly = mainNavPages.length === 1;
    const visibleMainNavPages = showDirectly ? mainNavPages : [];
    const morePages = showDirectly ? [] : mainNavPages;

    // Crear elementos del menú en el orden correcto
    const menuItems = [
        // 1. Chabad House
        {
            name: "Chabad House",
            hasDropdown: true,
            subItems: [
                { name: "Visitor Information", path: "/visitor-information", icon: FaHome },
                { name: "Shabbat & Holidays Meals", path: "/shabbat-holidays", icon: FaUtensils },
                ...customPages.chabadHouse
            ],
            path: "/about"
        },
        // 2. Visiting Panama
        {
            name: "Visiting Panama",
            hasDropdown: true,
            subItems: [
                { name: "Activities", path: "/activities", icon: FaMapMarkedAlt },
                { name: "Restaurants", path: "/restaurants", icon: FaUtensils },
                { name: "Accommodations", path: "/accommodations", icon: FaBed },
                { name: "Packages", path: "/packages", icon: FaGift },

                ...customPages.visitingPanama
            ]
        },
        // 3. Páginas dinámicas (máximo 2)
        ...visibleMainNavPages,
        // 4. Dropdown "More" (si hay 2+ páginas)
        ...(morePages.length > 0 ? [{
            name: "More",
            hasDropdown: true,
            subItems: morePages.map(page => ({
                name: page.name,
                path: page.path,
                icon: page.icon
            }))
        }] : []),
        // 5. About us y Contact al final
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