import React, { useState, useEffect } from 'react';
import { Search, ListFilter } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

const PaymentFilter = ({ filters, setFilters, searchTerm, setSearchTerm }) => {
  // Local state to track which dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState(null);

  // Default values for resetting
  const defaultFilters = {
    academicYear: '2025-2026',
    year: 'Year',
    dept: 'Department'
  };

  // Check if any filter is active to show/hide the Clear button

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters(defaultFilters);
    setOpenDropdown(null);
  };

  // Close dropdowns when clicking anywhere else on the page
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Dropdown Options
  const academicYearOptions = ['2024-2025', '2025-2026', '2026-2027'];
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const deptOptions = ['CSE', 'MECH', 'ECE', 'CCE', 'EEE', 'IT', 'AIDS', 'AIML', 'CSE(CYB)'];

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      {/* Search Box */}
      <div 
        className="relative w-80 bg-[#ffffff]" 
        onClick={(e) => e.stopPropagation()}
      >
        <input 
          type="text" 
          placeholder="Search Student and Roll number" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pr-10 rounded-lg border border-[#d9d9d9] bg-[#ffffff] text-sm focus:border-gray-400 outline-none transition-all placeholder:text-gray-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white pl-1">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Academic Year Dropdown */}
      <CustomDropdown 
        label="Academic Year" 
        value={filters.academicYear} 
        options={academicYearOptions} 
        isOpen={openDropdown === 'academic'}
        setIsOpen={(val) => setOpenDropdown(val ? 'academic' : null)}
        onSelect={(v) => setFilters({...filters, academicYear: v})} 
        widthClass="w-48"
      />
      
      {/* Year Dropdown */}
      <CustomDropdown 
        label="Year" 
        value={filters.year} 
        options={yearOptions} 
        isOpen={openDropdown === 'year'}
        setIsOpen={(val) => setOpenDropdown(val ? 'year' : null)}
        onSelect={(v) => setFilters({...filters, year: v})} 
        widthClass="w-36"
      />
      
      {/* Department Dropdown */}
      <CustomDropdown 
        label="Department" 
        value={filters.dept} 
        options={deptOptions} 
        isOpen={openDropdown === 'dept'}
        setIsOpen={(val) => setOpenDropdown(val ? 'dept' : null)}
        onSelect={(v) => setFilters({...filters, dept: v})} 
        widthClass="w-52"
      />

      {/* Clear Filter Button - Only visible when filters are applied */}
      {(
        <button 
          onClick={handleClearFilters} 
          className="px-4 flex items-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors animate-in fade-in zoom-in-95 duration-200"
        >
          Clear <ListFilter size={15} />
        </button>
      )}
    </div>
  );
};

export default PaymentFilter;