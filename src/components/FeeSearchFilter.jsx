import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "./CustomSelect";
import nodata from "../assets/nodata.svg";


const FeeSearchFilter = ({
  filters,
  setFilters,
  searchTerm,
  setSearchTerm,
  filteredStudents,
}) => {
  const navigate = useNavigate();

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

  // 🔥 Handle navigation
  const handleSelectStudent = (student) => {
    navigate(`/admin/fees_management/${student.id}`);
    setShowDropdown(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 w-[30%]">
      
      {/* 🔍 Search Input */}
      <div className="relative w-full bg-white">
        <input
          type="text"
          placeholder="Search Student / Roll No"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              if (filteredStudents.length > 0) {
                handleSelectStudent(filteredStudents[0]); // 🔥 navigate
              }
            }
          }}
          className="w-full px-4 py-2.5 pr-10 rounded-lg border border-[#d9d9d9] text-sm outline-none placeholder:text-gray-400"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white pl-1">
          <Search className="w-4 h-4 text-gray-400" />
        </div>

        {/* 🔽 Dropdown */}
        {showDropdown && searchTerm && (
          <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
            
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="flex items-center justify-between px-4 py-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                >
                  {/* Left */}
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

                  {/* Right */}
                  <div className="font-semibold text-gray-700">
                    {student.id}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-400 text-center">
                <img src={nodata} alt="No data" className="w-40 mx-auto" />
                <p className="text-gray-500">No results found</p>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default FeeSearchFilter;