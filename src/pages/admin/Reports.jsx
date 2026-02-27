// import React, { useMemo, useState } from 'react'
// import ReportsFilter from '../../components/ReportsFilter';
// import ReportsStudentDetailCard from '../../components/ReportsStudentDetailCard'
// import StudentDetails from '../../data';

// export default function Reports() {

//     const [search, setSearch] = useState("");
//     const [year, setYear] = useState("");
//     const [department, setDepartment] = useState("")
//     const [section, setSection] = useState("")
//     const [academicyear, setAcademicYear] = useState("")

//     const filterData = useMemo(()=>{
//         return StudentDetails.filter((s)=>{
//             return(
//                 (!search ||
//                     s.name.toLowerCase().includes(search.toLowerCase()) ||
//                     s.rollNo.includes(search)) &&
//                 (!year || s.year === year) &&
//                 (!department || s.department === department) &&
//                 (!section || s.section === section) &&
//                 (!academicyear || s.academicyear === academicyear)
//             )
//         })
//     }, [search, year,department,section,academicyear]);

//     const handleClearFiter=()=>{
//         setDepartment(""),
//         setSearch(""),
//         setYear(""),
//         setSection(""),
//         setAcademicYear("")
//     }

//   return (
//     <div>
//         <div>
//             <button>Individual Fees Report</button>
//             <button>Date Wise Fee Report</button>
//         </div>
//         <div>
//             <ReportsFilter
//                 search={search}
//                 onSearchChange={setSearch}
//                 year={year}
//                 onYearChange={setYear}
//                 department={department}
//                 onDepartmentChange={setDepartment}
//                 section = {section}
//                 onSectionChange = {setSection}
//                 academicYear = {academicyear}
//                 onAcademicYearChange = {setAcademicYear}
//                 onClearFilters={handleClearFiter}
//             />
//             {filterData.map(user=>(
//                 <ReportsStudentDetailCard data={filterData} user={user}/>
//             ))}
//         </div>
//     </div>
//   )
// }

import React, { useMemo, useState } from "react";
import ReportsFilter from "../../components/ReportsFilter";
import ReportsStudentDetailCard from "../../components/ReportsStudentDetailCard";
import DateWiseFeeReport from "../../components/DateWiseFeeReport";
import {StudentDetails} from "../../data";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("individual"); // 👈 NEW

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [academicyear, setAcademicYear] = useState("");

  const filterData = useMemo(() => {
    return StudentDetails.filter((s) => {
      return (
        (!search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.rollNo.includes(search)) &&
        (!year || s.year === year) &&
        (!department || s.department === department) &&
        (!section || s.section === section) &&
        (!academicyear || s.academicyear === academicyear)
      );
    });
  }, [search, year, department, section, academicyear]);

  const handleClearFilter = () => {
    setDepartment("");
    setSearch("");
    setYear("");
    setSection("");
    setAcademicYear("");
  };

  return (
    <div className=" ">
      {/* 🔹 Toggle Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setActiveTab("individual")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "individual"
              ? "bg-[#1F5AA6] text-white"
              : "bg-gray-200"
          }`}
        >
          Individual Fees Report
        </button>

        <button
          onClick={() => setActiveTab("datewise")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "datewise" ? "bg-[#1F5AA6] text-white" : "bg-gray-200"
          }`}
        >
          Date Wise Fee Report
        </button>
      </div>

      {/* 🔹 Conditional Rendering */}
      {activeTab === "individual" && (
        <>
          <ReportsFilter
            search={search}
            onSearchChange={setSearch}
            year={year}
            onYearChange={setYear}
            department={department}
            onDepartmentChange={setDepartment}
            section={section}
            onSectionChange={setSection}
            academicYear={academicyear}
            onAcademicYearChange={setAcademicYear}
            onClearFilters={handleClearFilter}
          />

          <div className="grid grid-cols-4">
            {filterData.map((user) => (
              <ReportsStudentDetailCard key={user.id} user={user} />
            ))}
          </div>
        </>
      )}

      {activeTab === "datewise" && <DateWiseFeeReport />}
    </div>
  );
}
