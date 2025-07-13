import SingleReservationsSection from "@/app/components/sections/(Entries)/singleReservations/singleReservationsSection";
import { api } from "@/app/services/strapiApiFetch";
import { Fragment, Suspense } from "react";

export default async function SingleReservations() {
    // Llamada a la API
    const shabbatsAndHolidaysData = await api.shabbatsAndHolidays();
    const restaurantsData = await api.restaurants();
    const shabbatsRegisterPricesData = await api.shabbatsRegisterPrices();



    return (
        <Fragment>
            <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div></div>}>
                <SingleReservationsSection
                    shabbatsAndHolidaysData={shabbatsAndHolidaysData}
                    restaurantsData={restaurantsData}
                    shabbatsRegisterPricesData={shabbatsRegisterPricesData} />
            </Suspense>
        </Fragment>
    );
};