'use client'
import { FaCheck } from "react-icons/fa";
import Image from "next/image";
import { useCart } from "../../../context/CartContext";

export default function Checkout() {
    const { cartItems, total } = useCart();
    return (
        <div className="w-full flex justify-center bg-white relative pb-28 ">

            <div className="w-screen h-[600px] bg-blueBackground absolute top-0 left-0 " />
            <div className="z-10">

                <div className="text-center pt-20 flex flex-col items-center gap-4">
                    <h2 className="text-4xl font-bold">Checkout</h2>
                    <p className="text-gray-text text-sm w-[30%] " >Enter your payment method below to reserve your spot. We accept major credit cards.</p>
                </div>
                <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-10  pt-14">

                    {/* Order Summary Section - Now with square aspect ratio */}
                    <div className="w-full lg:w-[40%]">
                        <div className="  bg-white rounded-xl border border-gray-200 overflow-hidden p-6">
                            <div className=" inset-0 p-6 flex flex-col">
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-8">

                                    <h3 className="text-xl md:text-2xl font-bold text-darkBlue">
                                        Final order review
                                    </h3>
                                </div>

                                {/* Order Details */}
                                <div className=" flex flex-col justify-between">
                                    <div className="space-y-6">
                                        {cartItems.length > 0 ? (
                                            cartItems.map((item, index) => (
                                                <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex flex-col flex-1">
                                                        <span className="text-gray-text font-medium">{item.meal}</span>
                                                        <span className="text-gray-400 text-sm">{item.priceType} × {item.quantity}</span>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            <span className="font-medium">{item.shabbatName}</span>
                                                            {item.shabbatDate && <span> - {item.shabbatDate}</span>}
                                                            {item.productType && (
                                                                <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                                                    {item.productType === 'shabbatBox' ? 'Shabbat Box' : 'Meal Reservation'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-gray-text font-medium">${item.totalPrice.toFixed(2)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-8">
                                                No items in cart
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider and Total */}
                                    <div>
                                        <div className="border-t border-gray-200 my-4"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-darkBlue font-medium text-lg">Total:</span>
                                            <span className="text-darkBlue font-medium text-lg">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form Section */}
                    <div className="w-full lg:w-[60%] bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                        {/* Personal Information Section */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-darkBlue mb-6">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 ">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-bold text-darkBlue mb-2">First Name</label>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-14">
                                        <input placeholder="Matt Cannon" className="text-gray-text font-medium "></input>
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-bold text-darkBlue mb-2">Last Name</label>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-14">
                                        <p className="text-gray-text font-medium">Cannon</p>
                                    </div>
                                </div>

                                {/* Nationality */}
                                <div>
                                    <label className="block text-sm font-bold text-darkBlue mb-2">Nationality *</label>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-14">
                                        <p className="text-gray-text font-medium">e.g. Israeli</p>
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-bold text-darkBlue mb-2">Phone Number</label>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-14">
                                        <p className="text-gray-text font-medium">(123) 456 - 7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-darkBlue mb-6">Contact Information</h2>

                            <div className="space-y-6">
                                {/* Email Address */}
                                <div>
                                    <label className="block text-sm font-bold text-darkBlue mb-2">Email Address</label>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-14">
                                        <p className="text-gray-text font-medium">example@email.com</p>
                                    </div>
                                </div>

                                {/* Donation Information */}
                                <div className="pt-6 border-t border-gray-200">
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Please be advised that Chabad of Panama is not funded by Chabad
                                            headquarters in New York. We are responsible for all funds. We are
                                            supported exclusively by the generous contributions of individuals
                                            and foundations that care about our action. All funds go directly
                                            into programs and services for the center and visitors.
                                        </p>
                                    </div>

                                    <label className="block text-sm font-bold text-darkBlue mb-2">Your Donation</label>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-14">
                                        <p className="text-gray-text font-medium">$ 00,00</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="mb-8">
                            <div className="space-y-4">
                                {/* Terms Checkbox */}
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-5 h-5 mt-1 bg-white border border-gray-300 rounded-md">
                                        <FaCheck className="text-primary text-xs" />
                                    </div>
                                    <p className="text-gray-text text-sm">
                                        I have read and agreed to the terms of the regulations
                                        <span className="text-primary"> *</span>
                                        <a href="#" className="text-primary underline ml-1">Terms and Conditions</a>
                                    </p>
                                </div>

                                {/* Newsletter Checkbox */}
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-5 h-5 mt-1 bg-white border border-gray-300 rounded-md">
                                        <FaCheck className="text-primary text-xs" />
                                    </div>
                                    <p className="text-gray-text text-sm">
                                        I consent to receive future updates regarding my order *
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Button */}
                        <div className="space-y-4">
                            <button className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition">
                                Pay now
                            </button>
                            <p className="text-gray-text text-xs text-center">
                                *The registration will not be completed without completing the payment
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}