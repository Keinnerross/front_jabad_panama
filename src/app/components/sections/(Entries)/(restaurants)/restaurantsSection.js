'use client'
import { CardEntry } from "../../(cards)/cardEntry";
import { foodData } from "@/app/data/restaurantsData"; 
import { EntryLayout } from "../entryLayout";

export const RestaurantsSection = () => {

   
    return (
        <div >
            <EntryLayout
                data={foodData}
                filterKey="category"
                renderItem={(item) => <CardEntry item={item}  isRestaurant/>}
            />
        </div>
    )
}




