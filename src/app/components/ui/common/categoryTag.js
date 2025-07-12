import React from "react";
import { FaLeaf, FaUtensils, FaHome, FaMountain, FaFish, FaBed, FaMugHot, FaTree, FaTag } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";

export const CategoryTag = ({ categoryTitle = "Category" }) => {
    const categoryIcons = {
        Adventure: <FaMountain />, // Activities
        Nature: <FaLeaf />,      // Activities
        Food: <FaUtensils />,    // Activities / Restaurants
        Cultural: <FaHome />,    // Activities
        Fishing: <FaFish />,     // Activities
        Hostel: <FaBed />,       // Hotels
        Hotel: <FaBed />,        // Hotels
        "Boutique Hotel": <FaBed />, // Hotels
        Resort: <FaTree />,      // Hotels
        Villa: <FaHome />,       // Hotels
        "Eco Lodge": <FaTree />, // Hotels
        Bakery: <FaMugHot />,    // Restaurants
        Catering: <FaUtensils />, // Restaurants
        Delivery: <MdDeliveryDining size={22} /> // Special
    };

    const categoryIcon = categoryIcons[categoryTitle] || <FaTag />;
    return (
        <div className="flex items-center gap-2 bg-white rounded-lg border border-solid border-gray-200 px-3 py-1 w-fit cursor-pointer ">
            <span className="text-primary">{categoryIcon}</span>
            <span className="text-myBlack font-bold text-sm">{categoryTitle}</span>
        </div>
    );
};
