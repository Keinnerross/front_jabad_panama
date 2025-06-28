'use client'

import { CardEntry } from "../../(cards)/cardEntry";
import { EntryLayout } from "../entryLayout";
import { hotelsData } from "@/app/data/hoteles";


export const AccommodationsSection = () => {
  return (
    <div >
      <EntryLayout
        data={hotelsData}
        filterKey="category"
        renderItem={(item) => <CardEntry item={item} isHotel/>}
      />
    </div>
  );
};
