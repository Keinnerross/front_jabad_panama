'use client'
import { activitiesData } from "@/app/data/activities";
import { EntryLayout } from "../(Entries)/entryLayout";
import { CardEntry } from "../(cards)/cardEntry";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";
import { getAssetPath } from "@/app/utils/assetPath";

export const ActivitiesSection = ({ activitiesData, packagesData, singleActivitiesActive = true }) => {


  const fallbackData = [
    {
      id: 1,
      title: "Activity",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: "Hotel",
      imageUrls: [getAssetPath("/assets/global/asset001.png")],
    },
    {
      id: 2,
      title: "Ipsum Activity",
      description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      category: "Hotel",
      imageUrls: [getAssetPath("/assets/global/asset001.png")],
    }
  ];


  // Datos Api Construidos
  const url = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
  const processedData = (activitiesData && Array.isArray(activitiesData)) ? activitiesData
    .map(activity => ({
      id: activity.documentId || "#",
      title: activity.title,
      description: activity.description,
      category: activity.category,
      // Usar medium para cards (~750px) - imageUrl es ahora un array
      imageUrls: activity.imageUrl?.[0]?.formats?.medium?.url
        ? [`${url}${activity.imageUrl[0].formats.medium.url}`]
        : activity.imageUrl?.[0]?.url
          ? [`${url}${activity.imageUrl[0].url}`]
          : [getAssetPath("/assets/global/asset001.png")],
      website: activity.website,
      address: activity.address,
      tags: activity.Tags,
      link_activities: activity.link_activities || "/#",
      order: activity.order !== undefined && activity.order !== null ? activity.order : 100
    }))
    .sort((a, b) => a.order - b.order) : [];



  const dataToUse = processedData.length > 0 ? processedData : fallbackData;


  return (
    <div id="activitiesSection">
      <EntryLayout
        data={dataToUse}
        filterKey="category"
        renderItem={(item) => <CardEntry item={item} singlePageActive={singleActivitiesActive} />}
      />
    </div>
  );
};
