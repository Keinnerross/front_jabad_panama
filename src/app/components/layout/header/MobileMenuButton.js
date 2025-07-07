import React from 'react';

export const MobileMenuButton = ({ isMenuOpen, onClick }) => {
    return (
        <button
            className="lg:hidden text-myBlack relative w-8 h-8 flex flex-col justify-center items-center group"
            onClick={onClick}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
        >
            <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                <span
                    className={`absolute block w-6 bg-current rounded-full transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                        }`}
                    style={{ height: '3px' }}
                ></span>
                <span
                    className={`absolute block w-6 bg-current rounded-full transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                        }`}
                    style={{ height: '3px' }}
                ></span>
            </div>
        </button>
    );
};