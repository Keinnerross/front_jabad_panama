import React, { Fragment } from "react"
import { VisitorInformationSection } from "@/app/components/sections/(Entries)/visitor-information/visitorInformationSection";
import { api } from "@/app/services/strapiApiFetch";

export default async function TouristInfo() {
    const infoTouristData = await api.infoTourist();
    const infoTouristPageData = await api.infoTouristPage();
    const socialMediaLinksData = await api.socialMediaLinks();

    


    return (
        <Fragment>
            <VisitorInformationSection infoTouristData={infoTouristData} socialMediaLinksData={socialMediaLinksData} infoTouristPageData={infoTouristPageData} />
        </Fragment>
    );
}