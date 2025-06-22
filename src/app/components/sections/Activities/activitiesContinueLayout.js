import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";

export const ActivitiesContinueLayout = () => {
    return (

        <div className="bg-blueBackground py-20 px-4 flex justify-center items-center">


            <section className=" max-w-7xl px-4 py-8 md:px-8 lg:px-16 bg-blueBackground text-myBlack    ">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h1 className="text-[32px] font-bold leading-tight max-w-xl">
                        Your Panama Adventure Continues!
                    </h1>
                    <button className="border border-myBlack rounded-lg px-6 py-3 text-myBlack text-[15px] font-medium">
                        Check Details
                    </button>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Card Principal */}
                    <div className="rounded-xl overflow-hidden  bg-white">
                        <div className="w-full h-[338px] bg-red-300 object-cover" />

                        <div className="p-6 border border-[#e1e6f1] rounded-b-xl space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg border-[#e1e6f1] w-fit">
                                <FaMapMarkerAlt className="text-sm text-myBlack" />
                                <span className="text-[13px] font-bold text-myBlack">Traveling</span>
                            </div>

                            <h2 className="text-[24px] font-bold">
                                Hotels for all budgets and tastes!
                            </h2>

                            <p className="text-gray-text text-[15.5px] leading-[26px]">
                                From cozy budget stays to luxurious suites, our curated selection of
                                hotels ensures there’s something perfect for every traveler.
                            </p>
                        </div>
                    </div>

                    {/* Lista de Cards verticales */}
                    <div className="flex flex-col gap-6">
                        {["ZIPLINE DAY", "CANGILONES DAY", "RANCH DAY"].map((title, i) => (
                            <div key={i} className="flex gap-4 items-start bg-white rounded-xl overflow-hidden 
                             border border-[#e1e6f1]">
                                <div className="w-[194px] h-[194px] bg-red-300 object-cover shrink-0" />

                                <div className="flex flex-col justify-center p-4 space-y-3">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg border-[#e1e6f1] w-fit">
                                        <FaMapMarkerAlt className="text-sm text-myBlack" />
                                        <span className="text-[13px] font-bold text-myBlack">
                                            {i === 0 ? "Guides" : i === 1 ? "Tour" : "Family"}
                                        </span>
                                    </div>

                                    <h3 className="text-[23px] font-bold leading-tight">{title}</h3>

                                    <p className="text-gray-text text-[15.5px] leading-[26px]">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                                        aliquet, justo at porta malesuada.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>

    );
};
