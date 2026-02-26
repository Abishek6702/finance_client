import React, { useMemo, useState } from "react"; 
import { useLocation } from "react-router-dom"; 
import ReportsFilter from "../../components/ReportsFilter";
import ReportsStudentDetailCard from "../../components/ReportsStudentDetailCard";
import DateWiseFeeReport from "../../components/DateWiseFeeReport";
import StudentDetails from "../../data";

export default function Reports() {
  const location = useLocation();

  // 🔹 FIX: derive the active tab directly from location state or default to individual
  // This removes the need for useEffect and prevents cascading renders
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "individual");

  // If the user clicks a tab button manually, we still want to update the local state
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [academicyear, setAcademicYear] = useState("");

  const filterData = useMemo(() => {
    return StudentDetails.filter((s) => {
      const searchTerm = search.toLowerCase();
      const studentName = s.name.toLowerCase();
      const studentRoll = s.rollNo.toLowerCase();

      return (
        (!search ||
          studentName.includes(searchTerm) ||
          studentRoll.includes(searchTerm)) &&
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
    <div className="p-1">
      {/* 🔹 Toggle Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleTabChange("individual")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
            activeTab === "individual"
              ? "bg-[#1F5AA6] text-white shadow-md"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Individual Fees Report
        </button>

        <button
          onClick={() => handleTabChange("datewise")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
            activeTab === "datewise" 
              ? "bg-[#1F5AA6] text-white shadow-md" 
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Date Wise Fee Report
        </button>
      </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {filterData.length > 0 ? (
              filterData.map((user) => (
                <ReportsStudentDetailCard key={user.id} user={user} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                No students found matching the criteria.
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "datewise" && <DateWiseFeeReport />}
    </div>
  );
}