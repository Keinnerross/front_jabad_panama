import React, { Fragment } from "react"
import { VisitorInformationSection } from "@/app/components/sections/(Entries)/visitor-information/visitorInformationSection";
import { api } from "@/app/services/strapiApiFetch";

export default async function TouristInfo() {
    const infoTouristData = await api.infoTourist();
    const socialMediaLinksData = await api.socialMediaLinks();



    return (
        <Fragment>
            <VisitorInformationSection infoTouristData={infoTouristData} socialMediaLinksData={socialMediaLinksData} />
        </Fragment>
    );
}