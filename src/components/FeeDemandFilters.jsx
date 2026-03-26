import React, { useState } from "react";
import { Download, ListFilter, Search } from "lucide-react";
import CustomSelect from "./CustomSelect";

export default function FeeDemandFilters({
  search,
  onSearchChange,
  year,
  onYearChange,
  yearOptions,
  department,
  onDepartmentChange,
  departmentOptions,
  academicYear,
  onAcademicYearChange,
  academicYearOptions,
  onSearchEnter,
  type,
  onTypeChange,
  onExport,
  onClearFilters,
  selectedCount,
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-4 mb-4 items-center">
      <div className="relative">
        <input
          className="w-full px-4 py-2 pr-10 rounded-lg bg-white outline-none border border-[#d9d9d9] focus:border-[#0B56A4]"
          placeholder="Search Student and Roll number"
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value); // ✅ only typing
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearchEnter(); // ✅ clean trigger
            }
          }}
        />
        <Search
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      <CustomSelect
        placeholder="Year"
        value={year}
        onChange={onYearChange}
        options={yearOptions || []}
        className="w-24"
      />

      <CustomSelect
        placeholder="Department"
        value={department}
        onChange={onDepartmentChange}
        options={departmentOptions || []}
        className="w-38"
      />

      <CustomSelect
        placeholder="Student Type"
        value={type}
        onChange={onTypeChange}
        options={["Hostel", "Dayscholar", "Transport"]}
        multiple
        className="w-40"
      />

      <CustomSelect
        placeholder="Academic Year"
        value={academicYear}
        onChange={onAcademicYearChange}
        options={academicYearOptions || []}
        className="w-42"
      />

      <button
        onClick={onClearFilters}
        className="px-4 flex items-center gap-1 py-2 border cursor-pointer border-gray-300 rounded-lg bg-white hover:bg-gray-100 text-gray-700 transition-colors"
      >
        Clear
        <ListFilter className="w-4 h-4" />
      </button>

      <div className="relative ml-auto">
        <button
          onClick={() => setOpen(!open)}
          className="bg-[#0B56A4] text-white px-5 py-2 rounded-lg flex items-center gap-2 font-inter hover:bg-[#094685] transition-colors shadow-sm cursor-pointer"
        >
          <Download size={18} />
          Export ({selectedCount})
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            <button
              onClick={() => {
                onExport("excel");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Export Excel
            </button>

            <button
              onClick={() => {
                onExport("pdf");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Export PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
