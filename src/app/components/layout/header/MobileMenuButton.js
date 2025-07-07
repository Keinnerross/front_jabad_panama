import React from 'react';

export const MobileMenuButton = ({ isMenuOpen, onClick }) => {
    return (
        <button
            className="lg:hidden text-myBlack relative w-10 h-10 flex flex-col justify-center items-center group"
            onClick={onClick}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
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
    );
};