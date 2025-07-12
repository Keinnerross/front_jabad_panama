import React, { Fragment } from "react";
import { HeroActivities } from "@/app/components/sections/Activities/heroActivities";
import { PackagesHome } from "@/app/components/sections/Home/packagesHome";
import { WhyPackagesSection } from "@/app/components/sections/Packages/whyPackagesSection";
import { NewsletterSection } from "@/app/components/sections/Common/newsletterSection";
import { api } from "@/app/services/strapiApiFetch";
import { ActivitiesSection } from "@/app/components/sections/Activities/activitiesSection";


export default async function Restaurants() {
    // Content data - can be moved to a separate file or fetched from CMS

    const activitiesData = await api.activities();
    const packagesData = await api.packages();


    return (
        <Fragment>
            {/* HERO */}
            <section className="relative flex flex-col items-center w-full bg-white ">
                <HeroActivities activitiesData={activitiesData} />
            </section>

            <ActivitiesSection activitiesData={activitiesData} packagesData={packagesData} />
            <PackagesHome packagesData={packagesData} isHero={false} href="#whyPackages" />
            <WhyPackagesSection packagesData={packagesData} />
            {/*       <NewsletterSection /> */}
            {/*  <ActivitiesSecundarySection /> */}
        </Fragment >
    );
};



