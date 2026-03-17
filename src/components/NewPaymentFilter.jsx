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
  const semesterOptions = [ "Odd", "Even"];

  // FIX: Changed item.semester to item.semesterType to match your data structure
  const filteredByYearSem = transactions.filter((item) => {
  return (
    (!filters.academicYear || item.academicYear === filters.academicYear) &&
    (!filters.semester || item.semesterType === filters.semester) &&
    (!filters.feeHead || item.feeHead === filters.feeHead)
  );
});
  
  // DYNAMIC: This now correctly derives Fee Heads available for the selected Year/Sem

  // Combine static defaults with dynamic values found in the data
 const feeHeadOptions = [...new Set(filteredByYearSem.map((item) => item.feeHead))];

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
        <span className="text-[#0b56a4]">({filters.academicYear || "All years"})</span>
      </h2>

      <div className="flex items-center gap-4">
        {/* DYNAMIC SELECT: Options change when Year or Semester changes */}
        <CustomSelect
          label="Fee Head"
          options={feeHeadOptions}
          placeholder="Fee Head"
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
          placeholder="Semester"
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