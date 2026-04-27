import React, { FC } from "react";
import HeroSearchForm from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import HeroImageSlider from "@/components/HeroImageSlider";
import HeroStaticImages from "@/components/HeroStaticImages";

export interface SectionHeroProps {
  className?: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionHero flex flex-col-reverse lg:flex-col relative ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start">
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 pb-14 lg:pb-64 xl:pr-14 lg:mr-10 xl:mr-0">
          <h2 className="font-medium text-4xl md:text-5xl xl:text-7xl !leading-[114%] ">
            Connect with verified local businesses
          </h2>
          <span className="text-base md:text-lg text-neutral-500 dark:text-neutral-400">
            Discover the best businesses across South Africa - from restaurants and shops to professional services and tourism operators.
          </span>

        </div>

        {/* Image Grid Layout */}
        <div className="flex-grow pb-20 lg:pb-0 overflow-hidden">
          <div className="grid grid-cols-2 gap-4 h-[500px] lg:h-[450px]">
            {/* Left Column - Two stacked images from database (packageId='advert1') */}
            <HeroStaticImages />

            {/* Right Column - Single tall rotating image from database (packageId='advert2') */}
            <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-neutral-900">
              <HeroImageSlider />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block z-10 mb-12 lg:mb-0 lg:-mt-56 w-full">
        <HeroSearchForm />
      </div>
    </div>
  );
};

export default SectionHero;