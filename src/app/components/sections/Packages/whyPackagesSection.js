import { FaArrowRight, } from "react-icons/fa";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import Image from "next/image";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { getAssetPath } from "@/app/utils/assetPath";


export const WhyPackagesSection = ({ packagesData }) => {


    const whyPackageData = packagesData.whyPackages
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL


    // Datos de fallback
    const fallbackData = [
        {
            id: 1,
            title: "Pay Oncxde",
            description: "Pay safely in the US and leave your wallet at home, we'll prepay every aspect of your trip.",
            image: getAssetPath("/assets/global/asset001.png"),
            icon: <FaArrowRight />,

        },
        {
            id: 2,
            title: "All-inclusive packages",
            description: "Including all your Kosher meals, hotels, transfers and activities. Activities are custom tailored to the ages in your group.",
            image: getAssetPath("/assets/global/asset001.png"),

            icon: <FaArrowRight />
        },
        {
            id: 3,
            title: "3 price tiers",
            description: "Gold: $3500\nPlatinum: $4500\nUltra Luxury: Custom\nVarying in part, by hotel options.",
            image: getAssetPath("/assets/global/asset001.png"),
            icon: <FaArrowRight />
        },
        {
            id: 4,
            title: "Optional",
            description: "Spend a day in Panama City, see the Canal, visit the old city, enjoy lunch and race back to the airport on your way to Boquete.",
            image: getAssetPath("/assets/global/asset001.png"),
            icon: <FaArrowRight />
        }
    ];


    // Datos Api Construidos

    const processedData = whyPackageData?.map(whyPackage => ({
        title_card: whyPackage.title_card || fallbackData.title_card,
        description_card: whyPackage.description_card || fallbackData.description_card,
        picture: `${apiUrl}${whyPackage.picture.url}` || fallbackData.image,
        icon: <FaArrowRight />,
    })) || [];




    const dataToUse = processedData.length > 0 ? processedData : fallbackData;










    return (
        <section id="whyPackages" className="w-full flex justify-center items-center">
            <div className="w-full max-w-7xl px-6 md:px-0 py-12 md:py-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-darkBlue">
                        Why Packages?
                    </h2>

                    <ButtonTheme title="Explore Packages" href={packagesData.link_contact_packages || "/#"} />
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dataToUse.map((pkg, i) => (
                        <div key={i} className="bg-white group cursor-pointer">
                            {/* Image */}
                            <div className="relative h-[300px] w-full">
                                <div className="w-full h-full rounded-xl overflow-hidden relative">
                                    {/* Replace with Next.js Image component */}
                                    <Image
                                        src={pkg.picture}
                                        fill
                                        alt={pkg.title_card}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="pt-4 px-2">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-darkBlue group-hover:text-primary transition-colors duration-300">{pkg.title_card}</h3>
                                    <span className="text-darkBlue text-lg group-hover:text-primary transition-colors duration-300">{pkg.icon}</span>
                                </div>

                                <p className="text-gray-text whitespace-pre-line text-sm">
                                    {pkg.description_card}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}