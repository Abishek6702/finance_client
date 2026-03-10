import React from "react";
import CustomSelect from "./CustomSelect";
import { ListFilter } from "lucide-react";

const NewPaymentFilter = ({
  filters,
  setFilters,
  transactions,
  academicYearOptions,
  onClear,
}) => {
  const semesterOptions = ["Odd", "Even"];

  // FIX: Changed item.semester to item.semesterType to match your data structure
  const filteredByYearSem = (transactions || []).filter(
    (item) =>
      item.academicYear === filters.academicYear &&
      item.semesterType === filters.semester 
  );
  
  // DYNAMIC: This now correctly derives Fee Heads available for the selected Year/Sem
  const dynamicFeeHeads = [...new Set(filteredByYearSem.map((item) => item.feeHead))];

  // Combine static defaults with dynamic values found in the data
  const feeHeadOptions = [
    "All",
    ...dynamicFeeHeads
  ];

  const handleClearClick = () => {
    if (onClear) {
      onClear();
    } else {
      setFilters({
        ...filters,
        feeHead: "All",
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-xl flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">
        Payment Details / Academic Year{" "}
        <span className="text-[#0b56a4]">({filters.academicYear || "N/A"})</span>
      </h2>

      <div className="flex items-center gap-4">
        {/* DYNAMIC SELECT: Options change when Year or Semester changes */}
        <CustomSelect
          label="Fee Head"
          options={feeHeadOptions}
          value={filters.feeHead}
          onChange={(value) => setFilters({ ...filters, feeHead: value })}
        />

        <CustomSelect
          label="Academic Year"
          options={academicYearOptions}
          value={filters.academicYear}
          onChange={(value) => setFilters({ ...filters, academicYear: value })}
        />

        <CustomSelect
          label="Semester"
          options={semesterOptions}
          value={filters.semester}
          onChange={(value) => setFilters({ ...filters, semester: value })}
        />

        <button
          onClick={handleClearClick}
          className="px-4 flex items-center gap-2 py-2 rounded-lg border border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
        >
          Clear
          <ListFilter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NewPaymentFilter;