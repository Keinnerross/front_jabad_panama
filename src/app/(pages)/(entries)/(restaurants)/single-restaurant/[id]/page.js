import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { Amenities } from "@/app/components/sections/(Entries)/amenites";
import { CategoryTag } from "@/app/components/ui/common/categoryTag";
import { CiGlobe } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { LocationIcon } from "@/app/components/ui/icons/locationIcon";
import { api } from "@/app/services/strapiApiFetch";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";







export default async function Single({ params }) {

    const { id } = await params;
    const restaurantsData = await api.singleRestaurant(id, true);







    // Datos de fallback
    const fallbackData =
    {
        title: "xd",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        category: "Kosher",
        website: "#",
        location: "#",
        established: "number",
        tags: [],
        imageUrls: [],
        menu: "#",
        fullDescription: "#"
    };


    // Datos Api Construidos
    const pageData = {
        title: restaurantsData?.title || fallbackData.title,
        description: restaurantsData?.description || fallbackData.description,
        category: restaurantsData?.category || fallbackData.category,
        website: restaurantsData?.website || fallbackData.website,
        location: restaurantsData?.location || fallbackData.location,
        established: restaurantsData?.established || fallbackData.established,
        tags: restaurantsData?.tags || fallbackData.tags,
        imageUrls: imagesArrayValidation(restaurantsData.imageUrls, fallbackData) || fallbackData.imageUrls,
        menu: restaurantsData?.menu || fallbackData.menu,
        fullDescription: restaurantsData?.fullDescription || fallbackData.fullDescription
    };



    /*     console.log("SINGLE", pageData) */


    return (
        <div className="w-full flex justify-center pt-10 pb-20 md:py-20 border-t border-gray-200">
            <div className="w-full max-w-7xl px-6 md:px-0">
                {/* Hero Section */}
                <section className="w-full mb-16 md:mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-6">
                        <div className="md:w-[60%]">
                            <h1 className="text-5xl font-bold text-darkBlue mb-6">
                                {pageData.title}
                            </h1>
                            <p className="text-gray-text text-sm leading-relaxed mb-6 md:mb-0">
                                {pageData.fullDescription}
                            </p>
                        </div>
                        <ButtonTheme title="Browse gallery" href="#gallery" />
                    </div>
                    <div className="w-full flex flex-wrap items-center gap-4 mb-8">
                        {pageData.tags?.map((tag, index) => (
                            <CategoryTag key={index} categoryTitle={tag.tag_name} />
                        ))}
                    </div>

                    <div className="w-full h-80 md:h-[500px] rounded-xl overflow-hidden relative">
                        <Image
                            src={pageData.imageUrls[0]}
                            alt={pageData.title}
                            fill
                            className="w-full h-full object-cover"
                        />
                    </div>
                </section>
                {/* Main Content Section */}
                <div className="flex flex-col-reverse lg:flex-row gap-12">
                    {/* About Section */}
                    <div className="lg:w-[70%]">

                        {/* Custom Amenities Section */}
                        {/* 
                        <Amenities /> */}

                        {/* Gallery Section - Only render if there are gallery images */}
                        {pageData.imageUrls.length > 1 && (
                            <section className="mt-10 md:mt-0" id="gallery">
                                <h2 className="text-3xl font-bold text-darkBlue mb-8">
                                    Photo gallery
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                    {pageData.imageUrls.slice(1, 7).map((imageUrl, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square rounded-xl overflow-hidden relative"
                                        >
                                            <Image
                                                src={imageUrl}
                                                alt={`${pageData.title} gallery image ${index + 2}`}
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
                            <div className="space-y-4">

                                <div className="w-8 h-8 bg-gray-100 rounded-full relative">
                                    <Image
                                        src="/assets/icons/restaurants/fork.svg"
                                        fill
                                        className="object-cover"
                                        alt="Restaurant icon"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-darkBlue">
                                    {pageData.title}
                                </h3>
                                <p className="text-gray-text text-sm">
                                    {pageData.description}
                                </p>
                                <div className="space-y-4 mb-4" >
                                    <div className="flex gap-2 items-center">
                                        <IoLocationOutline size={20} />
                                        <p className="text-gray-text text-sm">{pageData.location}</p>
                                    </div>
                                    {pageData.website !== "/#" && (
                                        <div className="flex gap-2 items-center">
                                            <CiGlobe size={20} />
                                            <a
                                                href={pageData.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-text text-sm"
                                            >
                                                {pageData.website}
                                            </a>
                                        </div>
                                    )}
                                </div>


                                <ButtonTheme title="View Menu" href={pageData.menu} target="_blank" variation={2} isFull />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}