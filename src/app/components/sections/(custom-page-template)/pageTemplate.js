import Image from "next/image"
import { CategoryTag } from "../../ui/common/categoryTag"
import { getAssetPath } from "@/app/utils/assetPath"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ButtonTheme } from "../../ui/common/buttonTheme"
const { Fragment } = require("react")

export const PageTemplate = ({ singleData }) => {

    const mainPicture = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${singleData?.main_picture?.url || ""}`

    return (
        <Fragment>
            <section className="w-full flex justify-center  bg-blueBackground border-top border-gray-200 overflow-hidden pt-16 pb-20 relative">
                <div className="w-full max-w-7xl px-6 md:px-0">
                    <div className="flex justify-center items-center flex-col gap-10">
                        <div className="md:w-[60%] text-center flex flex-col items-center gap-6">

                            <CategoryTag categoryTitle={singleData.tag || "Tag"} />
                            <h1 className="text-4xl md:text-5xl font-bold text-darkBlue md:w-[60%]">
                                {singleData.title_page || "Page Title"}
                            </h1>
                            <p className="text-gray-text text-sm  leading-relaxed ">
                                {singleData.short_description || "Short description of the page goes here. It should be concise and informative, giving an overview of the content that follows."}
                            </p>
                        </div>
                        <div className="w-full h-80 md:h-[550px] rounded-2xl  overflow-hidden relative">
                            <div className="w-full h-80 md:h-[550px] rounded-xl overflow-hidden relative">
                                <Image
                                    src={mainPicture}
                                    alt={singleData?.title || "Custom page image"}
                                    fill
                                    className="w-full h-full object-cover"
                                    sizes="(max-width: 768px) 100vw, 1200px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* gradient  */}
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-blueBackground z-10" />
                {/* Circle Images */}
                <div className="hidden lg:block absolute left-0 top-4  w-40 h-72 ">
                    <Image src={getAssetPath("/assets/global/circles/a.png")} alt="circle-image" fill className="object-contain" sizes="160px" />
                </div>
                <div className="hidden lg:block absolute right-0 bottom-20 w-60 h-72 ">
                    <Image src={getAssetPath("/assets/global/circles/b.png")} alt="circle-image" fill className="object-contain" sizes="240px" />
                </div>
            </section>
            <section className="w-full flex justify-center pb-20 px-6 md:px-0">
                <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <div className="lg:w-[30%]">
                        <div className="bg-white rounded-xl border border-solid border-gray-200 p-6 sticky top-8">
                            <h2 className="font-semibold text-2xl mb-4">{singleData?.sidebar_title || "Sidebar Title"}</h2>




                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children }) => {
                                        return <h1 className="text-3xl font-bold text-darkBlue  mb-6">{children}</h1>;
                                    },
                                    h2: ({ children }) => {
                                        return <h2 className="text-2xl font-bold text-darkBlue  mb-4">{children}</h2>;
                                    },
                                    h3: ({ children }) => {
                                        return <h3 className="text-xl font-bold text-darkBlue mb-4">{children}</h3>;
                                    },
                                    h4: ({ children }) => {
                                        return <h4 className="text-lg font-bold text-darkBlue mb-3">{children}</h4>;
                                    },
                                    p: ({ children }) => {
                                        return <p className="mb-4 text-sm text-gray-500">{children}</p>;
                                    },
                                    strong: ({ children }) => {
                                        return <strong className="font-semibold text-darkBlue">{children}</strong>;
                                    },
                                    ul: ({ children }) => {
                                        return <ul className="list-disc ml-6 space-y-2">{children}</ul>;
                                    },
                                    ol: ({ children }) => {
                                        return <ol className="list-decimal ml-6 space-y-2">{children}</ol>;
                                    },
                                    li: ({ children }) => {
                                        return <li className="mb-1">{children}</li>;
                                    },
                                    a: ({ href, children }) => {
                                        return <a href={href} className="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>;
                                    },
                                    br: () => {
                                        return <br className="mb-2" />;
                                    },
                                    hr: () => {
                                        return <hr className="my-6 border-0 h-px bg-gray-300" />;
                                    },
                                    table: ({ children }) => {
                                        return <div className="overflow-x-auto mb-4 border border-gray-300 rounded-lg"><table className="min-w-full border-separate border-spacing-0 bg-white rounded-lg shadow-sm overflow-hidden">{children}</table></div>;
                                    },
                                    thead: ({ children }) => {
                                        return <thead className="bg-gray-50">{children}</thead>;
                                    },
                                    tbody: ({ children }) => {
                                        return <tbody className="bg-white">{children}</tbody>;
                                    },
                                    tr: ({ children }) => {
                                        return <tr>{children}</tr>;
                                    },
                                    th: ({ children }) => {
                                        return <th className="px-4 py-3 text-left text-sm font-semibold text-darkBlue border-r border-gray-300 last:border-r-0 [tr:not(:last-child)_&]:border-b">{children}</th>;
                                    },
                                    td: ({ children }) => {
                                        return <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300 last:border-r-0 [tr:not(:last-child)_&]:border-b">{children}</td>;
                                    }
                                }}
                            >
                                {singleData?.sidebar_description || ''}
                            </ReactMarkdown>
                            <ButtonTheme variation={3} href={singleData?.sidebar_link || "https://www.google.com"} title={singleData?.sidebar_text_button || "Title Button"} />
                        </div>
                    </div>
                    {/* Content */}
                    <div className="lg:w-[70%] flex flex-col gap-14">

                        <div className="text-gray-text text-sm leading-relaxed space-y-4 markdown-content">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children }) => <h1 className="text-3xl font-bold text-darkBlue  mb-6">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-2xl font-bold text-darkBlue  mb-4">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-xl font-bold text-darkBlue mb-4">{children}</h3>,
                                    h4: ({ children }) => <h4 className="text-lg font-bold text-darkBlue mb-3">{children}</h4>,
                                    p: ({ children }) => <p className="mb-4">{children}</p>,
                                    strong: ({ children }) => <strong className="font-semibold text-darkBlue">{children}</strong>,
                                    ul: ({ children }) => <ul className="list-disc ml-6 space-y-2">{children}</ul>,
                                    ol: ({ children }) => {
                                        return <ol className="list-decimal ml-6 space-y-2">{children}</ol>;
                                    },
                                    li: ({ children }) => <li className="mb-1">{children}</li>,
                                    a: ({ href, children }) => <a href={href} className="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                                    br: () => <br className="mb-2" />,
                                    hr: () => {
                                        return <hr className="my-6 border-0 h-px bg-gray-300" />;
                                    },
                                    table: ({ children }) => {
                                        return <div className="overflow-x-auto mb-6 border border-gray-300 rounded-lg"><table className="min-w-full border-separate border-spacing-0 bg-white rounded-lg shadow-sm overflow-hidden">{children}</table></div>;
                                    },
                                    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                                    tbody: ({ children }) => <tbody className="bg-white">{children}</tbody>,
                                    tr: ({ children }) => {
                                        return <tr>{children}</tr>;
                                    },
                                    th: ({ children }) => {
                                        return <th className="px-4 py-3 text-left text-sm font-semibold text-darkBlue border-r border-gray-300 last:border-r-0 [tr:not(:last-child)_&]:border-b">{children}</th>;
                                    },
                                    td: ({ children }) => {
                                        return <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300 last:border-r-0 [tr:not(:last-child)_&]:border-b">{children}</td>;
                                    }
                                }}
                            >
                                {singleData?.content || ''}
                            </ReactMarkdown>
                        </div>

                    </div>
                </div>
            </section>
        </Fragment>
    )
}