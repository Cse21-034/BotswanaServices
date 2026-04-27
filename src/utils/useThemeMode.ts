"use client";

import { useEffect, useState } from "react";

export const useThemeMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark';
    }
    return false;
  });

  useEffect(() => {
    // Enbale this if you want use the dark-mode for default mode.
    // if (!localStorage.theme) {
    //   localStorage.theme = "dark";
    // }
    //
    if (localStorage.theme === "dark") {
      toDark();
    } else {
      toLight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toDark = () => {
    setIsDarkMode(true);
    const root = document.querySelector("html");
    if (!root) return;
    !root.classList.contains("dark") && root.classList.add("dark");
    localStorage.theme = "dark";
  };

  const toLight = () => {
    setIsDarkMode(false);
    const root = document.querySelector("html");
    if (!root) return;
    root.classList.remove("dark");
    localStorage.theme = "light";
  };

  function _toogleDarkMode() {
    if (localStorage.theme === "light") {
      toDark();
    } else {
      toLight();
    }
  }

  return {
    isDarkMode,
    toDark,
    toLight,
    _toogleDarkMode,
  };
};
