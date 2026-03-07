import React from "react";
import CustomSelect from "./CustomSelect";
import { ListFilter } from "lucide-react";

const NewPaymentFilter = ({
  filters,
  setFilters,
  transactions,
  academicYearOptions,
  defaultFilters,
}) => {
  const semesterOptions = ["Odd", "Even"];

  const filteredByYearSem = (transactions || []).filter(
    (item) =>
      item.academicYear === filters.academicYear &&
      item.semester === filters.semester
  );

  const feeHeadOptions = [
    "All",
    ...new Set(filteredByYearSem.map((item) => item.feeHead)),
  ];

  return (
    <div className="w-full bg-white rounded-xl flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">
        Payment Details / Academic Year{" "}
        <span className="text-[#0b56a4]">({filters.academicYear})</span>
      </h2>

      <div className="flex items-center gap-4">
        <CustomSelect
          options={feeHeadOptions}
          value={filters.feeHead}
          onChange={(value) => setFilters({ ...filters, feeHead: value })}
        />

        <CustomSelect
          options={academicYearOptions}
          value={filters.academicYear}
          onChange={(value) => setFilters({ ...filters, academicYear: value })}
        />

        <CustomSelect
          options={semesterOptions}
          value={filters.semester}
          onChange={(value) => setFilters({ ...filters, semester: value })}
        />

        <button
          onClick={() => defaultFilters && setFilters(defaultFilters)}
          className="px-4 flex items-center gap-2 py-2 rounded-lg border border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Clear
          <ListFilter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NewPaymentFilter;