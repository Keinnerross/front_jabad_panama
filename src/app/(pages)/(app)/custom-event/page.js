import CustomEventSection from "@/app/components/sections/(Entries)/customEvent/customEventSection";
import { api } from "@/app/services/strapiApiFetch";
import { Fragment, Suspense } from "react";

// Loading skeleton component for better UX
const PageSkeleton = () => (
    <div className="w-full flex justify-center mt-10 pb-6 md:pb-20">
        <div className="w-full max-w-7xl px-4 md:px-0">
            <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-40 mb-8 animate-pulse"></div>
            <div className="w-full h-80 md:h-[500px] bg-gray-200 rounded-xl mb-12 animate-pulse"></div>
            <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
            </div>
        </div>
    </div>
);

export default async function CustomEvent() {
    // Fetch API data in parallel for better performance
    const [customEventsData, restaurantsData, globalDeliveryZones] = await Promise.all([
        api.shabbatsAndHolidays(),
        api.restaurants(),
        api.getGlobalDeliveryZones()
    ]);

    return (
        <Fragment>
            <Suspense fallback={<PageSkeleton />}>
                <CustomEventSection
                    customEventsData={customEventsData}
                    restaurantsData={restaurantsData}
                    globalDeliveryZones={globalDeliveryZones}
                />
            </Suspense>
        </Fragment>
    );
};