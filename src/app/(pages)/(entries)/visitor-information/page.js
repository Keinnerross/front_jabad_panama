import React, { Fragment } from "react"
import { VisitorInformationSection } from "@/app/components/sections/(Entries)/visitor-information/visitorInformationSection";
import { api } from "@/app/services/strapiApiFetch";

export default async function TouristInfo() {
    // Llamadas a la API en paralelo para mejor performance
    const [infoTouristData, socialMediaLinksData, copiesData] = await Promise.all([
        api.infoTourist(),
        api.socialMediaLinks(),
        api.copiesPages()
    ]);

    


    return (
        <Fragment>
            <VisitorInformationSection infoTouristData={infoTouristData} socialMediaLinksData={socialMediaLinksData} infoTouristPageData={copiesData?.visitor_info}  />
        </Fragment>
    );
}