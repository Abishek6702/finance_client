import React, { useEffect, useState, useRef } from "react";
import { Search, ListFilter } from "lucide-react";
import CustomSelect from "./CustomSelect";

const RecallFilter = ({ filters, setFilters, searchTerm, setSearchTerm }) => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const defaultFilters = {
    academicYear: "",
    year: "",
    dept: "",
    status: "",
    fromDate: "",
    toDate: "",
  };
  const dateRef = useRef(null);
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters(defaultFilters);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setShowDateFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dropdown Options
  const academicYearOptions = ["2024-2025", "2025-2026", "2026-2027"];
  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const deptOptions = [
    "CSE",
    "MECH",
    "ECE",
    "CCE",
    "EEE",
    "IT",
    "AIDS",
    "AIML",
    "CSE(CYB)",
  ];
  const statusOptions = ["Pending", "Approved", "Rejected"];

  return (
    <div className="flex flex-wrap items-center gap-4 ">
      {/* Search Box */}
      <div className="relative w-70">
        <input
          type="text"
          placeholder="Search Student and Roll number and Receipt number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 pr-10 rounded-lg border border-[#d9d9d9] bg-white text-sm focus:border-gray-400 outline-none transition-all placeholder:text-gray-400"
        />

        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Academic Year */}
      <CustomSelect
        placeholder="Academic Year"
        value={filters.academicYear}
        options={academicYearOptions}
        onChange={(v) => setFilters({ ...filters, academicYear: v })}
        className="w-40"
      />

      {/* Year */}
      <CustomSelect
        placeholder="Year"
        value={filters.year !== "Year" ? filters.year : ""}
        options={yearOptions}
        onChange={(v) => setFilters({ ...filters, year: v })}
        className="w-30"
      />

      {/* Department */}
      <CustomSelect
        placeholder="Department"
        value={filters.dept !== "Department" ? filters.dept : ""}
        options={deptOptions}
        onChange={(v) => setFilters({ ...filters, dept: v })}
        className="w-36"
      />

      <CustomSelect
        placeholder="Status"
        value={filters.status}
        options={statusOptions}
        onChange={(v) => setFilters({ ...filters, status: v })}
        className="w-36"
      />

      <div className="relative" ref={dateRef}>
<button
onClick={() => setShowDateFilter(prev => !prev)}
className="h-10 px-4 border border-gray-300 rounded-lg bg-white text-sm hover:bg-gray-50"
>
Raised On
</button>

        {showDateFilter && (
          <div className="absolute mt-2 right-0 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm text-gray-600">From</label>
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
                <label className="text-sm text-gray-600">To</label>
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

      {/* Clear Button */}
      <button
        onClick={handleClearFilters}
        className="h-10 px-4 flex cursor-pointer items-center justify-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50  text-gray-700 transition-colors"
      >
        Clear <ListFilter size={15} />
      </button>
    </div>
  );
};

export default RecallFilter;
