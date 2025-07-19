import ShabbatHolidaysSection from "@/app/components/sections/(Entries)/shabbatHolidays/shabbatHolidaysSection";
import { api } from "@/app/services/strapiApiFetch";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { getShabbatTimes } from "@/app/services/shabbatTimesApi";
import { Fragment } from "react";
import { cookies } from 'next/headers';


export default async function ShabbatHolidays() {
    const cookieStore = cookies(); // Force dynamic rendering





    //Llamada a la API
    const aboutPageData = await api.aboutPage() || {};
    const shabbatsAndHolidaysData = await api.shabbatsAndHolidays() || [];
    const shabbatTimes = await getShabbatTimes() || {};
    const pictures = aboutPageData?.about_page?.pictures || [];
    const aboutPicturesData = {
        imageUrls: imagesArrayValidation(pictures, { imageUrls: [] }) || []
    };



    return (
        <Fragment>
            <ShabbatHolidaysSection 
                aboutPicturesData={aboutPicturesData} 
                shabbatsAndHolidaysData={shabbatsAndHolidaysData}
                shabbatTimes={shabbatTimes}
            />
        </Fragment>

    )


} 