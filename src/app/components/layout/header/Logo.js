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
        <Link href="/" className="flex-shrink-0">
            <div className="relative w-28 h-16 md:w-32">
                <Image
                    src={logoSrc}
                    alt={"Logo"}
                    fill
                    className="object-contain"
                    priority={true}
                    onError={(e) => {
                        console.warn('Logo failed to load, using fallback');
                        e.target.src = getAssetPath('/assets/site/logo.png');
                    }}
                />
            </div>
        </Link>
    );
};