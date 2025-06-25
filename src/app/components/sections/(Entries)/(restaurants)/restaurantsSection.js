import { CardEntry } from "../../(cards)/cardEntry";
import { EntryLayout } from "../entryLayout";

export const RestaurantsSection = () => {

    const contentItems = [
        {
            id: 1,
            title: "What to do and see in 10 days in New York City",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
            category: "Restaurant",
            tags: ["Fish", "Takeout"],
            location: "",
            image: "/what-to-do-and-see-in-10-days-in-new-york-city.png"
        },
        {
            id: 2,
            title: "A beginner's guide on how to plan your travel budget",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
            category: "Bakery",
            tags: ["Dairy", "Parve"],
            location: "",
            image: "/a-beginner-s-guide-on-how-to-plan-your-travel-budget.png"
        },
        {
            id: 3,
            title: "16 restaurants that you must visit in Chicago, Illinois",
            description: "Super Kosher, Calle Ramon H. Jurado, Panama City, Panama",
            category: "Bakery",
            tags: ["Dairy", "Takeout"],
            location: "Panama City, Panama",
            image: "/16-restaurants-that-you-must-visit-in-chicago-illinois.png"
        },
        {
            id: 4,
            title: "How to make a travel plan to visit a city on a budget",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
            category: "Bakery",
            tags: ["Family", "Fish"],
            location: "",
            image: "/how-to-make-a-travel-plan-to-visit-a-city-on-a-budget.png"
        },
        {
            id: 5,
            title: "10 tips for how to find cheap plane tickets in 2023",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
            category: "Restaurant",
            tags: ["Near", "Parve"],
            location: "",
            image: "/10-tips-for-how-to-find-cheap-plane-tickets-in-2023.png"
        },
        {
            id: 6,
            title: "The ultimate travel guide for Miami, Florida",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit molestie id ac at egestas.",
            category: "Restaurant",
            tags: ["Dairy", "Parve"],
            location: "",
            image: "/the-ultimate-travel-guide-for-miami-florida.png"
        }
    ];

    return (
        <EntryLayout>
            {contentItems.map((item) => (
                <CardEntry key={item.id} item={item} />
            ))}
        </EntryLayout>
    )
}