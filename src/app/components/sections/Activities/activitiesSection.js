'use client'
import { activitiesData } from "@/app/data/activities";
import { EntryLayout } from "../(Entries)/entryLayout";
import { CardEntry } from "../(cards)/cardEntry";
import { imagesArrayValidation } from "@/app/utils/imagesArrayValidation";

export const ActivitiesSection = ({ activitiesData, packagesData }) => {


  const fallbackData = [
    {
      id: 1,
      title: "Activity",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: "Hotel",
      imageUrls: ["/assets/global/asset001.png"],
    },
    {
      id: 2,
      title: "Ipsum Activity",
      description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      category: "Hotel",
      imageUrls: ["/assets/global/asset001.png"],
    }
  ];


  // Datos Api Construidos
  const processedData = activitiesData?.map(activity => ({
    id: activity.documentId || "#",
    title: activity.title,
    description: activity.description,
    category: activity.category,
    imageUrls: imagesArrayValidation(activity.imageUrls, fallbackData) || [],
    website: activity.website,
    address: activity.address,
    tags: activity.Tags,
    link_contact_packages: packagesData.link_contact_packages || "/#"
  })) || [];



  const dataToUse = processedData.length > 0 ? processedData : fallbackData;


  return (
    <div id="activitiesSection">
      <EntryLayout
        data={dataToUse}
        filterKey="category"
        renderItem={(item) => <CardEntry item={item} />}
      />
    </div>
  );
};
