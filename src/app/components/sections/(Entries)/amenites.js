import React from "react";
import {
    FaParking,
    FaWifi,
    FaSmokingBan,
    FaWheelchair,
    FaCreditCard,
    FaCalendarCheck,
    FaBicycle,
    FaShieldVirus,
    FaPaw,
    FaMobileAlt,
    FaSyringe,
    FaStar
} from "react-icons/fa";

export const Amenities = () => {
    // Amenities data - can be moved to a separate file or fetched from CMS
    const amenities = [
        { icon: <FaParking />, name: "Street parking" },
        { icon: <FaWifi />, name: "Free WiFi" },
        { icon: <FaSmokingBan />, name: "No smoking" },
       /*  { icon: <FaStar />, name: "Military discount" }, */
        { icon: <FaWheelchair />, name: "Wheelchair accessible" },
        { icon: <FaCreditCard />, name: "Accepts credit cards" },
        { icon: <FaCalendarCheck />, name: "Appointment only" },
        { icon: <FaBicycle />, name: "Bike parking" },
  /*       { icon: <FaShieldVirus />, name: "Covid-19 safety" }, */
        { icon: <FaPaw />, name: "Pet friendly" },
/*         { icon: <FaMobileAlt />, name: "Mobile tickets" }, */
       /*  { icon: <FaSyringe />, name: "Vaccination required" } */
    ];

    return (


        <div className="w-full max-w-4xl mx-auto ">
            {/* Header */}
            <h2 className="text-3xl md:text-4xl font-bold text-darkBlue mb-8">
                Amenities available
            </h2>

            {/* Amenities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-6">
                {amenities.map((amenity, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 "
                    >
                        <span className="text-darkBlue text-lg">{amenity.icon}</span>
                        <span className="text-darkBlue text-sm">{amenity.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};