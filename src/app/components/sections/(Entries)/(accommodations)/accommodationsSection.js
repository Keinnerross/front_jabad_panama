'use client'

import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { CardEntry } from "../../(cards)/cardEntry";
import { EntryLayout } from "../entryLayout";
import { getAssetPath } from "@/app/utils/assetPath";
/* import { hotelsData } from "@/app/data/hoteles"; */


export const AccommodationsSection = ({ hotelsData }) => {


  const fallbackData = [
    {
      id: 1,
      title: "Lorem Hotel",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: "Hotel",
      imageUrls: [getAssetPath("/assets/global/asset001.png")]
    },
    {
      id: 2,
      title: "Ipsum Hotel",
      description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      category: "Hotel",
      imageUrls: [getAssetPath("/assets/global/asset001.png")]
    }
  ];


  // Datos Api Construidos
  const processedData = (hotelsData && Array.isArray(hotelsData)) ? hotelsData.map(hotel => ({
    id: hotel.documentId || "#",
    title: hotel.title,
    description: hotel.description,
    category: hotel.category,
    imageUrls: imagesArrayValidation(hotel.imageUrls, { imageUrls: [getAssetPath("/assets/global/asset001.png")] }) || [],
    distance: hotel.distance,
    website: hotel.website,
    address: hotel.address,
    stars: hotel.stars

  })) : [];



  const dataToUse = processedData.length > 0 ? processedData : fallbackData;









  return (
    <div >
      <EntryLayout
        data={dataToUse}
        filterKey="category"
        renderItem={(item) => <CardEntry item={item} isHotel />}
      />
    </div>
  );
};
