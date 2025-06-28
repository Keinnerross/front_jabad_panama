import { FaStar } from "react-icons/fa";

export const StarsHotel = ({ rating, size = 20, color = "var(--colorStars)" }) => {
  const stars = Array.from({ length: rating }, (_, i) => (
    <FaStar key={i} size={size} color={color} />
  ));

  return <div className="flex gap-0.5">{stars}</div>;
};
