import Link from "next/link";
import { api } from "@/app/services/strapiApiFetch";
import { getAssetPath } from "@/app/utils/assetPath";
import HightlightCard from "@/app/components/sections/(Entries)/singleHotelsAndActivities/highlightCard";
import InfoBanner from "@/app/components/sections/(Entries)/singleHotelsAndActivities/infoBanner";
import TabledContent from "@/app/components/sections/(Entries)/singleHotelsAndActivities/tabledContent";
import InfoBannerWithButton from "@/app/components/sections/(Entries)/singleHotelsAndActivities/infoBannerWithButton";
import GallerySection from "@/app/components/sections/(Entries)/singleHotelsAndActivities/gallerySection";
import SidebarBooking from "@/app/components/sections/(Entries)/singleHotelsAndActivities/sidebarBooking";
import SidebarMap from "@/app/components/sections/(Entries)/singleHotelsAndActivities/sidebarMap";
import { RelatedHotelCard } from "@/app/components/sections/(Entries)/singleHotelsAndActivities/relatedHotelCard";
import { ScrollToTop } from "@/app/components/ui/common/scrollToTop";

// Helper para procesar imageUrl objeto a URL string
const processImageUrl = (imageUrl) => {
    const url = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    if (imageUrl?.formats?.large?.url) {
        return `${url}${imageUrl.formats.large.url}`;
    }
    if (imageUrl?.url) {
        return `${url}${imageUrl.url}`;
    }
    return getAssetPath("/assets/global/asset001.png");
};

