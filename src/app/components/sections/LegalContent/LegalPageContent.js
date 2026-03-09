"use client"
import { Fragment } from 'react'
import { MarkdownContent } from '@/app/components/ui/common/markdownContent'
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
                            <MarkdownContent>{description || 'Content will be loaded from Strapi'}</MarkdownContent>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}