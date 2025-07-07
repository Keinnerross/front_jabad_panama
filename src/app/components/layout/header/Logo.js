import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Logo = () => {
    return (
        <Link href="/" className="w-32 md:w-40 lg:w-48 h-auto transform scale-[1.5] hover:scale-[1.55] transition-transform duration-300">
            <div className="w-full h-12 md:h-12 relative">
                <div className="w-24 h-24">
                    <Image src="/assets/site/logo.png" alt="Chabad Logo" fill className="object-contain" />
                </div>
            </div>
        </Link>
    );
};