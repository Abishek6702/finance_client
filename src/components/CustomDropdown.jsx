import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({ 
  label, 
  value, 
  options, 
  onSelect, 
  isOpen, 
  setIsOpen, 
  widthClass = "w-40" 
}) => {
  // Logic to determine if a real selection is active (not the placeholder)
  const isSelected = value && value !== `All ${label}s` && value !== label;

  return (
    <div className={`relative ${widthClass}`}>
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center justify-between w-full px-4 py-2 bg-white border border-[#d9d9d9] rounded-lg text-gray-600 cursor-pointer hover:border-gray-400 focus:outline-none transition-all"
      >
        <span className={`truncate ${isSelected ? "text-black font-medium" : ""}`}>
          {isSelected ? value : label}
        </span>
        <ChevronDown 
          size={18} 
          className={`text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-full min-w-[160px] bg-white border border-[#d9d9d9] rounded-lg shadow-xl z-[100] py-1 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="max-h-60 overflow-y-auto">
            {options.map((opt, index) => {
              const active = value === opt;
              return (
                <button 
                  key={index}
                  type="button"
                  onClick={() => {
                    onSelect(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2  flex items-center justify-between transition-colors ${
                    active 
                      ? 'bg-blue-50 text-[#0B56A4] font-medium' 
                      : 'hover:bg-gray-100 '
                  }`}
                >
                  <span>{opt}</span>
                  {active && <Check size={14} className="text-[#0B56A4]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;