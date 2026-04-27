"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getAdsByType } from "@/data/ads";

interface Ad {
  id: string;
  image: string;
  title: string;
  alt: string;
  link: string;
  isFallback?: boolean;
}

interface InlineAdProps {
  className?: string;
  style?: "default" | "minimal" | "highlight";
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

const InlineAd: React.FC<InlineAdProps> = ({ className = "", style = "default" }) => {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const tracked = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/advertising/hero-images?packageId=inline");
        if (res.ok) {
          const data = await res.json();
          const dbAds: Ad[] = (data.data || []).map((a: any) => ({
            id: a.id,
            image: a.adImageUrl,
            title: a.adTitle,
            alt: a.adTitle,
            link: a.destinationUrl || "#",
          }));
          if (dbAds.length > 0) {
            // Pick a random one from active DB ads
            setAd(dbAds[Math.floor(Math.random() * dbAds.length)]);
            setIsLoading(false);
            return;
          }
        }
      } catch {}

      // Fallback to static ads.ts
      const staticAds = getAdsByType("inline");
      if (staticAds.length > 0) {
        const picked = staticAds[Math.floor(Math.random() * staticAds.length)];
        setAd({
          id: `static-${picked.id}`,
          image: picked.image,
          title: picked.title,
          alt: picked.alt,
          link: picked.link,
          isFallback: true,
        });
      }
      setIsLoading(false);
    };
    load();
  }, []);

  // Track impression once on mount (when ad is displayed)
  useEffect(() => {
    if (!ad || ad.isFallback || tracked.current) return;
    tracked.current = true;
    trackEvent(ad.id, "impression");
  }, [ad]);

  if (!isVisible || isLoading || !ad) return null;

  const handleClick = () => {
    if (!ad.isFallback) trackEvent(ad.id, "click");
    if (ad.link && ad.link !== "#") {
      window.open(ad.link, "_blank", "noopener,noreferrer");
    }
  };

  const baseClasses =
    "bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-neutral-200 dark:border-neutral-700";

  if (style === "minimal") {
    return (
      <div className={`${baseClasses} ${className}`}>
        <div className="flex items-center gap-4 p-4">
          <div
            className="w-24 h-24 flex-shrink-0 relative rounded-lg overflow-hidden cursor-pointer"
            onClick={handleClick}
          >
            <Image src={ad.image} alt={ad.alt} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-burgundy-600 dark:text-burgundy-400 font-semibold uppercase mb-1">
              Sponsored
            </p>
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-2">{ad.title}</h4>
            <button
              onClick={handleClick}
              className="text-xs bg-burgundy-600 text-white px-3 py-1.5 rounded hover:bg-burgundy-700 transition-colors"
            >
              Explore
            </button>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            aria-label="Close ad"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (style === "highlight") {
    return (
      <div
        className={`${baseClasses} bg-gradient-to-r from-burgundy-50 to-red-50 dark:from-burgundy-900/20 dark:to-red-900/20 ${className}`}
      >
        <div className="grid grid-cols-3 gap-4 p-6">
          <div className="col-span-2 flex flex-col justify-center">
            <p className="text-xs text-burgundy-600 dark:text-burgundy-400 font-bold uppercase tracking-wide mb-2">
              Featured Partner
            </p>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">{ad.title}</h3>
            <button
              onClick={handleClick}
              className="w-fit px-6 py-2 bg-burgundy-600 text-white rounded-lg font-semibold text-sm hover:bg-burgundy-700 transition-colors shadow-md"
            >
              Learn More →
            </button>
          </div>
          <div
            className="relative rounded-lg overflow-hidden cursor-pointer"
            onClick={handleClick}
          >
            <Image
              src={ad.image}
              alt={ad.alt}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    );
  }

  // Default style
  return (
    <div className={`${baseClasses} ${className}`}>
      <div
        className="relative w-full aspect-video bg-neutral-100 dark:bg-neutral-700 cursor-pointer group"
        onClick={handleClick}
      >
        <Image
          src={ad.image}
          alt={ad.alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            aria-label="Close ad"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-burgundy-600 dark:text-burgundy-400 font-semibold uppercase mb-2">
          Advertisement
        </p>
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">{ad.title}</h3>
        <button
          onClick={handleClick}
          className="w-full py-2 bg-burgundy-500 text-white rounded-lg font-semibold text-sm hover:bg-burgundy-600 transition-colors"
        >
          Visit Now
        </button>
      </div>
    </div>
  );
};

export default InlineAd;
