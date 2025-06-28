import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export const StarsHotel = ({ rating, size = 20, color = "var(--colorStars)" }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={size} color={color} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} color={color} />);
    } else {
      stars.push(<FaRegStar key={i} size={size} color={color} />);
    }
  }

  return <div className="flex gap-0.5">{stars}</div>;
};
