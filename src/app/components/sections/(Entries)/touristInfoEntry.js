import Image from "next/image"
import { MarkdownContent } from '@/app/components/ui/common/markdownContent'



const url = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';





export const TouristInfoEntry = ({ data }) => {
    return (
        <section className=" tourist-content">
            <h2 className="text-3xl font-bold text-darkBlue mb-6">
                {data?.title}
            </h2>
            <div className="text-gray-text text-sm leading-relaxed space-y-4 mb-4 markdown-content">
                <MarkdownContent>{data?.shortDescription || ''}</MarkdownContent>
            </div>
            <div className="w-full h-[330px] overflow-hidden rounded-2xl relative">
                <Image
                    src={`${url}${data.imageUrls?.formats?.medium?.url || data.imageUrls?.url}`}
                    fill
                    className="w-full h-full object-cover"
                    alt={data?.title || "Tourist information image"}
                    sizes="(max-width: 768px) 100vw, 800px"
                />
            </div>
            <div className="text-gray-text text-sm leading-relaxed space-y-4 mt-4 markdown-content">
                <MarkdownContent>{data?.longDescription || ''}</MarkdownContent>
            </div>
        </section>
    )
}