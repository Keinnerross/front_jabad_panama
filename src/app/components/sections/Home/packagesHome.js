
'use client'
import React from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { PackagesVideo } from "./packagesVideo";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";


export const PackagesHome = ({ href, packagesData }) => {




  const data = {
    packages: ["Gold", "Platinum", "Ultra Luxury"]
  };


  const fallbackData = {
    title: "Title Section",
    description_1: "Lorem imspum",
    description_2: "Lorem imspum",
    videoUrl: "",
    show_gobeyond_logo: true,
    imagesUrl: ["/assets/global/asset001.png", "/assets/global/asset001.png"]
  };


  // Separamos info de about
  const packagesInfo = packagesData?.hero_packages;
  const pictures = packagesData?.hero_packages.pictures || [];



  // Procesamos datos con fallback
  const pageData = {
    title: packagesInfo?.title || fallbackData.title,
    description_1: packagesInfo?.description_1 || fallbackData.description_1,
    description_2: packagesInfo?.description_2 || fallbackData.description_2,
    videoUrl: packagesInfo?.videoUrl || fallbackData.videoUrl,
    show_gobeyond_logo: packagesInfo?.show_gobeyond_logo,
    pictures: imagesArrayValidation(pictures, fallbackData)
  };








  return (
    <div className="w-full bg-blueBackground">
      {/* Hero Section */}
      <section className={`max-w-7xl mx-auto px-6 md:px-0  pt-10 md:pt-18 md:pb-10 pb-0 `}>
        <div className="flex flex-col lg:flex-row gap-12 ">
          {/* Text Content */}
          <div className="w-full lg:w-5/12 flex flex-col">
            <h1 className="text-4xl md:text-4xl font-bold text-myBlack mb-6">
              {pageData.title}

            </h1>

            <p className="text-gray-text text-base md:text-base leading-relaxed">
              {pageData.description_1}

            </p>
            <br />
            <p className="text-gray-text text-base md:text-base mb-8 leading-relaxed">
              {pageData.description_2}

            </p>

            {/* Badges Section */}
            <div>
              <p className="font-semibold mb-6 text-lg">Check out our plans below: </p>
              {/* Badges */}
              <div className={`flex flex-wrap gap-4 items-center mb-8 `}>
                {data?.packages.map((item, i) => (
                  <div className="flex gap-2 items-center" key={i}>
                    <FaCheckCircle fill="var(--primary)" size={20} />
                    <p className="text-myBlack font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <ButtonTheme variation={2} title="Explore Packages" href={href ? href : packagesData.link_contact_packages} />
          </div>

          {/* Image Grid */}
          <div className="w-full lg:w-7/12 relative">
            {/* Container que mantiene el aspect ratio */}
            <div className="relative pb-[90%] w-full h-0">
              {/* logo*/}

              {pageData.show_gobeyond_logo && (
                <div className="hidden md:inline absolute top-4 right-4 w-[200px] h-10  rounded-md z-10">
                  <svg className="w-full h-full" viewBox="0 0 295 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.95">
                      <path d="M0.884766 33.6992V33.3867C0.884766 26.4596 5.20379 22.4492 12.7107 22.4492C19.1378 22.4492 22.7884 24.9492 23.4054 30.0013H19.9604C19.3434 26.7721 16.8754 25.2096 12.7107 25.2096C7.0548 25.2096 4.22687 27.97 4.22687 33.3867V33.6992C4.22687 39.168 7.0548 41.8242 12.4536 41.8242C15.5386 41.8242 18.0066 40.8867 20.1661 39.0117V36.1992H12.3507V33.3346H23.5082V44.1159H21.7086L20.9374 41.3555C18.7264 43.543 15.9499 44.5846 12.3507 44.5846C5.40946 44.5846 0.884766 40.8867 0.884766 33.6992Z" fill="#201E4D" />
                    </g>
                    <g opacity="0.95">
                      <path d="M38.2656 33.6992V33.3867C38.2656 26.4596 42.6361 22.4492 50.0915 22.4492C57.547 22.4492 61.9174 26.5117 61.9174 33.3867V33.6992C61.9174 40.6263 57.547 44.6367 50.0915 44.6367C42.6361 44.6367 38.2656 40.6263 38.2656 33.6992ZM50.1429 41.7721C55.7474 41.7721 58.6267 39.1159 58.6267 33.6992V33.3867C58.6267 28.0221 55.7474 25.2617 50.1429 25.2617C44.5385 25.2617 41.6591 27.9701 41.6591 33.3867V33.6992C41.6591 39.0638 44.5385 41.7721 50.1429 41.7721Z" fill="#201E4D" />
                    </g>
                    <g opacity="0.95">
                      <path d="M76.3652 22.8125H88.294C92.8187 22.8125 95.3381 24.6354 95.3381 28.2813V28.4375C95.3381 30.8333 94.3097 32.3958 91.6875 33.0729V33.125C94.6697 33.8021 95.9037 35.6771 95.9037 38.2812V38.4896C95.9037 42.2396 93.5899 44.2188 88.3968 44.2188H76.3652V22.8125ZM87.8826 31.8229C90.4021 31.8229 91.996 30.9375 91.996 28.5937V28.4375C91.996 26.4583 90.4535 25.5729 87.8826 25.5729H79.6559V31.8229H87.8826ZM88.294 41.4583C90.7106 41.4583 92.5616 40.4688 92.5616 38.1771V38.0208C92.5616 35.7812 91.1219 34.6354 88.294 34.6354H79.6559V41.4583H88.294Z" fill="#201E4D" />
                    </g>
                    <g opacity="0.95">
                      <path d="M110.711 22.8125H127.524V25.6771H114.002V31.7708H127.524V34.6354H114.002V41.3542H127.524V44.1667H110.711V22.8125Z" fill="#201E4D" />
                    </g>
                    <g opacity="0.95">
                      <path d="M150.097 36.5625L140.482 22.8125H144.442L151.743 33.6979H151.794L159.044 22.8125H163.003L153.388 36.5625V44.1667H150.097V36.5625Z" fill="#201E4D" />
                    </g>
                    <g opacity="0.95">
                      <path d="M175.395 33.6992V33.3867C175.395 26.4596 179.765 22.4492 187.22 22.4492C194.727 22.4492 199.046 26.5117 199.046 33.3867V33.6992C199.046 40.6263 194.676 44.6367 187.22 44.6367C179.765 44.5846 175.395 40.6263 175.395 33.6992ZM187.272 41.7721C192.876 41.7721 195.756 39.1159 195.756 33.6992V33.3867C195.756 28.0221 192.876 25.2617 187.272 25.2617C181.667 25.2617 178.788 27.9701 178.788 33.3867V33.6992C178.737 39.0638 181.616 41.7721 187.272 41.7721Z" fill="#201E4D" />
                    </g>
                    <g opacity="0.95">
                      <path d="M212.826 22.8125H218.174L229.948 41.6667H229.999V22.8125H233.187V44.1667H227.891L216.065 25.3125H216.014V44.1667H212.826V22.8125Z" fill="#201E4D" />
                    </g>
                    <g opacity="0.95">
                      <path d="M247.686 22.8125H258.175C265.579 22.8125 269.229 26.0417 269.229 33.1771V33.8021C269.229 40.9375 265.579 44.1667 258.175 44.1667H247.686V22.8125ZM257.969 41.4583C263.625 41.4583 265.733 39.1667 265.733 33.8021V33.2292C265.733 27.8646 263.625 25.5729 257.969 25.5729H250.976V41.4583H257.969Z" fill="#201E4D" />
                    </g>
                    <path d="M282.444 0.677734C282.444 6.92773 277.199 11.9798 270.721 11.9798C277.199 11.9798 282.444 17.0319 282.444 23.2819C282.444 17.0319 287.688 11.9798 294.167 11.9798C287.688 11.9798 282.444 6.92773 282.444 0.677734Z" fill="#201E4D" />
                  </svg>
                </div>
              )}

              {/* Imagen inferior derecha */}
              <div className="absolute bottom-[10%] right-0 w-[60%] aspect-square rounded-xl overflow-hidden  z-0" >
                <Image src={pageData.pictures[0]} fill className="w-full h-full object-cover" alt="Beautiful river landscape in Boquete, Panama" />
              </div>

              {/* Imagen superior izquierda */}
              <div className="absolute top-0 left-0 w-[65%] aspect-square rounded-xl overflow-hidden  z-10">
                <Image src={pageData.pictures[1]} fill className="w-full h-full object-cover" alt="Scenic mountain views of Boquete, Panama" />
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};