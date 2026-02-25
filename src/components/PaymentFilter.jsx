import React from 'react';
import { Search, ListFilter } from 'lucide-react';
import CustomSelect from './CustomSelect';

const PaymentFilter = ({ filters, setFilters, searchTerm, setSearchTerm }) => {

  const defaultFilters = {
    academicYear: '2025-2026',
    year: 'Year',
    dept: 'Department'
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters(defaultFilters);
  };

  // Dropdown Options
  const academicYearOptions = ['2024-2025', '2025-2026', '2026-2027'];
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const deptOptions = ['CSE', 'MECH', 'ECE', 'CCE', 'EEE', 'IT', 'AIDS', 'AIML', 'CSE(CYB)'];

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">

      {/* Search Box */}
      <div className="relative w-110 bg-white">
        <input 
          type="text" 
          placeholder="Search Student and Roll number and Receipt number" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-[10px] pr-10 rounded-lg border border-[#d9d9d9] bg-white text-sm focus:border-gray-400 outline-none transition-all placeholder:text-gray-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white pl-1">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Academic Year */}
      <CustomSelect
        placeholder="Academic Year"
        value={filters.academicYear}
        options={academicYearOptions}
        onChange={(v) => setFilters({ ...filters, academicYear: v })}
        className="w-48"
      />

      {/* Year */}
      <CustomSelect
        placeholder="Year"
        value={filters.year !== 'Year' ? filters.year : ''}
        options={yearOptions}
        onChange={(v) => setFilters({ ...filters, year: v })}
        className="w-36"
      />

      {/* Department */}
      <CustomSelect
        placeholder="Department"
        value={filters.dept !== 'Department' ? filters.dept : ''}
        options={deptOptions}
        onChange={(v) => setFilters({ ...filters, dept: v })}
        className="w-52"
      />

      {/* Clear Button */}
      <button 
        onClick={handleClearFilters} 
        className="h-10 px-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50  text-gray-700 transition-colors"
      >
        Clear <ListFilter size={15} />
      </button>

    </div>
  );
};

export default PaymentFilter;