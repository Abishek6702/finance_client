import React from "react";
import CustomSelect from "./CustomSelect";
import { ListFilter } from "lucide-react";

const NewPaymentFilter = ({ filters, setFilters, feeData, defaultFilters }) => {
  const academicYearOptions = [
    "2025-2026",
    "2026-2027",
    "2027-2028",
    "2028-2029",
  ];
  const semesterOptions = ["Odd", "Even"];

  const filteredByYearSem = feeData.filter(
    (item) =>
      item.academicYear === filters.academicYear &&
      item.semester === filters.semester,
  );

  const feeHeadOptions = [
    "All",
    ...new Set(filteredByYearSem.map((item) => item.feeHead)),
  ];
  return (
    <div className="w-full bg-white  rounded-xl   flex items-center justify-between">
      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-800 ">
        Payment Details / Academic Year{" "}
        <span className="text-[#0b56a4]">({filters.academicYear})</span>
      </h2>

      {/* Filters Row */}
      <div className=" flex items-center gap-4">
        {/* Fee Head */}
        <CustomSelect
          options={feeHeadOptions}
          value={filters.feeHead}
          onChange={(value) =>
            setFilters({
              ...filters,
              feeHead: value,
            })
          }
        />
        {/* Academic Year */}
        <div className="">
          <CustomSelect
            options={academicYearOptions}
            value={filters.academicYear}
            onChange={(value) =>
              setFilters({
                ...filters,
                academicYear: value,
              })
            }
          />
        </div>

        {/* Semester */}
        <div className="">
          <CustomSelect
            options={semesterOptions}
            value={filters.semester}
            onChange={(value) =>
              setFilters({
                ...filters,
                semester: value,
              })
            }
          />
        </div>

        <button
          onClick={() => setFilters(defaultFilters)}
          className="px-4 flex items-center gap-2 py-2 rounded-lg border border-gray-300 cursor-pointer text-gray-700  transition-colors"
        >
          Clear
          <ListFilter className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );
};

export default NewPaymentFilter;
