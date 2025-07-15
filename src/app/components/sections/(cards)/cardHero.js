"use client";

import Image from "next/image";
import Link from "next/link";
import { FaUtensils } from "react-icons/fa"; // Puedes cambiar el ícono si usas uno personalizado

export const CardHero = ({ data }) => {

  const sizeIcon = 45;


  return (
    <Link
      href={data?.href}
      className="group hover:scale-[1.05] duration-400 ease-in-out cursor-pointer flex flex-col justify-start pt-12 w-full max-w-[180px] h-[170px] p-4 bg-white rounded-xl border border-gray-200 transition"
    >

      <div className="flex justify-center items-center relative mb-4">
        <div className="w-14 h-14 bg-blueBackground rounded-full absolute top-1/2 -translate-y-1/2" />
        <div className={`overflow-hidden flex justify-center items-center`}>
          {typeof data.icon === 'string' ? (
            <Image src={data.icon} alt={data.title}
              width={sizeIcon}
              height={sizeIcon}
              className={`${data.title == "Tourist Info"  ? "ml-2" : ""} object-contain z-10 w-full h-full `} />
          ) : (
            <div className={`${data.title == "Tourist Info"  ? "ml-2" : ""} z-10 flex justify-center items-center`}>
              {data.icon}
            </div>
          )}
        </div>
      </div>
      {/* Título */}
      <h3 className="text-center text-myBlack group-hover:text-primary duration-400 ease-in-out font-bold text-base leading-4 mt-4 md:mt-0">
        {data?.title}
      </h3>
    </Link>
  );
};
