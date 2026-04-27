"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Textarea from "@/shared/Textarea";
import StarRating from "./StarRating"; // A new component for star rating

interface ReviewFormProps {
  businessId: string;
  onReviewSubmit: (review: any) => void;
}

const ReviewForm = ({ businessId, onReviewSubmit }: ReviewFormProps) => {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!session) {
      setError("You must be logged in to submit a review.");
      setIsSubmitting(false);
      return;
    }

    if (rating === 0) {
      setError("Please select a rating.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId,
          rating,
          title,
          comment,
        }),
      });

      if (res.ok) {
        const newReview = await res.json();
        onReviewSubmit(newReview);
        setRating(0);
        setComment("");
        setTitle("");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to submit review.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-yellow-800">
          You must be logged in to write a review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Your Rating
        </label>
        <StarRating rating={rating} setRating={setRating} />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Review Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
          placeholder="A short title for your review"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Your Review
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this business..."
          rows={4}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <ButtonPrimary type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </ButtonPrimary>
    </form>
  );
};

export default ReviewForm;
