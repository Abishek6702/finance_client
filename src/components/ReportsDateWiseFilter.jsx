import React, { useState, useRef, useEffect } from "react";
import CustomSelect from "./CustomSelect";
import { Download, ListFilter, Calendar, X } from "lucide-react";

export default function ReportsDateWiseFilter({
  dateRange,
  onDateRangeChange,
  year,
  onYearChange,
  onExport,
  onClearFilters,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDateLabel = () => {
    if (dateRange?.start && dateRange?.end) {
      return `${dateRange.start} → ${dateRange.end}`;
    }
    if (dateRange?.start) return `From ${dateRange.start}`;
    if (dateRange?.end) return `Until ${dateRange.end}`;
    return "Select Date Range";
  };

  return (
    <div className="flex justify-between items-center gap-4 mb-6">
      <div className="flex items-center gap-4">

        {/* 🔹 Date Range Picker */}
        <div className="relative" ref={popoverRef}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="border border-[#D9D9D9] rounded-lg px-3 py-2 bg-white flex items-center gap-2 cursor-pointer min-w-[230px] h-[42px]"
          >
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm">{getDateLabel()}</span>
          </div>

          {isOpen && (
            <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 shadow-xl rounded-xl p-4 min-w-[260px]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Range
                </span>
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => setIsOpen(false)}
                />
              </div>

              <div className="space-y-3">
                <input
                  type="date"
                  value={dateRange?.start || ""}
                  onChange={(e) =>
                    onDateRangeChange({
                      ...dateRange,
                      start: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2 text-sm outline-none"
                />
                <input
                  type="date"
                  value={dateRange?.end || ""}
                  onChange={(e) =>
                    onDateRangeChange({
                      ...dateRange,
                      end: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2 text-sm outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 🔹 Academic Year Filter */}
        <CustomSelect
          placeholder="Academic Year"
          value={year}
          onChange={onYearChange}
          options={["2024-2025", "2025-2026", "2026-2027"]}
          className="w-48"
        />

        {/* 🔹 Clear Button */}
        <button
          onClick={onClearFilters}
          className="px-4 h-[42px] flex items-center gap-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
        >
          <span className="text-sm font-medium">Clear</span>
          <ListFilter size={16} />
        </button>
      </div>

      {/* 🔹 Export Button */}
      <button
        onClick={onExport}
        className="bg-[#1F5AA6] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#174a8c] transition-all shadow-sm active:scale-95 h-[42px]"
      >
        <Download size={18} />
        <span className="font-medium text-sm">Export Data</span>
      </button>
    </div>
  );
}