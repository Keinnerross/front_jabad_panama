'use client'
import React from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { Amenities } from "@/app/components/sections/(Entries)/amenites";
import { CategoryTag } from "@/app/components/ui/common/categoryTag";
import { useSearchParams } from "next/navigation";
import { getRestaurantById } from "@/app/data/restaurantsData";

export default function Single() {
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get('id');
    const restaurant = getRestaurantById(restaurantId);

    // Si no se encuentra el restaurante, mostrar mensaje de error
    if (!restaurant) {
        return (
            <div className="w-full flex justify-center py-20">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-darkBlue mb-4">Restaurant not found</h1>
                    <p className="text-gray-text">The restaurant you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    // Obtener las imágenes para la galería (excluyendo la primera que es la portada)
    const galleryImages = restaurant.imageUrls.slice(1);

    return (
        <div className="w-full flex justify-center py-20">
            <div className="w-full max-w-7xl px-6 md:px-0">
                {/* Hero Section */}
                <section className="mb-16 md:mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                        <div className="md:w-[60%]">
                            <h1 className="text-4xl font-bold text-darkBlue mb-6">
                                {restaurant.title}
                            </h1>
                            <p className="text-gray-text text-sm leading-relaxed mb-6 md:mb-0">
                                {restaurant.fullDescription}
                            </p>
                        </div>
                        <ButtonTheme title="Browse gallery" href="#gallery"   />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <CategoryTag categoryTitle={restaurant.category} />
                        {restaurant.tags.map((tag, index) => (
                            <CategoryTag key={index} categoryTitle={tag} />
                        ))}
                    </div>

                    <div className="w-full h-80 md:h-[500px] rounded-xl overflow-hidden relative">
                        <Image 
                            src={restaurant.imageUrls[0]} 
                            alt={restaurant.title}
                            fill
                            className="w-full h-full object-cover"
                        />
                    </div>
                </section>
                {/* Main Content Section */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* About Section */}
                    <div className="lg:w-[70%]">
                      
                        {/* Custom Amenities Section */}
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-darkBlue mb-6">
                                Services & Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {restaurant.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <span className="text-gray-text font-medium">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Gallery Section - Only render if there are gallery images */}
                        {galleryImages.length > 0 && (
                            <section className="mt-10" id="gallery">
                                <h2 className="text-3xl font-bold text-darkBlue mb-8">
                                    Photo gallery
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                    {galleryImages.map((imageUrl, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square rounded-xl overflow-hidden relative"
                                        >
                                            <Image 
                                                src={imageUrl}
                                                alt={`${restaurant.title} gallery image ${index + 1}`}
                                                fill
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-[30%]">
                        <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 sticky top-8">
                            <div className="space-y-8">
                                <div className="w-12 h-12 bg-red-300 rounded-full"></div>
                                <h3 className="text-2xl font-bold text-darkBlue">
                                    {restaurant.title}
                                </h3>
                                <p className="text-gray-text text-sm">
                                    {restaurant.description}
                                </p>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-darkBlue mb-2">Category</h4>
                                        <p className="text-gray-text text-sm">{restaurant.category}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-darkBlue mb-2">Location</h4>
                                        <p className="text-gray-text text-sm">{restaurant.location}</p>
                                    </div>
                                    {restaurant.website !== "/#" && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-darkBlue mb-2">Website</h4>
                                            <a
                                                href={restaurant.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline hover:text-darkBlue transition-colors text-sm"
                                            >
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};