import React from "react";
import { api } from "@/app/services/strapiApiFetch";
import { HeaderClient } from "./header/HeaderClient";

export const Header = async ({ data, customPagesData }) => {
    const siteConfig = await api.siteConfig();

    return (
        <HeaderClient data={data} colorTheme={siteConfig?.color_theme} customPagesData={customPagesData} />
    );
};