'use client';

import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import {
    IoLogoWhatsapp,
    IoBed,
    IoMail,
    IoCall,
    IoLink,
    IoGlobe,
    IoAirplane
} from "react-icons/io5";

// Mapa de iconos según palabras clave en el título
const getIconForTitle = (title) => {
    const lowerTitle = title?.toLowerCase() || '';

    if (lowerTitle.includes('whatsapp') || lowerTitle.includes('wsp')) {
        return IoLogoWhatsapp;
    }
    if (lowerTitle.includes('hotel') || lowerTitle.includes('booking') || lowerTitle.includes('airbnb')) {
        return IoBed;
    }
    if (lowerTitle.includes('email') || lowerTitle.includes('correo') || lowerTitle.includes('mail')) {
        return IoMail;
    }
    if (lowerTitle.includes('phone') || lowerTitle.includes('tel') || lowerTitle.includes('llamar')) {
        return IoCall;
    }
    if (lowerTitle.includes('web') || lowerTitle.includes('sitio')) {
        return IoGlobe;
    }
    if (lowerTitle.includes('vuelo') || lowerTitle.includes('flight') || lowerTitle.includes('expedia')) {
        return IoAirplane;
    }

    return IoLink;
};

const BookingOptionCard = ({
    title = "Booking Option",
    description = "Description",
    buttonText = "Book",
    buttonUrl = "/"
}) => {
    const IconComponent = getIconForTitle(title);

    // Asegurar que la URL tenga protocolo
    const formattedUrl = buttonUrl?.startsWith('http') ? buttonUrl : `https://${buttonUrl}`;

    return (
        <div className="flex flex-col justify-between gap-4 p-5 bg-white rounded-xl border border-solid border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blueBackground rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="text-primary" size={20} />
                    </div>
                    <h4 className="font-bold text-darkBlue text-lg">
                        {title}
                    </h4>
                </div>
                <p className="text-gray-text text-sm leading-relaxed">
                    {description}
                </p>
            </div>
            <ButtonTheme
                title={buttonText}
                href={formattedUrl}
                target="_blank"
                variation={1}
                isFull
            />
        </div>
    );
};

export default BookingOptionCard;
