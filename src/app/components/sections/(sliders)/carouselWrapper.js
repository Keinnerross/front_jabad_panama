"use client"
import useEmblaCarousel from "embla-carousel-react"
import { useCallback } from "react"
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";



export const CarouselWrapper = ({ children }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel()

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative w-full">
      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 scroll-snap-x snap-mandatory">{children}</div>
      </div>

      {/* Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full max-w-7xl">
        <button
          onClick={scrollPrev}
          className="absolute left-[-30px] top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition cursor-pointer">
          <span className="text-xl"><FaArrowLeftLong  size={18}/></span>
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-black text-white shadow-md flex items-center justify-center hover:bg-gray-800 transition cursor-pointer"
        >
          <span className="text-xl"><FaArrowRightLong size={18} /></span>
        </button>
      </div>

    </div>
  )
}
