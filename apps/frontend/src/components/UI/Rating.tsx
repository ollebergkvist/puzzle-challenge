import { useState } from "react";

// types
interface RatingProps {
  orderId: string;
  initialRating: number;
  updateRating: (orderId: string, newRating: number) => void;
}

export const Rating = ({
  orderId,
  initialRating,
  updateRating,
}: RatingProps) => {
  const [rating, setRating] = useState(initialRating);

  const handleRatingClick = async (newRating: number) => {
    const updatedRating = newRating === rating ? newRating - 1 : newRating;

    setRating(updatedRating);
    updateRating(orderId, updatedRating);
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const starColor =
        i <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-500";

      stars.push(
        <svg
          key={i}
          aria-hidden="true"
          className={`w-5 h-5 ${starColor} cursor-pointer hover:text-yellow-400`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => handleRatingClick(i)}
        >
          <title>Star</title>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return <div className="flex items-center">{renderStars()}</div>;
};
