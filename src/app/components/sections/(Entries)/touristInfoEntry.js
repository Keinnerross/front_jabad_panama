import Image from "next/image"
import ReactMarkdown from 'react-markdown'



const url = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';





export const TouristInfoEntry = ({ data }) => {
    return (
        <section className=" tourist-content">
            <h2 className="text-3xl font-bold text-darkBlue mb-6">
                {data?.title}
            </h2>
            <div className="text-gray-text text-sm leading-relaxed space-y-4 mb-4 markdown-content">
                <ReactMarkdown 
                    components={{
                        p: ({children}) => <p className="mb-4">{children}</p>,
                        strong: ({children}) => <strong className="font-semibold text-darkBlue">{children}</strong>,
                        ul: ({children}) => <ul className="list-disc ml-6 space-y-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal ml-6 space-y-2">{children}</ol>,
                        li: ({children}) => <li className="mb-1">{children}</li>,
                        a: ({href, children}) => <a href={href} className="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                        h4: ({children}) => <h4 className="text-lg font-bold text-darkBlue mt-6 mb-3">{children}</h4>
                    }}
                >
                    {data?.shortDescription || ''}
                </ReactMarkdown>
            </div>
            <div className="w-full h-[330px] overflow-hidden rounded-2xl relative">
                <Image
                    src={`${url}${data.imageUrls?.url}`}
                    fill
                    className="w-full h-full object-cover"
                    alt={data?.title || "Tourist information image"}
                />
            </div>
            <div className="text-gray-text text-sm leading-relaxed space-y-4 mt-4 markdown-content">
                <ReactMarkdown 
                    components={{
                        p: ({children}) => <p className="mb-4">{children}</p>,
                        strong: ({children}) => <strong className="font-semibold text-darkBlue">{children}</strong>,
                        ul: ({children}) => <ul className="list-disc ml-6 space-y-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal ml-6 space-y-2">{children}</ol>,
                        li: ({children}) => <li className="mb-1">{children}</li>,
                        a: ({href, children}) => <a href={href} className="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                        h4: ({children}) => <h4 className="text-lg font-bold text-darkBlue mt-6 mb-3">{children}</h4>,
                        h3: ({children}) => <h3 className="text-xl font-bold text-darkBlue mt-8 mb-4">{children}</h3>,
                        h2: ({children}) => <h2 className="text-2xl font-bold text-darkBlue mt-10 mb-4">{children}</h2>,
                        br: () => <br className="mb-2" />
                    }}
                >
                    {data?.longDescription || ''}
                </ReactMarkdown>
            </div>
        </section>
    )
}