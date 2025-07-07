'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"

export const ButtonTheme = ({
  title = "Explore",
  href = "",
  variation = 1,
  onClick,
  disableLink = false,
  isFull = false
}) => {
  const router = useRouter()

  const baseClasses = `group inline-flex items-center gap-2 px-6 py-3 border rounded-lg transition-colors text-base text-medium cursor-pointer ease-in-out duration-300 ${
    isFull ? "w-full justify-center" : "w-fit"
  }`

  const variationClasses = {
    1: "border-darkBlue text-gray-800 hover:bg-darkBlue hover:text-white",
    2: "bg-darkBlue text-white hover:bg-transparent hover:text-darkBlue border-darkBlue",
    3: "bg-primary text-white hover:bg-opacity-90 border-transparent",
  }

  const className = `${baseClasses} ${variationClasses[variation] || variationClasses[1]}`

  const isExternal = (url) => /^https?:\/\//.test(url)

  // 🔹 Si hay lógica o navegación deshabilitada → <button>
  if (onClick || disableLink) {
    const handleClick = (e) => {
      e.preventDefault()
      onClick?.(e)
      if (!disableLink && href) router.push(href)
    }

    return (
      <button onClick={handleClick} className={className}>
        <span>{title}</span>
      </button>
    )
  }

  // 🔹 Si es enlace externo → <a>
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <span>{title}</span>
      </a>
    )
  }

  // 🔹 Si es enlace interno → <Link>
  return (
    <Link href={href} className={className}>
      <span>{title}</span>
    </Link>
  )
}
