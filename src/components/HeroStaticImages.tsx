"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface HeroAd {
  id: string;
  adTitle: string;
  adImageUrl: string;
  destinationUrl?: string;
}

const FALLBACK_IMAGES = [
  "/images/ads/placeholder-300x300.svg",
  "/images/ads/placeholder-300x300.svg",
];

function trackEvent(adId: string, eventType: "impression" | "click") {
  fetch("/api/advertising/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      adSubscriptionId: adId,
      eventType,
      referrer: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    }),
  }).catch(() => {});
}

const HeroStaticImages = () => {
  const [images, setImages] = useState<HeroAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaticImages = async () => {
      try {
        const res = await fetch("/api/advertising/hero-images?packageId=advert1");
        if (res.ok) {
          const data = await res.json();
          const fetchedImages: HeroAd[] = data.data || [];

          if (fetchedImages.length < 2) {
            const combined = [
              ...fetchedImages.slice(0, 2),
              ...FALLBACK_IMAGES.slice(fetchedImages.length, 2).map((img, idx) => ({
                id: `fallback-${fetchedImages.length + idx}`,
                adTitle: `Advertisement ${fetchedImages.length + idx + 1}`,
                adImageUrl: img,
              })),
            ];
            setImages(combined);
          } else {
            setImages(fetchedImages.slice(0, 2));
          }
        } else {
          setImages(
            FALLBACK_IMAGES.map((img, idx) => ({
              id: `fallback-${idx}`,
              adTitle: `Advertisement ${idx + 1}`,
              adImageUrl: img,
            }))
          );
        }
      } catch {
        setImages(
          FALLBACK_IMAGES.map((img, idx) => ({
            id: `fallback-${idx}`,
            adTitle: `Advertisement ${idx + 1}`,
            adImageUrl: img,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStaticImages();
  }, []);

  // Track impressions on mount for real ads
  useEffect(() => {
    images.forEach((img) => {
      if (!img.id.startsWith("fallback-")) {
        trackEvent(img.id, "impression");
      }
    });
  }, [images]);

  const handleClick = useCallback((image: HeroAd) => {
    if (!image.id.startsWith("fallback-")) {
      trackEvent(image.id, "click");
    }
    if (image.destinationUrl) {
      window.open(image.destinationUrl, "_blank", "noopener,noreferrer");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 h-full">
        <div className="relative h-1/2 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="relative h-1/2 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {images.slice(0, 2).map((image) => (
        <button
          key={image.id}
          className={`relative h-1/2 rounded-2xl overflow-hidden block w-full ${
            image.destinationUrl ? "cursor-pointer" : "cursor-default"
          }`}
          onClick={() => handleClick(image)}
          aria-label={image.destinationUrl ? `Visit ${image.adTitle}` : image.adTitle}
        >
          <Image
            className="object-cover"
            src={image.adImageUrl}
            alt={image.adTitle}
            fill
            priority
          />
        </button>
      ))}
    </div>
  );
};

export default HeroStaticImages;
