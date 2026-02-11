import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({
  placeholder,
  value,
  onChange,
  options = [],
  multiple = false,
  className = "w-40",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (multiple) {
      let newValue = value || [];

      if (newValue.includes(option)) {
        newValue = newValue.filter((item) => item !== option);
      } else {
        newValue = [...newValue, option];
      }

      onChange(newValue);
    } else {
      onChange(option);
      setOpen(false);
    }
  };

  const displayValue = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder;
      return `${value.length} selected`;
    }
    return value || placeholder;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Box */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center px-4 py-2 bg-white border border-[#d9d9d9] rounded-lg cursor-pointer"
      >
        <span className={`${value && value.length !== 0 ? "text-black" : "text-gray-600"}`}>
          {displayValue()}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""} text-gray-600`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-[#d9d9d9] rounded-lg shadow-md max-h-60 overflow-y-auto">
          {options.map((option, index) => {
            const selected = multiple
              ? value?.includes(option)
              : value === option;

            return (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${
                  selected ? "bg-blue-50" : ""
                }`}
              >
                {multiple && (
                  <input
                    type="checkbox"
                    checked={selected}
                    readOnly
                  />
                )}
                {option}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
