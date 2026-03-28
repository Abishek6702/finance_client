import React from "react";
import CustomSelect from "./CustomSelect";
import {ListFilter} from "lucide-react";

const ClassWiseFeeReportFilter = ({
  filters,
  setFilters,
  onClearFilters
}) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex items-center gap-4">
      <CustomSelect
        placeholder="Academic year"
        value={filters.academicYear}
        onChange={(val) => handleChange("academicYear", val)}
        options={[
          "2018-2019","2019-2020","2020-2021","2021-2022",
          "2022-2023","2023-2024","2024-2025","2025-2026"
        ]}
        className="w-55"
      />

      <CustomSelect
        placeholder="Department"
        value={filters.department}
        onChange={(val) => handleChange("department", val)}
        options={["AIDS","AIML","CSE","CCE","ECE","EEE","IT","MECH","CYS"]}
        className="w-45"
      />

      <CustomSelect
        placeholder="Year"
        value={filters.year}
        onChange={(val) => handleChange("year", val)}
        options={["1st Year","2nd Year","3rd Year","4th Year"]}
        className="w-32"
      />

      <CustomSelect
        placeholder="Section"
        value={filters.section}
        onChange={(val) => handleChange("section", val)}
        options={["A","B","C"]}
        className="w-32"
      />

      <CustomSelect
        placeholder="Status"
        value={filters.status}
        onChange={(val) => handleChange("status", val)}
        options={["paid","unpaid"]}
        className="w-32"
      />
      <button
          onClick={onClearFilters}
          className="px-4 h-[42px] flex items-center gap-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
        >
          <span className="text-sm font-medium">Clear</span>
          <ListFilter size={16} />
        </button>
    </div>
  );
};

export default ClassWiseFeeReportFilter;