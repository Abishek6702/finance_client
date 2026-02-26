import React, { useState, useRef, useEffect } from "react";
import { Search, Calendar, ListFilter } from "lucide-react";
import CustomSelect from "../CustomSelect";

const RecallFilter = ({ filters, setFilters, searchTerm, setSearchTerm }) => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const dateRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setShowDateFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearFilters = () => {
    setFilters({
      year: "",
      dept: "",
      fromDate: "",
      toDate: "",
    });
  
    setSearchTerm("");
    setShowDateFilter(false);
  };

  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const deptOptions = [
    "CSE",
    "MECH",
    "ECE",
    "EEE",
    "IT",
    "AIDS",
    "AIML",
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 mt-4">
      
      {/* 🔍 Search */}
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Search Student / Roll No / Receipt No"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm focus:border-[#0B56A4] outline-none transition"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {/* 🎓 Year */}
      <CustomSelect
        placeholder="Year"
        value={filters.year}
        options={yearOptions}
        onChange={(v) => setFilters({ ...filters, year: v })}
        className="w-40"
      />

      {/* 🏫 Department */}
      <CustomSelect
        placeholder="Department"
        value={filters.dept}
        options={deptOptions}
        onChange={(v) => setFilters({ ...filters, dept: v })}
        className="w-48"
      />

      {/* 📅 Date Filter */}
      <div className="relative" ref={dateRef}>
        <button
          onClick={() => setShowDateFilter((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm border-gray-300 transition
            ${
              filters.fromDate || filters.toDate
                ? "outline-none"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
        >
          Date
          <Calendar size={16} />
        </button>

        

        {showDateFilter && (
          <div className="absolute mt-2 right-0 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-500">From</label>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) =>
                    setFilters({ ...filters, fromDate: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">To</label>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) =>
                    setFilters({ ...filters, toDate: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <button
  onClick={handleClearFilters}
  className="px-4 py-2.5 flex items-center gap-2 cursor-pointer  text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
>
  Clear <ListFilter className="w-4 h-4"/>
</button>
    </div>
  );
};

export default RecallFilter;