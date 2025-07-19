import { getAssetPath } from "@/app/utils/assetPath";

export const hotelsData = [
  {
    title: "Bambuda Castle",
    stars: 4,
    category: "Hostel",
    description: "A real castle turned hostel with epic views and a one-of-a-kind stay in Boquete.",
    website: "https://bambuda.com/castle/#",
    imageUrls: [getAssetPath("/assets/pictures/hotels/bermuda.jpg")],
    address: "Calle El Santuario, Boquete, Chiriquí, Panamá",
    distance: "15 minutes from Chabad"
  },
  {
    title: "Finca Lérida",
    stars: 4,
    category: "Boutique Hotel",
    description: "A boutique hotel surrounded by coffee farms — perfect for nature and coffee lovers.",
    website: "https://hotelfincalerida.com/",
    imageUrls: [getAssetPath("/assets/pictures/hotels/finca.jpg")],
    address: "Alto Quiel, Boquete, Chiriquí, Panamá",
    distance: "20 minutes from Chabad"
  },
  {
    title: "Hotel Panamonte",
    stars: 5,
    category: "Hotel",
    description: "Classic elegance in Boquete with rich history and an award-winning restaurant.",
    website: "https://panamonte.com/en/",
    imageUrls: [getAssetPath("/assets/pictures/hotels/hotel.jpg")],
    address: "Calle 11 de Abril, Boquete, Chiriquí, Panamá",
    distance: "5 minutes from Chabad in central location"
  },
  {
    title: "Valle Escondido Resort",
    stars: 5,
    category: "Resort",
    description: "A hidden valley resort offering golf, spa, and a peaceful mountain retreat.",
    website: "https://www.valleescondidoboquete.com",
    imageUrls: [getAssetPath("/assets/pictures/hotels/valle.jpg")],
    address: "Valle Escondido, Boquete, Chiriquí, Panamá",
    distance: "10 minutes from Chabad in quiet valley area"
  },
  {
    title: "Finca Panda",
    stars: 4,
    category: "Eco Lodge",
    description: "An eco-friendly farm stay with local charm, perfect for unwinding and exploring.",
    website: "http://www.fincapanda.com",
    imageUrls: [getAssetPath("/assets/pictures/hotels/fincapanda.jpg")],
    address: "Jaramillo Arriba, Boquete, Chiriquí, Panamá",
    distance: "25 minutes from Chabad in remote countryside"
  },
  {
    title: "Valle del Río Hotel",
    stars: 4,
    category: "Hotel",
    description: "Comfort and convenience by the river, ideal for families and couples.",
    website: "https://www.valledelrioboquete.com",
    imageUrls: [getAssetPath("/assets/pictures/hotels/valledelrio.jpg")],
    address: "Calle 3a Sur, Bajo Boquete, Chiriquí, Panamá",
    distance: "7 minutes from Chabad with riverside location"
  },
  {
    title: "Villa Alejandro",
    stars: 4,
    category: "Villa",
    description: "A peaceful colonial-style villa with lush gardens and great value.",
    website: "https://villa-alejandro.com/es/",
    imageUrls: [getAssetPath("/assets/pictures/hotels/villaalejandro.jpg")],
    address: "Calle 4a Sur, Boquete, Chiriquí, Panamá",
    distance: "Walking distance to Chabad in quiet neighborhood"
  }
];
