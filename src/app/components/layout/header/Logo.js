'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAssetPath } from '@/app/utils/assetPath';

export const Logo = ({ logo }) => {


    const url = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    const logoUrl = `${url}${logo?.url}`
    const logoSrc = logoUrl || getAssetPath('/assets/site/logo.png');

    return (
        <Link href="/" className="w-32 md:w-40 lg:w-48 h-auto transform scale-[1.5] hover:scale-[1.55] transition-transform duration-300">
            <div className="w-full h-12 md:h-12 relative">
                <div className="w-24 h-24">
                    <Image
                        src={logoSrc}
                        alt={"logoAlt"}
                        fill
                        className="object-contain"
                        priority={true}
                        onError={(e) => {
                            console.warn('Logo failed to load, using fallback');
                            e.target.src = getAssetPath('/assets/site/logo.png');
                        }}
                    />
                </div>
            </div>
        </Link>
    );
};