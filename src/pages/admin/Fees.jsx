import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import FeeManagementTable from "../../components/FeeManagementTable";
import FeeManagementFilters from "../../components/FeeManagementFilters";
import nodata from "../../assets/nodata.svg";

const Fees = () => {
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [status, setStatus] = useState("");
  const [type, setType] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);

  // ================= API FETCH =================
  const fetchFees = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/feedetails`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apiData = res.data.data || [];

      const formattedData = apiData.map((item, index) => {
        return {
          id: index + 1,

          name: item.student?.name,
          rollNo: item.student?.rollNo,
          profileImage: item.student?.photo,

          department: item.student?.department,
          year: `${item.student?.year} Year`,

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
      const uniqueDepartments = [
        ...new Set(apiData.map((item) => item.student?.department)),
      ];

      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return feeData.filter((s) => {
      return (
        (!search ||
          s.name?.toLowerCase().includes(search.toLowerCase()) ||
          s.rollNo?.includes(search)) &&
        (!year || s.year === year) &&
        (!department || s.department === department) &&
        (!status || s.status === status) &&
        (type.length === 0 ||
          (type.includes("Hostel") && s.ishostler) ||
          (type.includes("Dayscholar") && s.isdayscholer) ||
          (type.includes("Transport") && s.iscollegetransport))
      );
    });
  }, [feeData, search, year, department, status, type]);

  // ================= CLEAR FILTER =================
  const handleClearFilters = () => {
    setSearch("");
    setYear("");
    setDepartment("");
    setStatus("");
    setType([]);
    setSelectedIds([]);
  };

  // ================= EXPORT CSV =================
  const exportCSV = () => {
    const exportItems =
      selectedIds.length > 0
        ? filteredData.filter((student) => selectedIds.includes(student.id))
        : filteredData;

    if (!exportItems.length) {
      toast.error("No data available to export");
      return;
    }

    const headers = [
      "Roll No",
      "Student Name",
      "Year",
      "Department",
      "Class",
      "Total Fees",
      "Concession",
      "Paid",
      "Overdue",
      "Status",
      "Type",
      "Batch",
      "Mobile",
      "Email",
    ];

    const csvRows = exportItems.map((s) =>
      [
        s.rollNo,
        `"${s.name}"`,
        `"${s.year}"`,
        s.department,
        s.class,
        s.totalFees,
        s.concession,
        s.paid,
        s.overdue,
        s.status,
        s.type,
        `"${s.batch}"`,
        s.mobile,
        s.email,
      ].join(",")
    );

    const csvString = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const fileName =
      selectedIds.length > 0
        ? `Selected_Students_Fee_Report_${new Date().toLocaleDateString()}.csv`
        : `Full_Fee_Report_${new Date().toLocaleDateString()}.csv`;

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col max-h-[calc(100vh-140px)]">
      <h1 className="font-inter font-semibold text-xl mb-4">
        Fees Management / Academic Year{" "}
        <span className="text-[#0B56A4] font-bold">(2025 - 2026)</span>
      </h1>

      <FeeManagementFilters
        search={search}
        onSearchChange={setSearch}
        year={year}
        onYearChange={setYear}
        department={department}
        onDepartmentChange={setDepartment}
        departmentOptions={departments}
        status={status}
        onStatusChange={setStatus}
        type={type}
        onTypeChange={setType}
        onExport={exportCSV}
        onClearFilters={handleClearFilters}
        selectedCount={selectedIds.length}
      />

      {loading ? (
        <div className="flex justify-center py-20 text-gray-500">
          Loading fee data...
        </div>
      ) : (
        <FeeManagementTable
          data={filteredData}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      )}

      {!loading && filteredData.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-gray-400">
          <img src={nodata} alt="No data" className="w-50" />
          <p className="text-gray-500">No results found.</p>
        </div>
      )}
    </div>
  );
};

export default Fees;