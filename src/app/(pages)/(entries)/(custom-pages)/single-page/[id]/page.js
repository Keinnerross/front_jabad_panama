import { Fragment } from "react";
import { PageTemplate } from "@/app/components/sections/(custom-page-template)/pageTemplate";
import { strapiFetchById } from "@/app/services/strapiApiFetch";

export default async function SingleCustomPage({ params }) {
    const { id } = await params;

    // Obtener datos específicos del elemento usando documentId
    const customPageData = await strapiFetchById("/page-customs", id, true);

    return (
        <Fragment>
            <PageTemplate singleData={customPageData} />
        </Fragment>
    );
};