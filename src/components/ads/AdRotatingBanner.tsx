"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Ad {
  id: string;
  adTitle: string;
  adImageUrl: string;
  destinationUrl?: string;
}

interface FallbackImage {
  src: string;
  alt?: string;
}

interface AdRotatingBannerProps {
  packageId: string;
  intervalMs?: number;
  className?: string;
  aspectRatio?: "landscape" | "wide" | "big" | "portrait";
  fallbackImages?: FallbackImage[];
}

const ASPECT_CLASSES: Record<string, string> = {
  landscape: "aspect-[16/5]",
  wide: "aspect-[21/7]",
  big: "aspect-[16/6]",
  portrait: "aspect-[3/4]",
};

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

const AdRotatingBanner = ({
  packageId,
  intervalMs = 7000,
  className = "",
  aspectRatio = "landscape",
  fallbackImages = [],
}: AdRotatingBannerProps) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const trackedImpressions = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/advertising/hero-images?packageId=${packageId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const fetched: Ad[] = data?.data || [];
        if (fetched.length > 0) {
          setAds(fetched);
        } else if (fallbackImages.length > 0) {
          setAds(
            fallbackImages.map((f, i) => ({
              id: `fallback-${i}`,
              adTitle: f.alt || `Advertisement ${i + 1}`,
              adImageUrl: f.src,
            }))
          );
        }
      })
      .catch(() => {
        if (fallbackImages.length > 0) {
          setAds(
            fallbackImages.map((f, i) => ({
              id: `fallback-${i}`,
              adTitle: f.alt || `Advertisement ${i + 1}`,
              adImageUrl: f.src,
            }))
          );
        }
      })
      .finally(() => setLoading(false));
  }, [packageId]);

  // Track impression for each new ad shown (once per session per ad)
  useEffect(() => {
    if (ads.length === 0) return;
    const ad = ads[currentIndex];
    if (ad && !ad.id.startsWith("fallback-") && !trackedImpressions.current.has(ad.id)) {
      trackedImpressions.current.add(ad.id);
      trackEvent(ad.id, "impression");
    }
  }, [ads, currentIndex]);

  // Auto-rotate
  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [ads.length, intervalMs]);

  const handleClick = useCallback(
    (ad: Ad) => {
      if (!ad.id.startsWith("fallback-")) {
        trackEvent(ad.id, "click");
      }
      if (ad.destinationUrl) {
        window.open(ad.destinationUrl, "_blank", "noopener,noreferrer");
      }
    },
    []
  );

  if (loading) {
    return (
      <div
        className={`w-full ${ASPECT_CLASSES[aspectRatio]} rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
      />
    );
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <div
      className={`relative w-full ${ASPECT_CLASSES[aspectRatio]} rounded-2xl overflow-hidden ${className}`}
    >
      {ads.map((ad, index) => (
        <div
          key={ad.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <button
            className={`w-full h-full block relative ${
              ad.destinationUrl ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={() => handleClick(ad)}
            aria-label={ad.destinationUrl ? `Visit ${ad.adTitle}` : ad.adTitle}
          >
            <Image
              src={ad.adImageUrl}
              alt={ad.adTitle}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </button>
        </div>
      ))}

      {/* Slide indicators */}
      {ads.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none">
          {ads.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdRotatingBanner;
