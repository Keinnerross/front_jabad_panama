'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ButtonTheme } from './buttonTheme';
import { IoClose } from 'react-icons/io5';
import { CategoryTag } from './categoryTag';

export const NotificationPopup = ({
  show,
  onClose,
  title = "Don't miss out!",
  description = "Get the latest updates and special offers",
  buttonText = "Learn More",
  buttonHref = "#",
  backgroundImage = "/assets/pictures/raf2.jpg",
  autoClose = false,
  autoCloseDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    }
  }, [show]);

  useEffect(() => {
    if (autoClose && show) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, show, autoCloseDelay]);



  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!show) return null;

  return (
    <>
      {/* Overlay */}


      {/* Popup */}
      <div
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-80 md:w-96 bg-[#0A1F48] rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
          }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="cursor-pointer absolute top-3 right-3 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 transition-all duration-200 shadow-sm"
        >
          <IoClose className="text-myBlack text-lg" />
        </button>

        <div className="absolute top-3 left-3 z-10">
          <CategoryTag categoryTitle='Delivery' />
        </div>

        {/* Background image */}
        <div className="relative h-32 md:h-36 overflow-hidden">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30" />
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <h3 className="text-lg md:text-2xl font-bold text-white mb-2">
            {title}
          </h3>

          <p className="text-gray-100 text-sm  font-light leading-relaxed mb-4">
            {description}
          </p>

          <ButtonTheme
            title={buttonText}
            href={buttonHref}
            variation={3}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
};