export default async function Single({ params }) {

    const { id } = await params;

    const [activitiesLayoutData, activityData] = await Promise.all([
        api.activities(),
        api.singleActivity(id, true)
    ]);

    // Datos de fallback
    const fallbackData = {
        title: "Activity",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        category: "Adventure",
        tags: [],
        imageUrls: [getAssetPath("/assets/global/asset001.png")],
    };

    // Datos Api Construidos
    const pageData = {
        title: activityData?.title || fallbackData.title,
        description: activityData?.description || fallbackData.description,
        category: activityData?.category || fallbackData.category,
        hours: activityData?.hours || null,
        location: activityData?.location || null,
        tags: activityData?.tags || fallbackData.tags,
        // imageUrl es ahora un array - procesar todas las imágenes para la galería
        imageUrls: activityData?.imageUrl?.length > 0
            ? activityData.imageUrl.map(img => processImageUrl(img))
            : fallbackData.imageUrls,
        // topInfo es objeto, convertir a array para InfoBanner
        topBannerInfo: activityData?.topInfo ? [activityData.topInfo] : [],
        highlightCard: activityData?.highlightCard || [],
        infoTabs: activityData?.infoTabs || [],
        bottomBannerInfo: activityData?.bottomBannerInfo || [],
        sidebar: activityData?.sidebar || null,
        // BookingOptions con B mayúscula en la API
        bookingOptions: activityData?.BookingOptions || [],
        // Video support
        videoUrl: activityData?.videoUrl || null,
        // Map support
        mapUrl: activityData?.mapUrl || null,
        navigateUrl: activityData?.navigate_url || null,
        distance: activityData?.distance || null,
    };

    // Procesar otras actividades (excluir la actual y filtrar datos inválidos)
    const otherActivities = (activitiesLayoutData && Array.isArray(activitiesLayoutData))
        ? activitiesLayoutData
            .filter(activity => activity.documentId && activity.documentId !== id) // Filtrar null/undefined IDs
            .map(activity => ({
                id: activity.documentId,
                title: activity.title || "Activity", // Fallback para título
                description: activity.description || "", // Fallback vacío para descripción
                // imageUrl es array, usar primera imagen para las cards relacionadas
                imageUrls: activity.imageUrl?.[0] ? [processImageUrl(activity.imageUrl[0])] : [getAssetPath("/assets/global/asset001.png")],
                order: activity.order ?? 100
            }))
            .sort((a, b) => a.order - b.order)
            .slice(0, 4)
        : [];

    return (
        <>
            <ScrollToTop />
            <div className="w-full flex justify-center py-2 pb-20 border-t border-gray-200">
                <div className="w-full max-w-7xl px-6 md:px-0">

                {/* Gallery Container */}
                <section className="w-full">
                    {/* Encabezado */}
                    <div className="flex flex-col md:flex-row justify-between items-center py-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-darkBlue">
                                {pageData.title}
                            </h1>
                            {pageData.location && (
                                <p className="text-gray-text text-sm md:text-base leading-relaxed">
                                    {pageData.location}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Galería */}
                    <div id="gallery">
                        <GallerySection
                            imageUrls={pageData.imageUrls}
                            videoUrl={pageData.videoUrl}
                        />
                    </div>
                </section>

                {pageData.topBannerInfo?.length > 0 && (
                    <div className="pt-8 flex flex-col gap-4">
                        {pageData.topBannerInfo
                            .filter(banner => banner && (banner.title || banner.description)) // Filtrar banners vacíos/null
                            .map((banner, index) => (
                            <InfoBanner
                                key={banner.id || index}
                                title={banner.title || "Important:"}
                                description={banner.description || ""}
                            />
                        ))}
                    </div>
                )}

                {/* Main Container Content */}
                <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 mt-8">

                    {/* Content Section */}
                    <div className="lg:w-[65%] flex flex-col gap-12">

                        {pageData.highlightCard?.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                {pageData.highlightCard
                                    .filter(card => card && (card.title || card.description)) // Filtrar cards vacías/null
                                    .map((card, index) => (
                                    <HightlightCard
                                        key={card.id || index}
                                        title={card.title || ""}
                                        description={card.description || ""}
                                        icon={card.icon || null}
                                    />
                                ))}
                            </div>
                        )}

                        <TabledContent tabs={pageData.infoTabs} />

                        {pageData.bottomBannerInfo?.length > 0 && (
                            <div className="flex flex-col gap-4">
                                {pageData.bottomBannerInfo
                                    .filter(banner => banner && (banner.title || banner.description)) // Filtrar banners vacíos/null
                                    .map((banner, index) => (
                                    <InfoBannerWithButton
                                        key={banner.id || index}
                                        title={banner.title || ""}
                                        description={banner.description || ""}
                                        buttonText={banner.buttonText || "Learn more"}
                                        buttonUrl={banner.buttonUrl || "#"}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-[35%] flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
                        <SidebarBooking
                            sidebar={pageData.sidebar}
                            bookingOptions={pageData.bookingOptions}
                            fallbackTitle={pageData.title}
                            fallbackDescription={pageData.description}
                        />

                        {/* Map section - solo si hay mapUrl */}
                        {pageData.mapUrl && (
                            <SidebarMap
                                mapUrl={pageData.mapUrl}
                                navigateUrl={pageData.navigateUrl}
                                title={pageData.title}
                                distance={pageData.distance}
                            />
                        )}
                    </div>
                </div>

                {/* Otras Actividades */}
                {otherActivities.length > 0 && (
                    <section className="pt-16">
                        <h2 className="text-2xl font-bold text-darkBlue mb-6">
                            Explore More Activities
                        </h2>
                        <div className={`gap-10 ${
                            otherActivities.length === 1
                                ? "flex justify-center"
                                : otherActivities.length === 2
                                    ? "grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
                                    : otherActivities.length === 3
                                        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                                        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        }`}>
                            {otherActivities.map((activity) => (
                                <Link
                                    key={activity.id}
                                    href={`/single-activities/${activity.id}`}
                                    className={otherActivities.length === 1 ? "max-w-sm w-full" : ""}
                                >
                                    <RelatedHotelCard
                                        imageUrl={activity.imageUrls[0]}
                                        title={activity.title}
                                        description={activity.description}
                                    />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
                </div>
            </div>
        </>
    );
}
