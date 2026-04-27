"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRating = ({ rating, setRating }: StarRatingProps) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
            />
            <StarIcon
              className="cursor-pointer"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              width={24}
              height={24}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
