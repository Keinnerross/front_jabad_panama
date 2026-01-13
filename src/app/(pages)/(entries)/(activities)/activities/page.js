import React, { Fragment } from "react";
import { HeroActivities } from "@/app/components/sections/Activities/heroActivities";
import { PackagesHome } from "@/app/components/sections/Home/packagesHome";
import { WhyPackagesSection } from "@/app/components/sections/Packages/whyPackagesSection";
import { api } from "@/app/services/strapiApiFetch";
import { ActivitiesSection } from "@/app/components/sections/Activities/activitiesSection";


export default async function Restaurants() {
    // Llamadas a la API en paralelo para mejor performance
    const [platformSettings, activitiesData, copiesData] = await Promise.all([
        api.platformSettings(),
        api.activities(),
        api.copiesPages()
    ]);

    // packagesData depende de platformSettings, se ejecuta después
    const packagesData = platformSettings?.habilitar_packages ? await api.packages() : null;




    


    return (
        <Fragment>
            {/* HERO */}
            <section className="relative flex flex-col items-center w-full bg-white ">
                <HeroActivities activitiesData={activitiesData} copiesData={copiesData} />
            </section>

            <ActivitiesSection activitiesData={activitiesData} packagesData={packagesData} singleActivitiesActive={platformSettings?.SingleActivitiesActive === true} />
            {platformSettings.habilitar_packages && (
                <>
                    <PackagesHome packagesData={packagesData} isHero={false} href="#whyPackages" />
                    <WhyPackagesSection packagesData={packagesData} />
                </>
            )}
        </Fragment >
    );
};



