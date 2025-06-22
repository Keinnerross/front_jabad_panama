"use client";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";

export const TourCard = ({
  image = "https://via.placeholder.com/300",
  title = "Casco Viejo Urban Art Tour",
  description = "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
  tags = ["Tours", "Family", "Full Day"],
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl  p-4 max-w-2xl w-full">
      {/* Imagen */}
      <div className="w-full sm:w-1/3 rounded-lg overflow-hidden bg-red-300">
        <Image
          src={image}
          alt={title}
          width={300}
          height={300}
          unoptimized
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-2 flex-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-sm font-medium">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`${
                i === 0 ? "bg-primary text-white px-2 py-1 rounded-md" : "text-primary"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Título */}
        <h3 className="text-myBlack font-bold text-lg mt-1">{title}</h3>

        {/* Descripción */}
        <p className="text-gray-text text-sm leading-snug">{description}</p>

        {/* CTA con ícono */}
        <div className="mt-auto">
          <a
            href="#"
            className="flex items-center gap-2 text-primary text-sm font-medium underline"
          >
            <FaPlay className="text-xs" />
            Recommended travel experts
          </a>
        </div>
      </div>
    </div>
  );
};
