import React from 'react';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

export const DonateButton = ({ pathDonate, className = "" }) => {
    return (
        <Link
            href={pathDonate}
            className={`hidden lg:flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg ${className}`}
        >
            <FaHeart className="mr-2 animate-pulse" />
            <span className="font-bold">Donate</span>
        </Link>
    );
};