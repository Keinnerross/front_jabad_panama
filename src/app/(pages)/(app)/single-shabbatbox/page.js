import SingleShabbatBoxSection from "@/app/components/sections/(Entries)/singleShabbatBox/singleShabbatBoxSection";
import { api } from "@/app/services/strapiApiFetch";
import { Fragment, Suspense } from "react";

export default async function SingleShabbatBox() {
    // Llamadas a la API
    const shabbatBoxOptionsData = await api.shabbatBoxOptions();
    const shabbatsAndHolidaysData = await api.shabbatsAndHolidays();
    const restaurantsData = await api.restaurants();
    const shabbatBoxSingleData = await api.shabbatBoxSingle();

    return (
        <Fragment>
            <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div></div>}>
                <SingleShabbatBoxSection 
                    shabbatBoxOptionsData={shabbatBoxOptionsData}
                    shabbatsAndHolidaysData={shabbatsAndHolidaysData}
                    restaurantsData={restaurantsData}
                    shabbatBoxSingleData={shabbatBoxSingleData}
                />
            </Suspense>
        </Fragment>
    );
};