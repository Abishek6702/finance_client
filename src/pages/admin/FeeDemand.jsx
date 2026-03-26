import React, { useEffect, useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FeeDemandFilters from "../../components/FeeDemandFilters.jsx";
import axios from "axios";
import FeeDemandTable from "../../components/FeeDemandTable.jsx";
import nodata from "../../assets/nodata.svg";
import FeeDemandDrawer from "../../components/FeeDemandDrawer.jsx";
import * as XLSX from "xlsx";

function getAcademicYear() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // January = 0

  if (month >= 6) {
    // June or later
    return `${year}-${year + 1}`;
  } else {
    // Before June
    return `${year - 1}-${year}`;
  }
}

const FeeDemand = () => {
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [years, setYears] = useState([]);
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [academicYearFilter, setAcademicYearFilter] =
    useState(getAcademicYear());
  const [academicYear, setAcadamicYear] = useState([]);
  const [status, setStatus] = useState("");
  const [type, setType] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // typing

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);
  const [selectedIds, setSelectedIds] = useState([]);

  // ================= API FETCH =================
  const fetchFees = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const params = {
        academicYear: academicYearFilter || undefined,
        department: department || undefined,
        studyingYear: year ? year.replace(" Year", "").trim() : undefined,
        rollNo: search || undefined,
      };

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/feedemands`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: params,
        },
      );

      const apiData = res.data.data || [];

      console.log("feedemand data response", apiData);

      const formattedData = apiData.map((item, index) => {
        return {
          id: index + 1,

          name: item.student?.name,
          rollNo: item.student?.rollNo,
          profileImage: item.student?.photo,

          department: item.student?.department,
          year: `${item.student?.year} Year`,
          academicYear: item.student?.currentAcademicYear,
          section: item.student?.section || "A",

          totalFees: item.fee?.demand || 0,
          concession: item.fee?.concession || 0,
          paid: item.fee?.paid || 0,
          overdue: item.fee?.overdue || 0,
          status: item.fee?.status || "Unpaid",

          ishostler: item.studentType?.hostel || false,
          isdayscholer: !item.studentType?.hostel,
          iscollegetransport: item.studentType?.transport || false,
        };
      });

      setFeeData(formattedData);

      // get department list from backend data
      const uniqueYears = [
        ...new Set(apiData.map((item) => `${item.student?.year} Year`)),
      ].filter(Boolean);
      setYears(uniqueYears);

      const uniqueDepartments = [
        ...new Set(apiData.map((item) => item.student?.department)),
      ];
      setDepartments(uniqueDepartments);

      const uniqueAcademicYear = [
        ...new Set(apiData.map((item) => item.student?.currentAcademicYear)),
      ].filter(Boolean);
      setAcadamicYear(uniqueAcademicYear);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [search, year, department, academicYearFilter]);

  useEffect(() => {
    setVisibleCount(15);
  }, [search, year, department, academicYearFilter, type]);

  const filteredData = useMemo(() => {
    return feeData.filter((s) => {
      return (
        (!status || s.status?.toLowerCase() === status.toLowerCase()) &&
        (type.length === 0 ||
          (type.includes("Hostel") && s.ishostler) ||
          (type.includes("Dayscholar") && s.isdayscholer) ||
          (type.includes("Transport") && s.iscollegetransport))
      );
    });
  }, [feeData, status, type]);

  // ================= CLEAR FILTER =================
  const handleClearFilters = () => {
    setSearch("");
    setSearchInput("");
    setYear("");
    setDepartment("");
    setStatus("");
    setType([]);
    setSelectedIds([]);
    setAcademicYearFilter(getAcademicYear()); 
  };

  // ================= EXPORT CSV =================
  const getStudentType = (s) => {
    if (s.ishostler) return "Hostel";
    if (s.iscollegetransport) return "Transport";
    if (s.isdayscholer) return "Dayscholar";
    return "Home"; // ✅ both false
  };
  const exportExcel = () => {
    const exportItems =
      selectedIds.length > 0
        ? filteredData.filter((student) => selectedIds.includes(student.id))
        : filteredData;

    if (!exportItems.length) {
      toast.error("No data available to export");
      return;
    }

    const data = exportItems.map((s) => ({
      "Roll No": s.rollNo,
      "Student Name": s.name,
      Year: s.year,
      Department: s.department,
      Section: s.section,
      Type: getStudentType(s),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Fees");

    XLSX.writeFile(workbook, "Fee_Report.xlsx");
  };

  const exportPDF = () => {
    const exportItems =
      selectedIds.length > 0
        ? filteredData.filter((student) => selectedIds.includes(student.id))
        : filteredData;

    if (!exportItems.length) {
      toast.error("No data available to export");
      return;
    }

    const doc = new jsPDF();

    const tableColumn = [
      "Roll No",
      "Name",
      "Year",
      "Department",
      "Section",
      "Type",
    ];

    const tableRows = exportItems.map((s) => [
      s.rollNo,
      s.name,
      s.year,
      s.department,
      s.section,
      getStudentType(s),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("Fee_Report.pdf");
  };
  const handleExport = (type) => {
    if (type === "excel") exportExcel();
    if (type === "pdf") exportPDF();
  };

  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const loadMore = () => {
    if (visibleCount >= filteredData.length) return; // ✅ STOP
  
    setVisibleCount((prev) => prev + 15);
  };
  return (
    <div className=" h-[calc(100vh-120px)]">
      <div className="header  mb-4">
        <h1 className="font-inter font-semibold text-xl">
          Manage fee demand /
          <span className="text-[#0B56A4] font-bold">
            {" "}
            {academicYearFilter}
          </span>
        </h1>
        <div className="filter mt-4 ">
          <FeeDemandFilters
            search={searchInput}
            onSearchChange={setSearchInput}
            year={year}
            onYearChange={setYear}
            yearOptions={years}
            department={department}
            onDepartmentChange={setDepartment}
            departmentOptions={departments}
            academicYear={academicYearFilter}
            onAcademicYearChange={setAcademicYearFilter}
            academicYearOptions={academicYear}
            status={status}
            onStatusChange={setStatus}
            type={type}
            onTypeChange={setType}
            onExport={handleExport}
            onClearFilters={handleClearFilters}
            selectedCount={selectedIds.length}
            onSearchEnter={() => setSearch(searchInput)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-500">
            Loading fee data...
          </div>
        ) : (
          <FeeDemandTable
          data={filteredData.slice(0, visibleCount)}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onRowClick={handleRowClick}
            onloadMore={loadMore}
          />
        )}

        {!loading && filteredData.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <img src={nodata} alt="No data" className="w-50" />
            <p className="text-gray-500">No results found.</p>
          </div>
        )}

        {isDrawerOpen && selectedStudent && (
          <FeeDemandDrawer
            student={selectedStudent}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default FeeDemand;
