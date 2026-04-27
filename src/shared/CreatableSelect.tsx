"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import Input from "./Input";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import twFocusClass from "@/utils/twFocusClass";

export interface CreatableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

const CreatableSelect: FC<CreatableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select or type a city/town/village",
  className = "",
  label = "",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);

    const newFilteredOptions = options.filter((option) =>
      option.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredOptions(newFilteredOptions);
    onChange(newValue); // Update parent state immediately
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setFilteredOptions(options); // Show all options on focus
  };

  const handleAddNew = () => {
    if (inputValue && !options.includes(inputValue)) {
      // In a real app, you might want to add this to the options list permanently
      // For now, just select it.
      onChange(inputValue);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className="w-full"
      />

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  value === option ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {option}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">
              No matching options.
            </div>
          )}
          {inputValue && !options.includes(inputValue) && (
            <button
              onClick={handleAddNew}
              className={`w-full text-left px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 ${twFocusClass()}`}
            >
              <PlusIcon className="w-4 h-4" />
              Add "{inputValue}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatableSelect;
