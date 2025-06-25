import { ButtonTheme } from "../../ui/common/buttonTheme";
import { CategoryTag } from "../../ui/common/categoryTag";

export const ActivitiesSecundarySection = () => {
    const adventures = [
        {
            id: 1,
            title: "ZIPLINE DAY",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet, justo at porta malesuada.",
            category: "Guides",
            image: "/a-beginner-s-guide-on-how-to-plan-your-travel-budget.png"
        },
        {
            id: 2,
            title: "CANGILONES DAY",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet, justo at porta malesuada.",
            category: "Tour",
            image: "/16-restaurants-that-you-must-visit-in-chicago-illinois.png"
        },
        {
            id: 3,
            title: "RANCH DAY",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet, justo at porta malesuada.",
            category: "Family",
            image: "/how-to-make-a-travel-plan-to-visit-a-city-on-a-budget.png"
        }
    ];
    return (

        <div className="w-full flex justify-center items-center">


            <div className="w-full max-w-7xl px-4 md:px-0 pb-20 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-darkBlue">
                        Your Panama Adventure Continues!
                    </h2>

                    <ButtonTheme title="Check Details" />
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Featured Hotel Card */}
                    <div className="lg:w-[40%]">

                        <div className="border border-gray-200 rounded-2xl overflow-hidden ">
                            <div className="h-64 md:h-80 bg-red-300 rounded-xl overflow-hidden">
                                {/* Replace with Next.js Image component */}
                                <div className="w-full h-full object-cover bg-red-300" />
                            </div>

                            <div className="p-8 space-y-4">

                                <CategoryTag />

                                <h3 className="text-2xl font-bold text-darkBlue">
                                    Hotels for all budgets and tastes!
                                </h3>

                                <p className="text-gray-text text-sm">
                                    From cozy budget stays to luxurious suites, our curated selection
                                    of hotels ensures there's something perfect for every traveler.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Adventure Cards */}
                    <div className="lg:w-[60%] space-y-6">
                        {adventures.map((adventure) => (
                            <div key={adventure.id} className="flex flex-col sm:flex-row rounded-xl overflow-hidden">
                                <div className="sm:w-1/3 h-48 bg-red-300 rounded-xl overflow-hidden">
                                    {/* Replace with Next.js Image component */}
                                    <div className="w-full h-full object-cover bg-red-300" />
                                </div>

                                <div className="sm:w-2/3 bg-white p-6 space-y-4">
                                    <CategoryTag />

                                    <h3 className="text-xl font-bold text-darkBlue ">
                                        {adventure.title}
                                    </h3>

                                    <p className="text-gray-text text-sm">
                                        {adventure.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>









    )
};
