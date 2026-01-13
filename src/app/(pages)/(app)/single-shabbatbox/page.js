import SingleShabbatBoxSection from "@/app/components/sections/(Entries)/singleShabbatBox/singleShabbatBoxSection";
import { api } from "@/app/services/strapiApiFetch";
import { getUpcomingShabbatEvents } from "@/app/services/shabbatTimesApi";
import { Fragment, Suspense } from "react";
import { redirect } from "next/navigation";

export default async function SingleShabbatBox() {
    // Primero verificar si ShabbatBox está activo
    const platformSettings = await api.platformSettings();

    // Si ShabbatBox está desactivado, redirigir a shabbat-holidays
    if (!platformSettings?.isActiveShabbatBox) {
        redirect('/shabbat-holidays');
    }

    // Llamadas a la API en paralelo para mejor performance
    const [
        shabbatBoxOptionsData,
        restaurantsData,
        shabbatBoxSingleData,
        upcomingShabbatEvents,
        pwywSiteConfigData
    ] = await Promise.all([
        api.shabbatBoxOptions(),
        api.restaurants(),
        api.shabbatBoxSingle(),
        getUpcomingShabbatEvents(),
        api.pwywSiteConfig()
    ]);

    return (
        <Fragment>
            <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div></div>}>
                <SingleShabbatBoxSection
                    shabbatBoxOptionsData={shabbatBoxOptionsData}
                    upcomingShabbatEvents={upcomingShabbatEvents}
                    restaurantsData={restaurantsData}
                    shabbatBoxSingleData={shabbatBoxSingleData}
                    pwywSiteConfigData={pwywSiteConfigData}
                />
            </Suspense>
        </Fragment>
    );
};