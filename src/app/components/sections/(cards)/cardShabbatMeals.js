"use client";

import Image from "next/image";
import Link from "next/link";
import { FaUtensils } from "react-icons/fa"; // Puedes cambiar el ícono si usas uno personalizado

export const CardShabbatMeals = ({ data }) => {

  const sizeIcon = 40


  return (
    <Link
      href={data?.href}
      className="cursor-pointer flex flex-col justify-start pt-12 w-full md:w-48 h-48 p-4 bg-white rounded-xl border border-gray-200 transition"
    >
      {/* Icono o Imagen dinámica */}

      <div className="flex justify-center items-center relative">


        <div className="w-14 h-14 bg-blueBackground rounded-full absolute top-1/2 -translate-y-1/2" />


        <div className="flex justify-center items-center w-14 h-14 mb-4">
          <Image src={data.icon} alt={data.title}
            width={sizeIcon}
            height={sizeIcon}
            className="object-contain z-10 w-full h-full" />
        </div>
      </div>
      {/* Título */}
      <h3 className="text-center text-myBlack font-semibold text-sm md:text-base leading-4 mb-2">
        {data?.title}
      </h3>
      <p className="text-center text-myBlack  font-medium text-sm  leading-4"> {data?.hour} </p>
    </Link>
  );
};
