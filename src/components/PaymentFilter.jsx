import React, { useState } from "react";
import { Search, ListFilter } from "lucide-react";
import CustomSelect from "./CustomSelect";

const PaymentFilter = ({
  filters,
  setFilters,
  searchTerm,
  setSearchTerm,
  filteredStudents,
  setSelectedStudent,
}) => {
  const defaultFilters = {
    academicYear: "2025-2026",
    year: "Year",
    dept: "Department",
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters(defaultFilters);
  };

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

  return (
    <div className="flex flex-wrap items-center gap-4  w-[30%]">
      <div className="relative w-full  bg-white">
        <input
          type="text"
          placeholder="Search Student and Roll number"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true); // show when typing
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              if (filteredStudents.length > 0) {
                const student = filteredStudents[0]; // select first match
                setSelectedStudent(student);
                setSearchTerm(student.id);
                setShowDropdown(false); // 🔥 hide dropdown
              }
            }
          }}
          className="w-full px-4 py-2.5 pr-10 rounded-lg border border-[#d9d9d9] bg-white text-sm outline-none transition-all placeholder:text-gray-400"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white pl-1">
          <Search className="w-4 h-4 text-gray-400" />
        </div>

        {/* 🔥 Search Results Dropdown */}
        {showDropdown && searchTerm && (
          <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => {
                    setSelectedStudent(student);
                    setSearchTerm(student.id);
                    setShowDropdown(false);
                  }}
                  className="flex items-center justify-between px-4 py-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  {/* Left Section */}
                  <div className="flex items-center gap-3">
                    <img
                      src={student.img}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        {student.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {student.year} / {student.dept}
                      </span>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className=" font-semibold text-gray-700">
                    {student.id}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-400">No students found</div>
            )}
          </div>
        )}
      </div>

      {/* <CustomSelect
        placeholder="Academic Year"
        value={filters.academicYear}
        options={academicYearOptions}
        onChange={(v) => setFilters({ ...filters, academicYear: v })}
        className="w-48"
      />

      <CustomSelect
        placeholder="Year"
        value={filters.year !== "Year" ? filters.year : ""}
        options={yearOptions}
        onChange={(v) => setFilters({ ...filters, year: v })}
        className="w-36"
      />

      <CustomSelect
        placeholder="Department"
        value={filters.dept !== "Department" ? filters.dept : ""}
        options={deptOptions}
        onChange={(v) => setFilters({ ...filters, dept: v })}
        className="w-52"
      /> */}

      {/* Clear Button */}
      {/* <button
        onClick={handleClearFilters}
        className="h-10 px-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50  text-gray-700 transition-colors"
      >
        Clear <ListFilter size={15} />
      </button> */}
    </div>
  );
};

export default PaymentFilter;
