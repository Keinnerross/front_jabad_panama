const { default: Link } = require("next/link")

export const ButtonTheme = ({ title = "Explore Restaurants", href = "#", variation = 1 }) => {
    const baseClasses = "group inline-flex items-center gap-2 px-6 py-3 border rounded-lg font-medium transition-colors w-fit"
    const variationClasses = {
        1: "border-darkBlue text-gray-800 hover:bg-darkBlue hover:text-white",
        2: "bg-darkBlue text-white hover:bg-transparent hover:text-darkBlue border-darkBlue",
        3: "bg-primary text-white hover:bg-opacity-90 border-transparent",
    }

    return (
        <Link
            href={href}
            className={`${baseClasses} ${variationClasses[variation] || variationClasses[1]}`}
        >
            <span className="font-semibold">{title}</span>
        </Link>
    )
}
