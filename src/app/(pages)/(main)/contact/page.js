import React, { Fragment } from "react";
import { ContactSection } from "@/app/components/sections/Contact/contactSection";
import { MapSection } from "@/app/components/sections/Contact/mapSection";
import { api } from "@/app/services/strapiApiFetch";

export default async function Contact() {
    const siteConfig = await api.siteConfig();
    const copiesData = await api.copiesPages();

    return (
        <Fragment>
            <ContactSection siteConfig={siteConfig} copiesData={copiesData} />
            <MapSection siteConfig={siteConfig} />
        </Fragment>
    );
};