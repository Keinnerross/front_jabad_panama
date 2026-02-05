import ShabbatHolidaysSection from "@/app/components/sections/(Entries)/shabbatHolidays/shabbatHolidaysSection";
import { api } from "@/app/services/strapiApiFetch";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { getShabbatTimes, getUpcomingShabbatEvents } from "@/app/services/shabbatTimesApi";
import { getLocationByCity } from "@/app/services/geoLocationService";
import { Fragment } from "react";

export default async function ShabbatHolidays() {

    // First fetch platformSettings to get location configuration
    const platformSettings = await api.platformSettings();

    // Get location config based on city and country from platform settings
    const locationConfig = getLocationByCity(
        platformSettings?.ciudad,
        platformSettings?.pais
    );

    // Parallel API calls with location-aware Shabbat times
    const [
        ShabbatHolidaysPage,
        popUpsData,
        aboutPageData,
        shabbatTimesData,
        upcomingShabbatEventsData
    ] = await Promise.all([
        api.shabbatsAndHolidaysPage(),
        api.popUps(),
        api.aboutPage(),
        getShabbatTimes(locationConfig),
        getUpcomingShabbatEvents(locationConfig)
    ]);

    const pictures = aboutPageData?.about_page?.pictures || [];
    const aboutPicturesData = {
        imageUrls: imagesArrayValidation(pictures, { imageUrls: [] }) || []
    };

    // Extract events array from the result object
    const upcomingShabbatEvents = upcomingShabbatEventsData.events || upcomingShabbatEventsData;

    // Combine shabbat times with referential flag
    const shabbatTimes = {
        ...shabbatTimesData,
        // Mark as referential if either times or events are referential
        isReferential: shabbatTimesData.isReferential || upcomingShabbatEventsData.isReferential
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