"use client";

import { Route } from "@/routers/types";
import Link from "next/link"; // Keep Link import for now, might be used elsewhere
import React, { ButtonHTMLAttributes, FC } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

export interface ButtonProps {
  className?: string;
  translate?: string;
  sizeClass?: string;
  fontSize?: string;
  //
  loading?: boolean;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  href?: Route<string>;
  targetBlank?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Update onClick type
  children?: React.ReactNode;
}

const Button: FC<ButtonProps> = ({
  className = "text-neutral-700 dark:text-neutral-200",
  translate = "",
  sizeClass = "px-4 py-3 sm:px-6",
  fontSize = "text-sm sm:text-base font-medium",
  disabled = false,
  href,
  children,
  targetBlank,
  type,
  loading,
  onClick, // Remove default empty function
}) => {
  const router = useRouter(); // Initialize useRouter
  const CLASSES = `nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors ${fontSize} ${sizeClass} ${translate} ${className} `;

  const _renderLoading = () => {
    return (
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(event); // Call original onClick if provided
    if (href) {
      router.push(href);
    }
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${CLASSES}`}
      onClick={handleClick} // Use the new handleClick
      type={type}
    >
      {loading && _renderLoading()}
      {children || `This is Button`}
    </button>
  );
};

export default Button;
