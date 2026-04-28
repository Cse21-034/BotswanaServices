"use client";

import React from "react";
import Link from "next/link";
import { LockClosedIcon, SparklesIcon } from "@heroicons/react/24/outline";

type Tier = "WILD_HORSES" | "DESERT_ELEPHANTS" | "DESERT_LIONS";

const TIER_ORDER: Record<Tier, number> = {
  WILD_HORSES: 0,
  DESERT_ELEPHANTS: 1,
  DESERT_LIONS: 2,
};

const TIER_LABELS: Record<Tier, string> = {
  WILD_HORSES: "Wild Horses",
  DESERT_ELEPHANTS: "Desert Elephants",
  DESERT_LIONS: "Desert Lions",
};

const TIER_PRICES: Record<Tier, string> = {
  WILD_HORSES: "Free",
  DESERT_ELEPHANTS: "BWP 100/month",
  DESERT_LIONS: "BWP 250/month",
};

interface PlanGateProps {
  requiredTier: Tier;
  currentTier: string | null | undefined;
  businessId: string;
  feature: string;
  description?: string;
  children: React.ReactNode;
}

const PlanGate: React.FC<PlanGateProps> = ({
  requiredTier,
  currentTier,
  businessId,
  feature,
  description,
  children,
}) => {
  const current = (currentTier as Tier) || "WILD_HORSES";
  const hasAccess = TIER_ORDER[current] >= TIER_ORDER[requiredTier];

  if (hasAccess) return <>{children}</>;

  return (
    <div className="relative min-h-[400px] flex items-center justify-center">
      {/* Blurred background hint */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none select-none opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800" />
      </div>

      {/* Lock card */}
      <div className="relative z-10 w-full max-w-md mx-auto text-center px-4">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-8">
          {/* Lock icon */}
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>

          {/* Feature name */}
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {feature} Locked
          </h3>

          {description && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {description}
            </p>
          )}

          {/* Required plan badge */}
          <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-full px-4 py-2 mb-6">
            <SparklesIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Requires {TIER_LABELS[requiredTier]} â€” {TIER_PRICES[requiredTier]}
            </span>
          </div>

          {/* Current plan note */}
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-6">
            You are on the <span className="font-semibold">{TIER_LABELS[current]}</span> plan
          </p>

          {/* Upgrade button */}
          <Link
            href={`/business/${businessId}/subscription/plans`}
            className="block w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
          >
            Upgrade Now â†’
          </Link>

          <Link
            href={`/business/${businessId}/subscription/plans`}
            className="block mt-3 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            View all plans & features
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlanGate;
