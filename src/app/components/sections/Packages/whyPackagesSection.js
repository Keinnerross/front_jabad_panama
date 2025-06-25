

import { FaArrowRight, } from "react-icons/fa";
import { ButtonTheme } from "../../ui/common/buttonTheme";


export const WhyPackagesSection = () => {


    const packages = [
        {
            id: 1,
            title: "Pay Once",
            description: "Pay safely in the US and leave your wallet at home, we'll prepay every aspect of your trip.",
            image: "/new-york-NY.png",
            icon: <FaArrowRight />
        },
        {
            id: 2,
            title: "All-inclusive packages",
            description: "Including all your Kosher meals, hotels, transfers and activities. Activities are custom tailored to the ages in your group.",
            image: "/chicago-IL.png",
            icon: <FaArrowRight />
        },
        {
            id: 3,
            title: "3 price tiers",
            description: "Gold: $3500\nPlatinum: $4500\nUltra Luxury: Custom\nVarying in part, by hotel options.",
            image: "/san-francisco-CA.png",
            icon: <FaArrowRight />
        },
        {
            id: 4,
            title: "Optional",
            description: "Spend a day in Panama City, see the Canal, visit the old city, enjoy lunch and race back to the airport on your way to Boquete.",
            image: "/miami-FL.png",
            icon: <FaArrowRight />
        }
    ];
    return (
        <section className="w-full flex justify-center items-center">
            <div className="w-full max-w-7xl px-4 py-12 md:py-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-darkBlue">
                        Why Packages?
                    </h2>

                    <ButtonTheme title="Explore Packages" />
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-white ">
                            {/* Image */}
                            <div className="relative h-[300px] w-full ">
                                <div className="w-full h-full bg-red-300 rounded-xl overflow-hidden">
                                    {/* Replace with Next.js Image component */}
                                    <div className="w-full h-full object-cover bg-red-300" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="pt-4 px-2">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-darkBlue">{pkg.title}</h3>
                                    <span className="text-darkBlue text-lg">{pkg.icon}</span>
                                </div>

                                <p className="text-gray-text whitespace-pre-line text-sm">
                                    {pkg.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}