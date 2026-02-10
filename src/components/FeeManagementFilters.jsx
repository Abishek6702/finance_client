import React from "react";
import { Download,Search  } from 'lucide-react';

export default function FeeFilters({
  search,
  onSearchChange,
  year,
  onYearChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  onExport,
}) {
  return (
    <div className="flex gap-4 mb-4 items-center">
      <div className="relative w-100">
        <input
            className="w-full px-4 py-2 pr-10 rounded-lg bg-white outline-none"
            placeholder="Search Student and Roll number"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
        />

        <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        </div>

      <select
        className="outline-none px-6 py-2 rounded-lg bg-white"
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
      >
        <option value="">Year</option>
        <option>1 Year</option>
        <option>2 Year</option>
        <option>3 Year</option>
        <option>4 Year</option>
      </select>

      <select
        className="outline-none px-6 py-2 rounded-lg bg-white"
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
      >
        <option value="">Department</option>
        <option>AIDS</option>
        <option>AIML</option>
        <option>CSE</option>
        <option>CCE</option>
        <option>ECE</option>
        <option>EEE</option>
        <option>IT</option>
        <option>MECH</option>
        <option>CYS</option>
      </select>

      <select
        className="outline-none px-6 py-2 rounded-lg bg-white"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">Payment Status</option>
        <option>Pending</option>
        <option>Paid</option>
      </select>

      <button
        onClick={onExport}
        className="ml-auto bg-[#0B56A4] text-white px-5 py-2 rounded-lg flex items-center gap-2 inter"
      >
        <Download /> Export Data
      </button>
    </div>
  );
}
