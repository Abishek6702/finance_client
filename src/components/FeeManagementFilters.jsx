import React from "react";
import { Download, ListFilter, Search } from "lucide-react";
import CustomSelect from "./CustomSelect";

export default function FeeManagementFilters({
  search,
  onSearchChange,
  year,
  onYearChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
  onExport,
  onClearFilters,
  selectedCount,
}) {
  return (
    <div className="flex gap-4 mb-4 items-center">
      <div className="relative">
        <input
          className="w-full px-4 py-2 pr-10 rounded-lg bg-white outline-none border border-[#d9d9d9] focus:border-[#0B56A4]"
          placeholder="Search Student and Roll number"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
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
        options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
        className="w-32"
      />

      <CustomSelect
        placeholder="Department"
        value={department}
        onChange={onDepartmentChange}
        options={["AIDS", "AIML", "CSE", "CCE", "ECE", "EEE", "IT", "MECH", "CYS"]}
        className="w-40"
      />

      <CustomSelect
        placeholder="Payment Status"
        value={status}
        onChange={onStatusChange}
        options={["Paid", "Partial", "Overdue"]}
        className="w-44"
      />

      <CustomSelect
        placeholder="Student Type"
        value={type}
        onChange={onTypeChange}
        options={["Hostel", "Dayscholar", "Transport"]}
        multiple
        className="w-52"
      />

      <button
        onClick={onClearFilters}
        className="px-4 flex items-center gap-1 py-2 border cursor-pointer border-gray-300 rounded-lg bg-white hover:bg-gray-100 text-gray-700 transition-colors"
      >
        Clear 
        <ListFilter className="w-4 h-4" />
      </button>

      <button
        onClick={onExport}
        className="ml-auto bg-[#0B56A4] text-white px-5 py-2 rounded-lg flex items-center gap-2 font-inter hover:bg-[#094685] transition-colors shadow-sm"
      >
        <Download size={18} /> 
        Export ({selectedCount})
      </button>
    </div>
  );
}