import React from "react";
import { FiAlertCircle } from "react-icons/fi";

/**
 * Componente de banner informativo totalmente responsive usando Flexbox (Auto Layout).
 * Permite que el contenido (título y descripción) se ajuste automáticamente al ancho disponible.
 */
export const InfoBanner = ({ 
    title = "Important:", 
    description = "The activities and services mentioned are recommendations only. Chabad is not operationally or administratively responsible for them." 
}) => {
    return (
      
        <div className="flex w-full items-start gap-4 p-4 min-h-[63px] relative bg-[#06aed5] rounded-[0px_20px_0px_20px] overflow-hidden border border-solid border-white">
            
            <div className="flex-shrink-0 w-7 h-7 text-white">
                <FiAlertCircle className="w-full h-full" />
            </div>

     
            <div className="flex-grow text-white text-sm md:text-base leading-normal">
                
                <p>
                    <span className="font-bold mr-1">{title}</span> 
                    <span>{description}</span>
                </p>
                
            </div>
        </div>
    );
};

export default InfoBanner;