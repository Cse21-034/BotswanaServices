"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Ad {
  id: string;
  image: string;
  title: string;
  alt: string;
  link: string;
  isFallback?: boolean;
}

interface StickyAdProps {
  position?: "bottom-left" | "bottom-right" | "top-right";
  className?: string;
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

const StickyAd: React.FC<StickyAdProps> = ({ position = "bottom-right", className = "" }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const trackedImpressions = useRef<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/advertising/hero-images?packageId=sticky");
        if (res.ok) {
          const data = await res.json();
          const dbAds: Ad[] = (data.data || []).map((ad: any) => ({
            id: ad.id,
            image: ad.adImageUrl,
            title: ad.adTitle,
            alt: ad.adTitle,
            link: ad.destinationUrl || "#",
          }));
          if (dbAds.length > 0) {
            setAds(dbAds);
            setIsLoading(false);
            return;
          }
        }
      } catch {}

      // Fallback to placeholder
      setAds([{
        id: "placeholder-sticky",
        image: "/images/ads/placeholder-300x300.svg",
        title: "Advertise Here",
        alt: "Advertise your business here",
        link: "/advertise",
        isFallback: true,
      }]);
      setIsLoading(false);
    };
    load();
  }, []);

  // Track impression when current ad becomes visible
  useEffect(() => {
    if (ads.length === 0 || !isVisible) return;
    const ad = ads[currentIndex];
    if (ad && !ad.isFallback && !trackedImpressions.current.has(ad.id)) {
      trackedImpressions.current.add(ad.id);
      trackEvent(ad.id, "impression");
    }
  }, [ads, currentIndex, isVisible]);

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [ads.length]);

  if (!isVisible || isLoading || ads.length === 0) return null;

  const ad = ads[currentIndex];

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
  };

  const handleAdClick = () => {
    if (!ad.isFallback) trackEvent(ad.id, "click");
    if (ad.link && ad.link !== "#") {
      window.open(ad.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-40 max-w-xs ${className}`}>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-3xl transition-shadow duration-300">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 z-50 bg-white dark:bg-neutral-700 rounded-full p-1.5 shadow-md hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
          aria-label="Close ad"
        >
          <XMarkIcon className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
        </button>

        {/* Ad Image */}
        <div
          className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-700 cursor-pointer group overflow-hidden"
          onClick={handleAdClick}
        >
          <Image
            src={ad.image}
            alt={ad.alt}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Ad Details */}
        <div className="p-4">
          <p className="text-xs font-bold text-burgundy-600 dark:text-burgundy-400 uppercase tracking-wide mb-1">
            💼 Hot Deal
          </p>
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-3 line-clamp-2">
            {ad.title}
          </h3>

          {/* Navigation & Indicators */}
          {ads.length > 1 && (
            <div className="flex items-center justify-between gap-2 mb-3">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                aria-label="Previous ad"
              >
                <ChevronLeftIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>

              <div className="flex gap-1.5">
                {ads.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex ? "w-6 bg-burgundy-600" : "w-2 bg-neutral-300 dark:bg-neutral-600"
                    }`}
                    aria-label={`Go to ad ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % ads.length)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                aria-label="Next ad"
              >
                <ChevronRightIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={handleAdClick}
            className="w-full py-2 bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white rounded-lg font-semibold text-xs hover:from-burgundy-600 hover:to-burgundy-700 transition-all shadow-md hover:shadow-lg"
          >
            Check It Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyAd;
