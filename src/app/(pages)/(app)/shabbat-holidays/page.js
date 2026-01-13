import ShabbatHolidaysSection from "@/app/components/sections/(Entries)/shabbatHolidays/shabbatHolidaysSection";
import { api } from "@/app/services/strapiApiFetch";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { getShabbatTimes, getUpcomingShabbatEvents } from "@/app/services/shabbatTimesApi";
import { Fragment } from "react";

export default async function ShabbatHolidays() {

    // Llamadas a la API en paralelo para mejor performance
    const [
        ShabbatHolidaysPage,
        popUpsData,
        aboutPageData,
        shabbatTimes,
        upcomingShabbatEvents,
        platformSettings
    ] = await Promise.all([
        api.shabbatsAndHolidaysPage(),
        api.popUps(),
        api.aboutPage(),
        getShabbatTimes(),
        getUpcomingShabbatEvents(),
        api.platformSettings()
    ]);

    const pictures = aboutPageData?.about_page?.pictures || [];
    const aboutPicturesData = {
        imageUrls: imagesArrayValidation(pictures, { imageUrls: [] }) || []
    };

    return (
        <Fragment>
            <ShabbatHolidaysSection
                aboutPicturesData={aboutPicturesData}
                upcomingShabbatEvents={upcomingShabbatEvents}
                shabbatTimes={shabbatTimes}
                ShabbatHolidaysPage={ShabbatHolidaysPage}
                popUpsData={popUpsData}
                platformSettings={platformSettings}
            />
        </Fragment>
    )
} 