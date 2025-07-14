'use client';

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Category = "bags" | "tshirts" | "hoodies";
type FilterValue = "all" | Category;

interface Props {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  className?: string;
}

export default function CategoryDropdown({ value, onChange, className = "" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: "all", label: "All Categories" },
    { value: "bags", label: "Bags" },
    { value: "tshirts", label: "T-Shirts" },
    { value: "hoodies", label: "Hoodies" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-700"
      >
        {options.find((opt) => opt.value === value)?.label || "Select"}
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {options.map((option, index) => (
            <div key={option.value}>
              <button
                onClick={() => {
                  onChange(option.value as FilterValue);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                  value === option.value ? "bg-red-50 text-red-600" : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
              {index < options.length - 1 && (
                <div className="border-t border-gray-200 mx-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
