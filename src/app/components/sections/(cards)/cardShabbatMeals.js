"use client";

import Image from "next/image";

export const CardShabbatMeals = ({ data }) => {

  const sizeIcon = 40


  return (
    <div
      className="cursor-pointer flex flex-col justify-start pt-12 w-full md:w-48 h-48 p-4 bg-white rounded-xl border border-gray-200 transition hover:scale-[1.1]"
    >
      {/* Icono o Imagen dinámica */}
      <div className="flex justify-center items-center relative">
        <div className="w-14 h-14 bg-blueBackground rounded-full absolute top-1/2 -translate-y-1/2 z-0" />
        <div className="flex justify-center items-center w-14 h-14 mb-4 z-20">
          {typeof data.icon === 'string' ? (
            <Image src={data.icon} alt={data.title}
              width={sizeIcon}
              height={sizeIcon}
              className="object-contain z-10 w-full h-full" />
          ) : (
            <data.icon className="z-10" />
          )}
        </div>
      </div>
      {/* Título */}
      <h3 className="text-center text-darkBlue font-semibold text-sm md:text-base leading-4 mb-2">
        {data?.title}
      </h3>
      <p className="text-center text-myBlack  font-medium text-sm  leading-4"> {data?.hour} </p>
    </div>
  );
};
