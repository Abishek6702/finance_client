import React from 'react';
import { Search, ListFilter } from 'lucide-react';
import CustomSelect from './CustomSelect'; // 👈 Use new dropdown

const PaymentMFilter = ({ filters, setFilters, searchTerm, setSearchTerm }) => {

  const defaultFilters = {
    year: 'Year',
    dept: 'Department',
    mode: 'Mode',
    feeHead: 'Fee Head'
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters(defaultFilters);
  };

  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const deptOptions = ['CSE', 'MECH', 'ECE', 'CCE', 'EEE', 'IT', 'AIDS', 'AIML', 'CSE(CYB)'];
  const modeOptions = ['Cash', 'UPI', 'DD', 'NEFT'];
  const feeHeadOptions = ['Tution Fees', 'Hostel Fees', 'Exam Fees', 'Software Fees'];

  return (
    <div className="flex flex-wrap items-center gap-3">

      {/* Search Box */}
      <div className="relative w-70 bg-white">
        <input 
          type="text" 
          placeholder="Search Student and Roll number" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pr-10 rounded-lg border border-[#d9d9d9] bg-white focus:border-gray-400 outline-none transition-all placeholder:text-gray-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white pl-1">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Year */}
      <CustomSelect
        placeholder="Year"
        value={filters.year !== 'Year' ? filters.year : ''}
        options={yearOptions}
        onChange={(v) => setFilters({ ...filters, year: v })}
        className="w-32"
      />

      {/* Department */}
      <CustomSelect
        placeholder="Department"
        value={filters.dept !== 'Department' ? filters.dept : ''}
        options={deptOptions}
        onChange={(v) => setFilters({ ...filters, dept: v })}
        className="w-44"
      />

      {/* Mode */}
      <CustomSelect
        placeholder="Mode"
        value={filters.mode !== 'Mode' ? filters.mode : ''}
        options={modeOptions}
        onChange={(v) => setFilters({ ...filters, mode: v })}
        className="w-36"
      />

      {/* Fee Head */}
      <CustomSelect
        placeholder="Fee Head"
        value={filters.feeHead !== 'Fee Head' ? filters.feeHead : ''}
        options={feeHeadOptions}
        onChange={(v) => setFilters({ ...filters, feeHead: v })}
        className="w-40"
      />

      {/* Clear Button */}
      <button 
        onClick={handleClearFilters} 
        className="px-4 ml-4 flex items-center gap-2 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-700 transition-colors"
      >
        Clear <ListFilter size={15} />
      </button>

    </div>
  );
};

export default PaymentMFilter;