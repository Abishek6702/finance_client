import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReportsFilter from "../../components/ReportsFilter";
import ReportsStudentDetailCard from "../../components/ReportsStudentDetailCard";
import DateWiseFeeReport from "../../components/DateWiseFeeReport";
import nodata from "../../assets/nodata.svg";
import axios from "axios";

export default function Reports() {
  const location = useLocation();

  // 🔹 FIX: derive the active tab directly from location state or default to individual
  // This removes the need for useEffect and prevents cascading renders
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "individual",
  );

  // If the user clicks a tab button manually, we still want to update the local state
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [academicyear, setAcademicYear] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/studentsManagement/basic`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Raw student data:", res.data.data); // Debugging log

        setStudents(res.data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filterData = useMemo(() => {
    return students.filter((s) => {
      const searchTerm = search.toLowerCase();
      const studentName = s.name.toLowerCase();
      const studentRoll = s.rollNo.toLowerCase();

      return (
        (!search ||
          studentName.includes(searchTerm) ||
          studentRoll.includes(searchTerm)) &&
          (!year || s.currentYear === Number(year))&&
        (!department || s.department === department) &&
        (!section || s.section === section) &&
        (!academicyear || s.currentAcademicYear === academicyear)
      );
    });
  }, [students, search, year, department, section, academicyear]);

  const handleClearFilter = () => {
    setDepartment("");
    setSearch("");
    setYear("");
    setSection("");
    setAcademicYear("");
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
  
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setVisibleCount((prev) => prev + 50);
    }
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

         <div className="h-[calc(100vh-250px)] overflow-auto mt-4"m onScroll={handleScroll}>
         <div className="grid grid-cols-1   overflow-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 ">
            {filterData.length > 0 ? (
             filterData.slice(0, visibleCount).map((user) => (
                <ReportsStudentDetailCard key={user._id} user={user} />
              ))
            ) : (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-gray-400">
                <img src={nodata} alt="No data" className="w-50 " />
                <p className="text-gray-500">No results found.</p>
              </div>
            )}
          </div>
         </div>
        </>
      )}

      {activeTab === "datewise" && <DateWiseFeeReport />}
    </div>
  );
}
