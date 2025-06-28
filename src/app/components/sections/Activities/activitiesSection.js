'use client'
import { activitiesData } from "@/app/data/activities";
import { EntryLayout } from "../(Entries)/entryLayout";
import { CardEntry } from "../(cards)/cardEntry";

export const ActivitiesSection = () => {
  return (
    <div id="activitiesSection">
      <EntryLayout 
        data={activitiesData} 
        filterKey="category"
        renderItem={(item) => <CardEntry item={item} />}
      />
    </div>
  );
};
