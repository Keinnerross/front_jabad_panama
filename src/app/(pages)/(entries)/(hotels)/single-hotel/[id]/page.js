import Link from "next/link";
import { api } from "@/app/services/strapiApiFetch";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { getAssetPath } from "@/app/utils/assetPath";
import HightlightCard from "@/app/components/sections/(Entries)/singleHotelsAndActivities/highlightCard";
import InfoBanner from "@/app/components/sections/(Entries)/singleHotelsAndActivities/infoBanner";
import TabledContent from "@/app/components/sections/(Entries)/singleHotelsAndActivities/tabledContent";
import InfoBannerWithButton from "@/app/components/sections/(Entries)/singleHotelsAndActivities/infoBannerWithButton";
import GallerySection from "@/app/components/sections/(Entries)/singleHotelsAndActivities/gallerySection";
import SidebarMap from "@/app/components/sections/(Entries)/singleHotelsAndActivities/sidebarMap";
import SidebarBooking from "@/app/components/sections/(Entries)/singleHotelsAndActivities/sidebarBooking";
import { RelatedHotelCard } from "@/app/components/sections/(Entries)/singleHotelsAndActivities/relatedHotelCard";
import { ScrollToTop } from "@/app/components/ui/common/scrollToTop";





export default async function Single({ params }) {

    const { id } = await params;



    const [hotelsLayoutData, hotelsData] = await Promise.all([
        api.hotels(),
        api.singleHotel(id, true)
    ]);

    // Datos de fallback
    const fallbackData =
    {
        title: "Title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        category: "Kosher",
        website: "#",
        address: "#",
        established: "number",
        tags: [],
        imageUrls: [],
        menu: "#",
        fullDescription: "Description Hotel Here"
    };


    // Datos Api Construidos
    const pageData = {
        title: hotelsData?.title || fallbackData.title,
        description: hotelsData?.description || fallbackData.description,
        category: hotelsData?.category || fallbackData.category,
        website: hotelsData?.website || fallbackData.website,
        address: hotelsData?.address || fallbackData.address,
        established: hotelsData?.established || fallbackData.established,
        tags: hotelsData?.tags || fallbackData.tags,
        imageUrls: imagesArrayValidation(hotelsData?.imageUrls, fallbackData) || fallbackData.imageUrls,
        videoUrl: hotelsData?.videoUrl || null,
        menu: hotelsData?.menu || fallbackData.menu,
        fullDescription: hotelsData?.fullDescription || fallbackData.fullDescription,
        topBannerInfo: hotelsData?.topBannerInfo || [],
        highlightCard: hotelsData?.highlightCard || [],
        mapUrl: hotelsData?.mapUrl || null,
        navigateUrl: hotelsData?.navigate_url || null,
        distance: hotelsData?.distance || null,
        infoTabs: hotelsData?.infoTabs || [],
        bottomBannerInfo: hotelsData?.bottomBannerInfo || [],
        sidebar: hotelsData?.sidebar || null,
        bookingOptions: hotelsData?.bookingOptions || [],
    };

    // Procesar otros hoteles (excluir el actual y filtrar datos inválidos)
    const otherHotels = (hotelsLayoutData && Array.isArray(hotelsLayoutData))
        ? hotelsLayoutData
            .filter(hotel => hotel.documentId && hotel.documentId !== id) // Filtrar null/undefined IDs
            .map(hotel => ({
                id: hotel.documentId,
                title: hotel.title || "Hotel", // Fallback para título
                description: hotel.description || "", // Fallback vacío para descripción
                imageUrls: imagesArrayValidation(hotel.imageUrls, { imageUrls: [getAssetPath("/assets/global/asset001.png")] }) || [],
                order: hotel.order ?? 100
            }))
            .sort((a, b) => a.order - b.order)
            .slice(0, 4)
        : [];




    return (
        <>
            <ScrollToTop />
            <div className="w-full flex justify-center py-2 pb-20  border-t border-gray-200">
                <div className="w-full max-w-7xl px-6 md:px-0">


                {/* Galery Container */}
                <section className="w-full ">
                    {/* Encabezado */}
                    <div className="flex flex-col md:flex-row justify-between items-center py-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-darkBlue">
                                {pageData.title}
                            </h1>
                            <p className="text-gray-text text-sm md:text-base leading-relaxed">
                                {pageData.address}
                            </p>
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


                {/* Main Container Content*/}
                <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 mt-8">

                    {/* Content Section */}
                    <div className="lg:w-[65%] flex flex-col gap-12">

                        {pageData.highlightCard?.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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

                        {/* Map section */}
                        <SidebarMap
                            mapUrl={pageData.mapUrl}
                            navigateUrl={pageData.navigateUrl}
                            title={pageData.title}
                            distance={pageData.distance}
                        />

                    </div>
                </div>

                {/* Otros Hoteles */}
                {otherHotels.length > 0 && (
                    <section className="pt-16">
                        <h2 className="text-2xl font-bold text-darkBlue mb-6">
                            Explore More Hotels
                        </h2>
                        <div className={`gap-10 ${
                            otherHotels.length === 1
                                ? "flex justify-center"
                                : otherHotels.length === 2
                                    ? "grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
                                    : otherHotels.length === 3
                                        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                                        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        }`}>
                            {otherHotels.map((hotel) => (
                                <Link
                                    key={hotel.id}
                                    href={`/single-hotel/${hotel.id}`}
                                    className={otherHotels.length === 1 ? "max-w-sm w-full" : ""}
                                >
                                    <RelatedHotelCard
                                        imageUrl={hotel.imageUrls[0]}
                                        title={hotel.title}
                                        description={hotel.description}
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