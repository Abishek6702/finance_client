import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ApiRequest } from "../../utils/ApiRequest";
import FeeSearchFilter from "../../components/FeeSearchFilter";
import EmptyImage from "../../assets/StudentWithMobile.jpeg";

const Fees = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    academicYear: "2025-2026",
    year: "Year",
    dept: "Department",
  });

  // 🔹 Map year number → label
  const yearLabel = (year) => {
    const map = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };
    return map[year] || `${year} Year`;
  };

  // 🔹 Debounce search
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setStudents([]);
      return;
    }

    const delay = setTimeout(() => {
      fetchStudents(searchTerm);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // 🔹 API call
  const fetchStudents = async (query) => {
    setLoading(true);
    try {
      const res = await ApiRequest(
        `/api/studentsManagement/search?q=${query}`
      );

      if (res.success && res.data) {
        const formatted = res.data.map((student) => ({
          id: student.rollNo,
          name: student.name,
          year: yearLabel(student.currentYear),
          dept: student.department,
          img: student.profile,
        }));

        setStudents(formatted);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Apply filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesYear =
        filters.year === "Year" || student.year === filters.year;

      const matchesDept =
        filters.dept === "Department" || student.dept === filters.dept;

      return matchesYear && matchesDept;
    });
  }, [students, filters]);

  return (
    <main className="max-w-400">

      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-4">
        <nav className="flex items-center space-x-1.5 text-xl">
          <Link
            to="/admin/payment"
            className="text-black hover:text-gray-700 transition"
          >
            Fee Details
          </Link>
        </nav>

        {/* 🔹 Updated Filter */}
        <FeeSearchFilter
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredStudents={filteredStudents}
        />
      </div>

      {/* 🔹 Empty / Instruction UI */}
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        <div className="w-full bg-white border border-gray-100 rounded-2xl flex flex-col p-4 shadow-sm">

          <div className="max-w-sm mx-auto mt-20 text-center">
            <img
              src={EmptyImage}
              alt="Select student"
              className="w-52 mb-8 mx-auto opacity-80"
            />

            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {loading ? "Searching..." : "Search & Select Student to proceed"}
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed">
              {searchTerm.length > 0
                ? "Looking for matches..."
                : "Start typing a Roll Number (e.g., 23CS) to begin."}
            </p>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Fees;



// import { useState, useMemo, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// import FeeManagementTable from "../../components/FeeManagementTable";
// import FeeManagementFilters from "../../components/FeeManagementFilters";
// import nodata from "../../assets/nodata.svg";

// const Fees = () => {
//   const [feeData, setFeeData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [search, setSearch] = useState("");
//   const [year, setYear] = useState("");
//   const [years, setYears] = useState([]);
//   const [department, setDepartment] = useState("");
//   const [departments, setDepartments] = useState([]);
//   const [academicYearFilter, setAcademicYearFilter] = useState("");
//   const [academicYear, setAcadamicYear] = useState([]);
//   const [status, setStatus] = useState("");
//   const [type, setType] = useState([]);

//   const [selectedIds, setSelectedIds] = useState([]);

//   // ================= API FETCH =================
//   const fetchFees = async () => {
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/api/feedetails`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const apiData = res.data.data || [];

//       console.log("apiData",apiData);
      
//       const formattedData = apiData.map((item, index) => {
//         return {
//           id: index + 1,

//           name: item.student?.name,
//           rollNo: item.student?.rollNo,
//           profileImage: item.student?.photo,

//           department: item.student?.department,
//           year: `${item.student?.year} Year`,
//           academicYear: item.student?.currentAcademicYear,

//           totalFees: item.fee?.demand || 0,
//           concession: item.fee?.concession || 0,
//           paid: item.fee?.paid || 0,
//           overdue: item.fee?.overdue || 0,
//           status: item.fee?.status || "Unpaid",

//           ishostler: item.studentType?.hostel || false,
//           isdayscholer: !item.studentType?.hostel,
//           iscollegetransport: item.studentType?.transport || false,
//         };
//       });

//       setFeeData(formattedData);

//       // get department list from backend data
//       const uniqueYears = [
//         ...new Set(apiData.map((item) => `${item.student?.year} Year`))
//       ].filter(Boolean);
//       setYears(uniqueYears);

//       const uniqueDepartments = [
//         ...new Set(apiData.map((item) => item.student?.department)),
//       ];
//       setDepartments(uniqueDepartments);

//       const uniqueAcademicYear = [
//         ...new Set(apiData.map((item) => item.student?.currentAcademicYear))
//       ].filter(Boolean);
//       setAcadamicYear(uniqueAcademicYear);

//     } catch (error) {
//       console.error("API Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFees();
//   }, []);

//   // ================= FILTER =================
//   const filteredData = useMemo(() => {
//     return feeData.filter((s) => {
//       return (
//         (!search ||
//           s.name?.toLowerCase().includes(search.toLowerCase()) ||
//           s.rollNo?.includes(search)) &&
//         (!year || s.year === year) &&
//         (!department || s.department === department) &&
//         (!academicYearFilter || s.academicYear === academicYearFilter) &&
//         (!status || s.status?.toLowerCase() === status.toLowerCase()) &&
//         (type.length === 0 ||
//           (type.includes("Hostel") && s.ishostler) ||
//           (type.includes("Dayscholar") && s.isdayscholer) ||
//           (type.includes("Transport") && s.iscollegetransport))
//       );
//     });
//   }, [feeData, search, year, department, academicYearFilter, status, type]);

//   // ================= CLEAR FILTER =================
//   const handleClearFilters = () => {
//     setSearch("");
//     setYear("");
//     setDepartment("");
//     setStatus("");
//     setType([]);
//     setSelectedIds([]);
//     setAcademicYearFilter("");
//   };

//   // ================= EXPORT CSV =================
//   const exportCSV = () => {
//     const exportItems =
//       selectedIds.length > 0
//         ? filteredData.filter((student) => selectedIds.includes(student.id))
//         : filteredData;

//     if (!exportItems.length) {
//       toast.error("No data available to export");
//       return;
//     }

//     const headers = [
//       "Roll No",
//       "Student Name",
//       "Year",
//       "Department",
//       "Class",
//       "Total Fees",
//       "Concession",
//       "Paid",
//       "Overdue",
//       "Status",
//       "Type",
//       "Batch",
//       "Mobile",
//       "Email",
//     ];

//     const csvRows = exportItems.map((s) =>
//       [
//         s.rollNo,
//         `"${s.name}"`,
//         `"${s.year}"`,
//         s.department,
//         s.class,
//         s.totalFees,
//         s.concession,
//         s.paid,
//         s.overdue,
//         s.status,
//         s.type,
//         `"${s.batch}"`,
//         s.mobile,
//         s.email,
//       ].join(",")
//     );

//     const csvString = [headers.join(","), ...csvRows].join("\n");

//     const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");

//     const fileName =
//       selectedIds.length > 0
//         ? `Selected_Students_Fee_Report_${new Date().toLocaleDateString()}.csv`
//         : `Full_Fee_Report_${new Date().toLocaleDateString()}.csv`;

//     link.href = url;
//     link.download = fileName;

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="flex flex-col max-h-[calc(100vh-140px)]">
//       <h1 className="font-inter font-semibold text-xl mb-4">
//         Fees Management / Academic Year{" "}
//         <span className="text-[#0B56A4] font-bold">{!academicYearFilter ? "" : `(${academicYearFilter})`}</span>
//       </h1>

//       <FeeManagementFilters
//         search={search}
//         onSearchChange={setSearch}
//         year={year}
//         onYearChange={setYear}
//         yearOptions={years}
//         department={department}
//         onDepartmentChange={setDepartment}
//         departmentOptions={departments}
//         academicYear={academicYearFilter}
//         onAcademicYearChange={setAcademicYearFilter}
//         academicYearOptions={academicYear}
//         status={status}
//         onStatusChange={setStatus}
//         type={type}
//         onTypeChange={setType}
//         onExport={exportCSV}
//         onClearFilters={handleClearFilters}
//         selectedCount={selectedIds.length}
//       />

//       {loading ? (
//         <div className="flex justify-center py-20 text-gray-500">
//           Loading fee data...
//         </div>
//       ) : (
//         <FeeManagementTable
//           data={filteredData}
//           selectedIds={selectedIds}
//           setSelectedIds={setSelectedIds}
//         />
//       )}

//       {!loading && filteredData.length === 0 && (
//         <div className="py-24 flex flex-col items-center justify-center text-gray-400">
//           <img src={nodata} alt="No data" className="w-50" />
//           <p className="text-gray-500">No results found.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Fees;