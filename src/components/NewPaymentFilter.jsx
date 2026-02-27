import React from "react";
import CustomSelect from "./CustomSelect";

const NewPaymentFilter = ({ filters, setFilters }) => {
    const academicYearOptions = [
        "2025-2026",
        "2026-2027",
        "2027-2028",
        "2028-2029",
      ];
      const semesterOptions = ["Odd", "Even"];

      
  return (
    <div className="w-full bg-white  rounded-xl   flex items-center justify-between">
      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-800 ">
      Payment Details / Academic Year <span className="text-[#0b56a4]">({filters.academicYear})</span>
      </h2>

      {/* Filters Row */}
      <div className=" flex items-center gap-4">
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
      </div>
    </div>
  );
};

export default NewPaymentFilter;
