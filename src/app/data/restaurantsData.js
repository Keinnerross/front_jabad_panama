export const foodData = [
  {
    id: 1,
    title: "Morton's Bakehouse",
    description: "Artisan kosher bakery in Boquete since 2008, known for its sourdough, bagels, babka and premium coffee.",
    fullDescription: "Welcome to Morton's Bakehouse, a beloved artisan kosher bakery that has been serving the Boquete community since 2008. We specialize in traditional Jewish baked goods including our famous sourdough bread, fresh bagels, and rich babka. Our commitment to kosher practices and high-quality ingredients makes us a cornerstone of the local Jewish community. Whether you're looking for your daily bread or special occasion treats, Morton's Bakehouse offers an authentic taste of tradition in the heart of Panama.",
    imageUrls: [
      "/assets/pictures/restaurantes/thumb1.jpg",
      "/assets/pictures/restaurantes/thumb1.jpg",
      "/assets/pictures/restaurantes/thumb1.jpg",
    ],
    tags: ["Kosher", "Bakery", "Artisan"],
    category: "Bakery",
    website: "https://mortonsbakehouse.com/",
    amenities: ["Kosher Certified", "Fresh Daily", "Custom Orders", "Coffee Bar"],
    location: "Boquete, Panama",
    established: "2008",
    specialties: ["Sourdough Bread", "Fresh Bagels", "Traditional Babka", "Premium Coffee"]
  },
  {
    id: 2,
    title: "Catering by Chabad",
    description: "From Shabbat meals for groups any size to destination weddings (meat).",
    fullDescription: "Catering by Chabad offers exceptional kosher catering services for all your special occasions. From intimate Shabbat dinners for small groups to elaborate destination weddings, we provide authentic Jewish cuisine prepared according to the highest kosher standards. Our experienced team understands the importance of tradition and celebration, ensuring that every meal we serve honors both the dietary laws and the joy of the occasion. Whether you're planning a bar mitzvah, wedding, or corporate event, trust Catering by Chabad to make your celebration memorable and meaningful.",
    imageUrls: [
      "/assets/pictures/restaurantes/thumb2.jpg",

    ],
    tags: ["Kosher", "Catering", "Events"],
    category: "Catering",
    website: "/#",
    amenities: ["Full Service Catering", "Event Planning", "Kosher Supervision", "Custom Menus"],
    location: "Panama City, Panama",
    established: "2015",
    specialties: ["Shabbat Meals", "Wedding Catering", "Corporate Events", "Holiday Celebrations"]
  }
];

// Helper function to get restaurant by ID
export const getRestaurantById = (id) => {
  return foodData.find(restaurant => restaurant.id === parseInt(id));
};

// Helper function to get restaurant by title (for URL slugs)
export const getRestaurantBySlug = (slug) => {
  return foodData.find(restaurant =>
    restaurant.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );
};