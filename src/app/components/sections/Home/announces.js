import Image from 'next/image';
import Link from 'next/link';
import { getAssetPath } from "@/app/utils/assetPath";

export const Announces = ({ announcesData = [] }) => {
    if (!announcesData || announcesData.length === 0) {
        return null;
    }

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

    return (

        <div className="w-full bg-blueBackground">


            <div className="max-w-7xl mx-auto space-y-12 px-4 sm:px-6 lg:px-4 py-14">
                {announcesData.map((event, index) => {
                    const announce = event.announce;

                    const backgroundImage = announce?.banner_background?.url
                        ? `${baseUrl}${announce.banner_background.url}`
                        : getAssetPath("/assets/global/asset001.png");

                    const title = announce?.title_banner || event.name || "Event";
                    const description = announce?.short_description || "";
                    const buttonText = announce?.button_text || "Learn More";

                    // Determine the link - use documentId (permanent ID) or fallback to id
                    let href = `/custom-event?event=${event.documentId || event.id}`;
                    let isExternal = false;

                    if (announce?.external_link) {
                        href = announce.external_link;
                        isExternal = true;
                    }

                    const CardContent = (
                        <div
                            className="relative w-full md:min-h-[20rem] md:h-auto min-h-[400px] rounded-3xl overflow-hidden group"
                        >
                            {/* Background Image */}
                            <Image
                                src={backgroundImage}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, 1200px"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12">
                                <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-white mb-2 max-w-2xl">
                                    {title}
                                </h2>
                                {description && (
                                    <p className="text-white/80 text-base md:text-lg mb-6 max-w-2xl">
                                        {description}
                                    </p>
                                )}

                                <span className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg group-hover:bg-primary-dark transition-colors duration-200">
                                    {buttonText}
                                </span>
                            </div>
                        </div>
                    );

                    return isExternal ? (
                        <a
                            key={index}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block cursor-pointer"
                        >
                            {CardContent}
                        </a>
                    ) : (
                        <Link
                            key={index}
                            href={href}
                            className="block cursor-pointer"
                        >
                            {CardContent}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};