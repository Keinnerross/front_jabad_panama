'use client'
import React, { useState, useEffect, lazy, Suspense } from "react";
import { FaHome, FaBed, FaUtensils, FaMapMarkedAlt, FaGift, FaStar, FaInfoCircle, FaStarOfDavid, FaUsers, FaPizzaSlice, FaConciergeBell } from "react-icons/fa";
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

export const HeaderClient = ({ data, colorTheme, customPagesData, customEventsData, platformSettings }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [hoveredDropdown, setHoveredDropdown] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Detectar scroll para agregar shadow
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const pathDonate = "/donation";

    // Función para mapear el icono del evento según la selección en Strapi
    // TODO: Agregar más iconos aquí cuando se necesite dar soporte a nuevos tipos de eventos
    const getEventIcon = (iconName) => {
        const iconMap = {
            'utensils': FaUtensils,      // Cubiertos/utensilios
            'catering': FaConciergeBell, // Campana de servicio/catering
            'pizza': FaPizzaSlice,       // Pizza
            // Agregar más iconos aquí cuando sea necesario:
            // 'coffee': FaCoffee,
            // 'wine': FaWineGlassAlt,
            // 'burger': FaHamburger,
            // etc.
        };
        
        // Retorna el icono correspondiente o FaUtensils por defecto
        return iconMap[iconName?.toLowerCase()] || FaUtensils;
    };

    // Función para procesar las páginas personalizadas (Custom Pages)
    const processCustomPages = (customPagesData) => {
        if (!customPagesData) return { mainNav: [], chabadHouse: [], visitingPanama: [] };

        const mainNav = [];
        const chabadHouse = [];
        const visitingPanama = [];

        customPagesData.forEach(page => {
            const customPage = {
                name: page.title,
                path: page.is_direct_link ? page.direct_link : `/single-page/${page.documentId}`,
                icon: FaStarOfDavid,
                hasDropdown: false,
                isExternalLink: page.is_direct_link || false
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
                { name: "About us", hasDropdown: false, path: "/about", icon: FaUsers },
                { name: "Visitor Information", path: "/visitor-information", icon: FaHome },
                ...customPages.chabadHouse
            ],
            path: "/about"
        },
        // 2. Visiting [Ciudad]
        {
            name: `Visiting ${platformSettings?.ciudad || 'Panama'}`,
            hasDropdown: true,
            subItems: [
                { name: "Activities", path: "/activities", icon: FaMapMarkedAlt },
                { name: "Accommodations", path: "/accommodations", icon: FaBed },
                ...(platformSettings?.habilitar_packages ? [
                    { name: "Packages", path: "/packages", icon: FaGift }
                ] : []),
                ...customPages.visitingPanama
            ]
        },

        // 3. Kosher Food dropdown (siempre visible)
        {
            name: "Kosher Food",
            hasDropdown: true,
            subItems: [
                { name: "Shabbat Meals", path: "/shabbat-holidays", icon: FaStarOfDavid },
                { name: "Restaurants", path: "/restaurants", icon: FaUtensils },

                // Los eventos custom (si existen)
                ...(customEventsData && customEventsData.length > 0
                    ? customEventsData.map(event => ({
                        name: event.name,
                        path: `/custom-event?event=${event.documentId || event.id}`,
                        icon: getEventIcon(event.icon) // Usa el icono dinámico basado en la propiedad 'icon' del evento
                    }))
                    : []
                ),

            ]
        },
        // 4. Páginas dinámicas (máximo 2)
        ...visibleMainNavPages,
        // 5. Dropdown "More" (si hay 2+ páginas)
        ...(morePages.length > 0 ? [{
            name: "More",
            hasDropdown: true,
            subItems: morePages.map(page => ({
                name: page.name,
                path: page.path,
                icon: page.icon
            }))
        }] : []),
        // 6. About us y Contact al final
        { name: "Contact", hasDropdown: false, path: "/contact", icon: MdContactMail },

    ];





















    const toggleMobileDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
        setActiveDropdown(null);
    };

    return (
        <header className={`w-full bg-white sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : ''}`}>
            <div className="max-w-7xl mx-auto py-2">
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