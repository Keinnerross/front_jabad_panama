'use client';

import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { RiTreeLine } from "react-icons/ri";

const InfoBannerWithButton = ({
    title = "Title",
    description = "Description",
    buttonText = "Book now",
    buttonUrl = "/"
}) => {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 px-6 py-5 bg-[#fffdfd] rounded-[0px_20px_0px_20px] border border-solid border-gray-300">
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                    <RiTreeLine className="text-primary" size={26} />
                    <h4 className="font-bold text-darkBlue text-base md:text-lg">
                        {title}
                    </h4>
                </div>
                <p className="text-gray-text text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {description}
                </p>
            </div>


            <ButtonTheme variation={1} href={buttonUrl}>
                {buttonText}

            </ButtonTheme>
        
        </div>
    );
};

export default InfoBannerWithButton;
