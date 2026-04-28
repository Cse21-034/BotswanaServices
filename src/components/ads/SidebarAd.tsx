"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Ad {
  id: string;
  image: string;
  title: string;
  alt: string;
  link: string;
  isFallback?: boolean;
}

interface SidebarAdProps {
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

const SidebarAd: React.FC<SidebarAdProps> = ({ className = "" }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/advertising/hero-images?packageId=sidebar");
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
        id: "placeholder-sidebar",
        image: "/images/ads/placeholder-300x400.svg",
        title: "Advertise Here",
        alt: "Advertise your business here",
        link: "/advertise",
        isFallback: true,
      }]);
      setIsLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (isLoading || ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  const handleClick = () => {
    if (!currentAd.isFallback) trackEvent(currentAd.id, "click");
    if (currentAd.link && currentAd.link !== "#") {
      window.open(currentAd.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={`sticky top-20 ${className}`}>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700">
        {/* Ad Header */}
        <div className="px-4 py-2 bg-gradient-to-r from-burgundy-500 to-burgundy-600">
          <p className="text-xs font-semibold text-white uppercase tracking-wide">Featured Ad</p>
        </div>

        {/* Ad Image */}
        <div
          className="relative w-full aspect-[3/4] cursor-pointer overflow-hidden bg-neutral-100 dark:bg-neutral-700 group"
          onClick={handleClick}
        >
          <Image
            src={currentAd.image}
            alt={currentAd.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Ad Info */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-sm text-neutral-900 dark:text-white line-clamp-2">
            {currentAd.title}
          </h3>

          {ads.length > 1 && (
            <div className="flex justify-center gap-1.5">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAdIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentAdIndex
                      ? "bg-burgundy-600 w-6"
                      : "bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to ad ${index + 1}`}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleClick}
            className="w-full py-2.5 bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white rounded-lg font-semibold text-sm hover:from-burgundy-600 hover:to-burgundy-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {currentAd.isFallback ? "Advertise Here" : "Learn More"}
          </button>
        </div>

        <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">Advertisement</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarAd;
