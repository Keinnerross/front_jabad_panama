'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"

export const ButtonTheme = ({ title = "Explore", href = "", variation = 1, onClick, disableLink = false }) => {
    const router = useRouter()

    const baseClasses = "group inline-flex items-center gap-2 px-6 py-3 border rounded-lg font-medium transition-colors w-fit"
    const variationClasses = {
        1: "border-darkBlue text-gray-800 hover:bg-darkBlue hover:text-white",
        2: "bg-darkBlue text-white hover:bg-transparent hover:text-darkBlue border-darkBlue",
        3: "bg-primary text-white hover:bg-opacity-90 border-transparent",
    }

    const className = `${baseClasses} ${variationClasses[variation] || variationClasses[1]}`

    // 🔹 Si hay lógica o navegación deshabilitada → <button>
    if (onClick || disableLink) {
        const handleClick = (e) => {
            e.preventDefault()
            onClick?.(e)
            if (!disableLink && href) router.push(href)
        }

        return (
            <button onClick={handleClick} className={className}>
                <span className="font-semibold">{title}</span>
            </button>
        )
    }

    // 🔹 Si es solo navegación → <Link>
    return (
        <Link href={href} className={className}>
            <span className="font-semibold">{title}</span>
        </Link>
    )
}
