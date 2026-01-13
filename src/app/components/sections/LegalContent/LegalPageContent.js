"use client"
import { Fragment } from 'react'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import { getAssetPath } from '@/app/utils/assetPath'

export const LegalPageContent = ({ title, description }) => {
    return (
        <Fragment>
            {/* Hero Section with blue background */}
            <section className="w-full flex justify-center bg-blueBackground overflow-hidden pt-16 pb-20 relative">
                <div className="w-full max-w-7xl px-6 md:px-0">
                    <div className="flex justify-center items-center flex-col gap-6">
                        <div className="md:w-[60%] text-center flex flex-col items-center gap-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-darkBlue">
                                {title}
                            </h1>
                        </div>
                    </div>
                </div>
                
                {/* Gradient */}
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-blueBackground z-10" />
                
                {/* Circle decorations */}
                <div className="hidden lg:block absolute left-0 top-4 w-40 h-72">
                    <Image src={getAssetPath("/assets/global/circles/a.png")} alt="circle-image" fill className="object-contain" sizes="160px" />
                </div>
                <div className="hidden lg:block absolute right-0 bottom-20 w-60 h-72">
                    <Image src={getAssetPath("/assets/global/circles/b.png")} alt="circle-image" fill className="object-contain" sizes="240px" />
                </div>
            </section>

            {/* Content Section */}
            <section className="w-full flex justify-center pb-20 px-6 md:px-0">
                <div className="w-full max-w-4xl">
                    <div className="bg-white rounded-xl border border-solid border-gray-200 p-8 md:p-12">
                        <div className="prose prose-gray max-w-none">
                            <ReactMarkdown 
                                components={{
                                    h1: ({children}) => <h1 className="text-3xl font-bold text-darkBlue mb-6">{children}</h1>,
                                    h2: ({children}) => <h2 className="text-2xl font-bold text-darkBlue mb-4 mt-8">{children}</h2>,
                                    h3: ({children}) => <h3 className="text-xl font-bold text-darkBlue mb-4 mt-6">{children}</h3>,
                                    h4: ({children}) => <h4 className="text-lg font-bold text-darkBlue mb-3 mt-4">{children}</h4>,
                                    p: ({children}) => <p className="mb-4 text-gray-text text-sm leading-relaxed">{children}</p>,
                                    strong: ({children}) => <strong className="font-semibold text-darkBlue">{children}</strong>,
                                    ul: ({children}) => <ul className="list-disc ml-6 space-y-2 text-gray-text text-sm">{children}</ul>,
                                    ol: ({children}) => <ol className="list-decimal ml-6 space-y-2 text-gray-text text-sm">{children}</ol>,
                                    li: ({children}) => <li className="mb-1">{children}</li>,
                                    a: ({href, children}) => <a href={href} className="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                                    br: () => <br className="mb-2" />,
                                    blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4">{children}</blockquote>
                                }}
                            >
                                {description || 'Content will be loaded from Strapi'}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}