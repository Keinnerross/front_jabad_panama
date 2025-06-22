"use client";

import Image from "next/image";
import { FaUtensils } from "react-icons/fa"; // Puedes cambiar el ícono si usas uno personalizado

export const CardHero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[200px] min-h-[180px] p-4 bg-white rounded-xl border border-gray-200  transition ">
      {/* Icono o Imagen dinámica */}
      <div className="w-12 h-12 bg-blueBackground rounded-full flex items-center justify-center mb-4">
        {/* Este ícono puede reemplazarse por una imagen dinámica más adelante */}
        <FaUtensils className="text-[--color-primary] text-2xl" />
      </div>

      {/* Título */}
      <h3 className="text-center text-myBlack font-semibold text-base">
        Kosher Food
      </h3>
    </div>
  );
};
