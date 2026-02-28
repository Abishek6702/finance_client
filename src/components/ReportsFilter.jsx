import React from "react";
import { Download, ListFilter, Search } from "lucide-react";
import CustomSelect from "./CustomSelect";

export default function ReportsFilter({search,
  onSearchChange,
  year,
  onYearChange,
  department,
  onDepartmentChange,
//   section,
//   onSectionChange,
  academicyear,
  onAcademicYearChange,
  onClearFilters,}) {
  return (
    <div className="flex justify-between items-center ">
        <div className="flex gap-4  items-center ">
        {/* Search Input */}
        <div className="relative ">
            <input
            className="w-full px-4 py-2 pr-10 rounded-lg bg-white outline-none border border-[#d9d9d9]"
            placeholder="Search Student and Roll number"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            />

            <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
        </div>

        {/* Year */}
        <CustomSelect
            placeholder="Year"
            value={year}
            onChange={onYearChange}
            options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
            className="w-32"
        />

        {/* Department */}
        <CustomSelect
            placeholder="Department"
            value={department}
            onChange={onDepartmentChange}
            options={[
            "AIDS",
            "AIML",
            "CSE",
            "CCE",
            "ECE",
            "EEE",
            "IT",
            "MECH",
            "CYS",
            ]}
            className="w-45"
        />

        {/* <CustomSelect
            placeholder="Section"
            value={section}
            onChange={onSectionChange}
            options={["CCE", "AIDS-A", "AIDS-B", "AIDS-C", "AIML", "CSE-A", "CSE-B", "CSE-C", "CSBE", "ECE-A", "ECE-B", "ECE-C", "EEE", "MECH"]}
            className="w-52"
        /> */}

        <button
            onClick={onClearFilters}
            className="px-4 flex items-center gap-1 py-2 border cursor-pointer border-gray-300 rounded-lg bg-white hover:bg-gray-100 text-gray-700"
        >
            Clear
            <ListFilter className="w-4 h-4 " />
        </button>
        </div>
        <div>
            <CustomSelect
            placeholder="Academic year"
            value={academicyear}
            onChange={onAcademicYearChange}
            options={["2018-2019","2019-2020","2020-2021", "2021-2022","2022-2023","2023-2024","2024-2025","2025-2026",]}
            className="w-55 inter"
        />
        </div>
    </div>
  );
}
