"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface HeroAd {
  id: string;
  adTitle: string;
  adImageUrl: string;
  destinationUrl?: string;
}

const FALLBACK_IMAGE = "/images/ads/placeholder-300x400.svg";

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

const HeroImageSlider = () => {
  const [images, setImages] = useState<HeroAd[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const trackedImpressions = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const res = await fetch("/api/advertising/hero-images?packageId=advert2");
        if (res.ok) {
          const data = await res.json();
          const fetchedImages: HeroAd[] = data.data || [];
          if (fetchedImages.length === 0) {
            setImages([{ id: "fallback", adTitle: "Welcome", adImageUrl: FALLBACK_IMAGE }]);
          } else {
            setImages(fetchedImages);
          }
        } else {
          setImages([{ id: "fallback", adTitle: "Welcome", adImageUrl: FALLBACK_IMAGE }]);
        }
      } catch {
        setImages([{ id: "fallback", adTitle: "Welcome", adImageUrl: FALLBACK_IMAGE }]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Track impression when a new real ad becomes visible
  useEffect(() => {
    if (images.length === 0) return;
    const ad = images[currentIndex];
    if (ad && !ad.id.startsWith("fallback") && !trackedImpressions.current.has(ad.id)) {
      trackedImpressions.current.add(ad.id);
      trackEvent(ad.id, "impression");
    }
  }, [images, currentIndex]);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleClick = useCallback((image: HeroAd) => {
    if (!image.id.startsWith("fallback")) {
      trackEvent(image.id, "click");
    }
    if (image.destinationUrl) {
      window.open(image.destinationUrl, "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <div className="relative w-full h-full bg-white dark:bg-neutral-900">
      {loading ? (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      ) : images.length === 0 ? (
        <Image
          src={FALLBACK_IMAGE}
          alt="Hero image fallback"
          fill
          className="object-cover"
          priority
        />
      ) : (
        images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <button
              className={`w-full h-full block relative ${
                image.destinationUrl ? "cursor-pointer" : "cursor-default"
              }`}
              onClick={() => handleClick(image)}
              aria-label={image.destinationUrl ? `Visit ${image.adTitle}` : image.adTitle}
            >
              <Image
                src={image.adImageUrl}
                alt={image.adTitle}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default HeroImageSlider;
