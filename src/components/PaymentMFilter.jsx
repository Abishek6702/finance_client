import React, { useState, useEffect } from 'react';
import { Search, ListFilter } from 'lucide-react';
import CustomDropdown from './CustomDropdown'; // Ensure path is correct

const PaymentMFilter = ({ filters, setFilters, searchTerm, setSearchTerm }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const defaultFilters = {
    year: 'Year',
    dept: 'Department',
    mode: 'Mode',
    feeHead: 'Fee Head'
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters(defaultFilters);
    setOpenDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const deptOptions = ['CSE', 'MECH', 'ECE', 'CCE', 'EEE', 'IT', 'AIDS', 'AIML', 'CSE(CYB)'];
  const modeOptions = ['Cash', 'UPI', 'DD', 'NEFT'];
  const feeHeadOptions = ['Tution Fees', 'Hostel Fees', 'Exam Fees', 'Software Fees'];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Box */}
      <div className="relative w-70 bg-[#ffffff]" onClick={(e) => e.stopPropagation()}>
        <input 
          type="text" 
          placeholder="Search Student and Roll number" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pr-10 rounded-lg border border-[#d9d9d9] bg-[#ffffff]  focus:border-gray-400 outline-none transition-all placeholder:text-gray-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white pl-1">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <CustomDropdown 
        label="Year" 
        value={filters.year} 
        options={yearOptions} 
        isOpen={openDropdown === 'year'}
        setIsOpen={(val) => setOpenDropdown(val ? 'year' : null)}
        onSelect={(v) => setFilters({...filters, year: v})} 
        widthClass="w-32"
      />
      
      <CustomDropdown 
        label="Department" 
        value={filters.dept} 
        options={deptOptions} 
        isOpen={openDropdown === 'dept'}
        setIsOpen={(val) => setOpenDropdown(val ? 'dept' : null)}
        onSelect={(v) => setFilters({...filters, dept: v})} 
        widthClass="w-44"
      />

      <CustomDropdown 
        label="Mode" 
        value={filters.mode} 
        options={modeOptions} 
        isOpen={openDropdown === 'mode'}
        setIsOpen={(val) => setOpenDropdown(val ? 'mode' : null)}
        onSelect={(v) => setFilters({...filters, mode: v})} 
        widthClass="w-36"
      />

      <CustomDropdown 
        label="Fee Head" 
        value={filters.feeHead} 
        options={feeHeadOptions} 
        isOpen={openDropdown === 'head'}
        setIsOpen={(val) => setOpenDropdown(val ? 'head' : null)}
        onSelect={(v) => setFilters({...filters, feeHead: v})} 
        widthClass="w-40"
      />

      {(
        <button 
          onClick={handleClearFilters} 
          className="px-4 flex items-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
        >
          Clear <ListFilter size={15} />
        </button>
      )}
    </div>
  );
};

export default PaymentMFilter;