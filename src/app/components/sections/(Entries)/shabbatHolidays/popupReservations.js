'use client'
import React from "react";
import Image from "next/image";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";

export const PopupReservations = ({ isOpen = false, handleModal }) => {
    return (
        <div
            className={`w-full h-full bg-black/50 flex justify-center items-center p-4 sm:p-6 lg:p-8 fixed top-0 backdrop-blur-xs ${!isOpen && "hidden"}`}
            onClick={() => handleModal(false)}
        >
            <div
                onClick={(e) => e.stopPropagation(e)}
                className="w-full max-w-5xl  flex flex-col lg:flex-row rounded-xl overflow-hidden h-fit">
                {/* Image Section */}
                <div className="w-full lg:w-1/2 h-64 lg:h-auto bg-red-300 relative">
                    {/* Replace with Next.js Image component */}
                    <div className="w-full h-full object-cover bg-red-300" />
                </div>

                {/* Form Section */}
                <div className="w-full lg:w-1/2 p-6 md:p-8 bg-white">
                    <h2 className="text-2xl md:text-3xl font-bold text-darkBlue mb-2">
                        Friday night Dinner
                    </h2>
                    <p className="text-gray-text text-lg mb-6">
                        Date: Friday 11/07/2025<br />
                        Time: 19:30
                    </p>
                    {/* Quantity Selectors */}
                    <div className="space-y-6">
                        {/* Supporter */}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-text text-lg">Supporter</span>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
                                    <FaMinus className="text-gray-text" />
                                </button>
                                <span className="w-10 text-center text-gray-text text-lg">0</span>
                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
                                    <FaPlus className="text-gray-text" />
                                </button>
                                <span className="w-20 text-right text-gray-text text-lg">180.00 $</span>
                            </div>
                        </div>

                        {/* Cost Price */}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-text text-lg">Cost price</span>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
                                    <FaMinus className="text-gray-text" />
                                </button>
                                <span className="w-10 text-center text-gray-text text-lg">0</span>
                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
                                    <FaPlus className="text-gray-text" />
                                </button>
                                <span className="w-20 text-right text-gray-text text-lg">62.00 $</span>
                            </div>
                        </div>

                        {/* Kids 3-10 yo */}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-text text-lg">Kids 3-10 yo</span>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
                                    <FaMinus className="text-gray-text" />
                                </button>
                                <span className="w-10 text-center text-gray-text text-lg">1</span>
                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
                                    <FaPlus className="text-gray-text" />
                                </button>
                                <span className="w-20 text-right text-gray-text text-lg">42.00 $</span>
                            </div>
                        </div>

                        {/* Baby 0-2 yo */}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-text text-lg">Baby 0-2 yo</span>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
                                    <FaMinus className="text-gray-text" />
                                </button>
                                <span className="w-10 text-center text-gray-text text-lg">0</span>
                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
                                    <FaPlus className="text-gray-text" />
                                </button>
                                <span className="w-20 text-right text-gray-text text-lg">1.00 $</span>
                            </div>
                        </div>

                        {/* IDF soldier */}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-text text-lg">IDF soldier</span>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
                                    <FaMinus className="text-gray-text" />
                                </button>
                                <span className="w-10 text-center text-gray-text text-lg">0</span>
                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md">
                                    <FaPlus className="text-gray-text" />
                                </button>
                                <span className="w-20 text-right text-gray-text text-lg">22.00 $</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-darkBlue font-bold text-lg">Total:</span>
                        <span className="text-darkBlue font-bold text-xl">42.00 $</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition flex justify-between px-6 items-center">
                        <span>Add to cart and continue</span>
                        <span>42.00 $</span>
                    </button>
                </div>
            </div>
        </div>
    );
};