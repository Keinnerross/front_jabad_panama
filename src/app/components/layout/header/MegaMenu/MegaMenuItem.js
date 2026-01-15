import React from 'react';
import Link from 'next/link';

export const MegaMenuItem = ({ item }) => {
    const IconComponent = item.icon;

    const linkClasses = "flex items-center px-4 py-2 text-gray-600 hover:text-primary cursor-pointer font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-1";
    const iconClasses = `${IconComponent?.name === 'FaStarOfDavid' ? 'mr-3 text-sm' : 'mr-3 text-base'} flex-shrink-0 w-4 h-4`;

    if (item.isExternalLink) {
        return (
            <a
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
            >
                {IconComponent && <IconComponent className={iconClasses} />}
                <span className="flex-1 truncate max-w-[280px]">{item.name}</span>
            </a>
        );
    }

    return (
        <Link href={item.path} className={linkClasses}>
            {IconComponent && <IconComponent className={iconClasses} />}
            <span className="flex-1 truncate max-w-[280px]">{item.name}</span>
        </Link>
    );
};
