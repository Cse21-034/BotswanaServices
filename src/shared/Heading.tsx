import React, { HTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  fontClass?: string;
  desc?: ReactNode;
  isCenter?: boolean;
  viewAllLink?: string; // Add this line
}

const Heading: React.FC<HeadingProps> = ({
  children,
  desc = " Discover South Africa's best services and businesses at your finger tips ",
  className = "mb-10 text-neutral-900 dark:text-neutral-50",
  isCenter = false,
  viewAllLink, // Destructure viewAllLink
  ...args
}) => {
  return (
    <div className={`nc-Section-Heading relative ${className}`}>
      <div
        className={
          isCenter ? "text-center w-full max-w-2xl mx-auto mb-4" : "max-w-2xl"
        }
      >
        <h2 className={`text-3xl md:text-4xl font-semibold`} {...args}>
          {children || `Section Heading`}
        </h2>
        {desc && (
          <span className="block mt-2 md:mt-3 font-normal text-base sm:text-lg text-neutral-500 dark:text-neutral-400">
            {desc}
          </span>
        )}
      </div>
      {!isCenter && viewAllLink && (
        <Link
          href={viewAllLink}
          className="absolute right-0 top-full sm:top-0 sm:translate-y-0 mt-5 sm:mt-0 text-sm font-medium text-primary-6000 hover:text-primary-500"
        >
          View All
        </Link>
      )}
    </div>
  );
};

export default Heading;
