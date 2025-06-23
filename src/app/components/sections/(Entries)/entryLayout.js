import React from "react";
import { FiChevronRight, FiMapPin, FiSearch } from "react-icons/fi";

export const EntryLayout = ({ children }) => {


    return (
        <div className="w-full px-4 md:px-0 py-12 flex justify-center">
            <div className="w-full max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-darkBlue">
                        Discover, Taste & Explore
                    </h2>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap gap-2">
                        <button className="flex items-center gap-2 bg-darkBlue text-white px-4 py-2 rounded-lg text-sm md:text-base">
                            <span>All</span>
                        </button>

                        <button className="flex items-center gap-2 bg-white text-darkBlue border border-gray-300 px-4 py-2 rounded-lg text-sm md:text-base">
                            <FiSearch className="text-darkBlue" />
                            <span>Bakeries</span>
                        </button>

                        <button className="flex items-center gap-2 bg-white text-darkBlue border border-gray-300 px-4 py-2 rounded-lg text-sm md:text-base">
                            <FiSearch className="text-darkBlue" />
                            <span>Restaurants</span>
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
                    {children}
                </div>

                {/* Pagination */}
                <div className="flex justify-end">
                    <button className="flex items-center gap-2 bg-darkBlue text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                        <span>Next</span>
                        <FiChevronRight />
                    </button>
                </div>
            </div>

        </div>
    );
};