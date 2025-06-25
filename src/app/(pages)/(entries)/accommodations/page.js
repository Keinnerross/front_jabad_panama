import { CardEntry } from "@/app/components/sections/(cards)/cardEntry";
import { EntryLayout } from "@/app/components/sections/(Entries)/entryLayout";
import { Fragment } from "react";

export default function Acomodations() {

    const contentItems = [
        {
            id: 1,
            title: "Hotel Residence Inn by Marriott",
            distance: "11 minutes walking",
            category: "Hotel",
            tags: [],
            location: "Panama City, Panama",
            image: "/residence-inn.png",
            rating: 5,
        },
        {
            id: 2,
            title: "JW Marriott",
            distance: "11 minutes walking",
            category: "Hotel",
            tags: [],
            location: "Panama City, Panama",
            image: "/jw-marriott.png",
            rating: 5,
        },
        {
            id: 3,
            title: "Las Americas Golden Tower",
            distance: "11 minutes walking",
            category: "Hotel",
            tags: [],
            location: "Panama City, Panama",
            image: "/las-americas.png",
            rating: 4.5,
        },
        {
            id: 4,
            title: "InterContinental Miramar Panama",
            distance: "11 minutes walking",
            category: "Hotel",
            tags: [],
            location: "Panama City, Panama",
            image: "/intercontinental.png",
            rating: 5,
        },
        {
            id: 5,
            title: "Radisson Decapolis hotel",
            distance: "11 minutes walking",
            category: "Hotel",
            tags: [],
            location: "Panama City, Panama",
            image: "/radisson.png",
            rating: 5,
        },
        {
            id: 6,
            title: "Plaza Paitilla Inn",
            distance: "11 minutes walking",
            category: "Hotel",
            tags: [],
            location: "Panama City, Panama",
            image: "/plaza-paitilla.png",
            rating: 4,
        },
    ];


    return (
        <Fragment>


            {/* Hero */}
            < section className="relative flex flex-col items-center w-full bg-blueBackground pb-20 md:pb-0 md:h-[516px] overflow-hidden" >
                {/* Gradient bottom */}
                < div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-blueBackground z-10" />

                {/* Main content container */}
                < div className="w-full max-w-7xl px-4 md:px-6 h-full flex items-center justify-center" >
                    {/* Text content - using flex for centering */}
                    < div className="w-full flex flex-col items-center justify-center text-center py-12 md:py-0" >
                        <h1 className="md:w-[50%] text-4xl md:text-5xl lg:text-[46px] font-bold text-darkBlue mb-6 leading-tight">
                            Hotels near chabad house Panama City
                        </h1>
                        <p className="text-base  text-gray-text max-w-2xl mx-auto" >
                            Enjoy a warm stay near the Chabad House, with nearby kosher - friendly hotels and easy access to Shabbat services.
                        </ p>
                    </div >

                </div >

                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-40 h-72 opacity-[0.08]" >
                    <div className="w-full h-full bg-red-300" />
                </div >

                <div className="absolute top-1/3 right-0 w-60 h-72 opacity-[0.08]">
                    <div className="w-full h-full bg-red-300" />
                </div>
            </section >

            {/* Entries */}
            < EntryLayout >
                {
                    contentItems.map((item) => (
                        <CardEntry key={item.id} item={item} isHotel={true} />
                    ))
                }
            </ EntryLayout>
        </Fragment >
    )
}