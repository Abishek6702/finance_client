import React from "react";
import CustomSelect from "./CustomSelect";

const ClassWiseFeeReportFilter = () => {
  return (
    <>
      <div className=" flex items-center gap-4">
        <CustomSelect
          placeholder="Academic year"
          value={"academicyear"}
          onChange={"onAcademicYearChange"}
          options={[
            "2018-2019",
            "2019-2020",
            "2020-2021",
            "2021-2022",
            "2022-2023",
            "2023-2024",
            "2024-2025",
            "2025-2026",
          ]}
          className="w-55 inter"
        />
        <CustomSelect
          placeholder="Department"
          value={"department"}
          onChange={"onDepartmentChange"}
          options={[
            "AIDS",
            "AIML",
            "CSE",
            "CCE",
            "ECE",
            "EEE",
            "IT",
            "MECH",
            "CYS",
          ]}
          className="w-45"
        />
        <CustomSelect
          placeholder="Year"
          value={"year"}
          onChange={"onYearChange"}
          options={["1", "2", "3", "4"]}
          className="w-32"
        />
        <CustomSelect
          placeholder="Semester"
          value={"semester"}
          onChange={"onSemesterChange"}
          options={["Odd", "Even"]}
          className="w-32"
        />
        <CustomSelect
          placeholder="Section"
          value={"section"}
          onChange={"onSectionChange"}
          options={[
            "CCE",
            "AIDS-A",
            "AIDS-B",
            "AIDS-C",
            "AIML",
            "CSE-A",
            "CSE-B",
            "CSE-C",
            "CSBE",
            "ECE-A",
            "ECE-B",
            "ECE-C",
            "EEE",
            "MECH",
          ]}
          className="w-52"
        />
        
        <CustomSelect
          placeholder="Status"
          value={"status"}
          onChange={"onStatusChange"}
          options={["Paid", "Unpaid"]}
          className="w-32"
        />
      </div>
    </>
  );
};

export default ClassWiseFeeReportFilter;
