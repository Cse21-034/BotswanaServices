"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getAdsByType } from "@/data/ads";

interface NormalizedAd {
  id: string;
  image: string;
  title: string;
  alt: string;
  link: string;
  isPaid?: boolean;
  isFallback?: boolean;
}

interface RotatingBannerAdProps {
  className?: string;
  autoRotate?: boolean;
  rotationInterval?: number;
}

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

const RotatingBannerAd: React.FC<RotatingBannerAdProps> = ({
  className = "",
  autoRotate = true,
  rotationInterval = 5000,
}) => {
  const [ads, setAds] = useState<NormalizedAd[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const trackedImpressions = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loadAds = async () => {
      const combined: NormalizedAd[] = [];

      // 1. Fetch paid DB ads (rotating-banner package)
      try {
        const res = await fetch("/api/advertising/hero-images?packageId=rotating-banner");
        if (res.ok) {
          const data = await res.json();
          const dbAds: NormalizedAd[] = (data.data || []).map((ad: any) => ({
            id: ad.id,
            image: ad.adImageUrl,
            title: ad.adTitle,
            alt: ad.adTitle,
            link: ad.destinationUrl || "#",
            isPaid: true,
          }));
          combined.push(...dbAds);
        }
      } catch {}

      // 2. Also fetch featured-hero-space (existing premium placements)
      try {
        const res = await fetch("/api/featured-hero-space");
        const result = await res.json();
        if (result.success && result.data) {
          const featuredAds: NormalizedAd[] = result.data.map((space: any) => ({
            id: `featured-${space.id}`,
            image: space.imageUrl,
            title: space.title,
            alt: space.title,
            link: space.linkUrl || "#",
            isPaid: true,
          }));
          combined.push(...featuredAds);
        }
      } catch {}

      // 3. Fall back to static ads.ts if nothing from DB
      if (combined.length === 0) {
        const staticAds = getAdsByType("banner");
        combined.push(
          ...staticAds.map((ad) => ({
            id: `static-${ad.id}`,
            image: ad.image,
            title: ad.title,
            alt: ad.alt,
            link: ad.link,
            isFallback: true,
          }))
        );
      }

      setAds(combined);
      setIsLoading(false);
    };

    loadAds();
  }, []);

  // Track impression when current ad changes
  useEffect(() => {
    if (ads.length === 0) return;
    const ad = ads[currentIndex];
    if (ad && !ad.isFallback && !trackedImpressions.current.has(ad.id)) {
      trackedImpressions.current.add(ad.id);
      trackEvent(ad.id, "impression");
    }
  }, [ads, currentIndex]);

  useEffect(() => {
    if (!autoRotate || ads.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [ads.length, autoRotate, rotationInterval, isHovered]);

  if (isLoading || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  const handleAdClick = () => {
    if (!currentAd.isFallback) trackEvent(currentAd.id, "click");
    if (currentAd.link && currentAd.link !== "#") {
      window.open(currentAd.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-neutral-100 dark:bg-neutral-800">
        {/* Ad Image */}
        <div
          className="relative w-full aspect-[4/1] lg:aspect-[5/1] cursor-pointer group overflow-hidden"
          onClick={handleAdClick}
        >
          <Image
            src={currentAd.image}
            alt={currentAd.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          {/* Text Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent flex items-center px-8">
            <div className="text-white">
              <p className={`text-sm font-bold uppercase tracking-widest opacity-90 mb-2 ${currentAd.isPaid ? "text-yellow-300" : ""}`}>
                {currentAd.isPaid ? "⭐ Featured Business" : "Featured Offer"}
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">{currentAd.title}</h2>
              <button
                onClick={(e) => { e.preventDefault(); handleAdClick(); }}
                className="px-6 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-lg font-semibold transition-colors inline-block"
              >
                Learn More →
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {ads.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white dark:bg-neutral-700/80 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white shadow-lg transition-all duration-300"
              aria-label="Previous ad"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % ads.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 hover:bg-white dark:bg-neutral-700/80 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white shadow-lg transition-all duration-300"
              aria-label="Next ad"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex ? "w-8 h-3 bg-white" : "w-3 h-3 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to ad ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Advertisement Label */}
      <div className="text-center mt-3">
        <span className={`inline-block text-xs font-semibold px-4 py-1.5 rounded-full border ${
          currentAd.isPaid
            ? "text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700"
            : "text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
        }`}>
          {currentAd.isPaid ? "⭐ Featured Business Listing" : "💡 Advertisement"}
        </span>
      </div>
    </div>
  );
};

export default RotatingBannerAd;
