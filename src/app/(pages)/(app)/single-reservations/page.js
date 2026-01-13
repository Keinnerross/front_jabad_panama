import SingleReservationsSection from "@/app/components/sections/(Entries)/singleReservations/singleReservationsSection";
import { api } from "@/app/services/strapiApiFetch";
import { getUpcomingShabbatEvents } from "@/app/services/shabbatTimesApi";
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

export default async function SingleReservations() {
    // Llamadas a la API en paralelo para mejor performance
    const [
        shabbatsAndHolidaysData,
        restaurantsData,
        shabbatsRegisterPricesData,
        pwywSiteConfigData,
        pageData,
        upcomingShabbatEvents
    ] = await Promise.all([
        api.shabbatsAndHolidays(),
        api.restaurants(),
        api.shabbatsRegisterPrices(),
        api.pwywSiteConfig(),
        api.shabbatRegisterSingleReservation(),
        getUpcomingShabbatEvents()
    ]);




    
    
    return (
        <Fragment>
            <Suspense fallback={<PageSkeleton />}>
                <SingleReservationsSection
                    shabbatsAndHolidaysData={shabbatsAndHolidaysData}
                    restaurantsData={restaurantsData}
                    shabbatsRegisterPricesData={shabbatsRegisterPricesData}
                    upcomingShabbatEvents={upcomingShabbatEvents}
                    pwywSiteConfigData={pwywSiteConfigData}
                    pageData={pageData}
                    />
            </Suspense>
        </Fragment>
    );
};

