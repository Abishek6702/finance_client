import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import ReportsDetailsFilter from "../../components/ReportsDetailsFilter";
import CustomSelect from "../../components/CustomSelect"; // Import your CustomSelect
import { ChevronRight, Download } from 'lucide-react';
import nodata from '../../assets/nodata.svg'
import axios from "axios";

export default function ReportsStudentDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [search, setSearch] = useState("");
  const [sem, setSem] = useState("");
  const [feesHead, setFeesHead] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [student, setStudent] = useState(null);
const [fees, setFees] = useState([]);
const token = localStorage.getItem("token");
  console.log("Roll No from URL:", id);
  // New State for Academic Year Filter
  const [academicYear, setAcademicYear] = useState(student?.academicyear || "2025-2026");

  useEffect(() => {
    const fetchStudentReport = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/reports/individual?rollNo=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = res.data.data;
        console.log("Fetched individual report data:", res.data.data);
  
        setStudent(data.student);
        setFees(data.rows);
  
      } catch (error) {
        console.error("Error fetching individual report:", error);
      }
    };
  
    fetchStudentReport();
  }, [id]);

  const filteredFees = useMemo(() => {
    if (!fees) return [];

    return fees.filter((fee) => {
      let matchesDate = true;
      if (dateRange.start) {
        if (dateRange.end) {
          matchesDate = fee.paymentDate >= dateRange.start && fee.paymentDate <= dateRange.end;
        } else {
          matchesDate = fee.paymentDate === dateRange.start;
        }
      }

      return (
        (!search || fee.receiptNo.toLowerCase().includes(search.toLowerCase())) &&
        (!sem || fee.sem === sem) &&
        (!feesHead || fee.feeHead === feesHead) &&
        (!paymentMode || fee.paymentMode === paymentMode) &&
        matchesDate
      );
    });
  }, [student, search, sem, feesHead, paymentMode, dateRange]);

  const handleRowSelect = (receiptNo) => {
    setSelectedRows((prev) =>
      prev.includes(receiptNo) ? prev.filter((id) => id !== receiptNo) : [...prev, receiptNo]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredFees.map((fee) => fee.receiptNo));
    }
    setSelectAll(!selectAll);
  };

  const handleExport = () => {
    const dataToExport = filteredFees.filter((fee) => selectedRows.includes(fee.receiptNo));
    if (dataToExport.length === 0) return alert("Please select at least one row");

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fees Report");
    XLSX.writeFile(workbook, `${student.name}_Fees_Report.xlsx`);
  };

  const handleSingleExport = (fee) => {
    const worksheet = XLSX.utils.json_to_sheet([fee]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipt");
    XLSX.writeFile(workbook, `Receipt_${fee.receiptNo}.xlsx`);
  };

  if (!student) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500 mb-4">Loading...</p>
       
      </div>
    );
  }

  function normalizeDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
  }

  return (
    <div className="p-1">
      {/* 🔹 Navigation Tabs */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => navigate("/admin/reports", { state: { activeTab: "individual" } })}
          className="px-5 py-2.5 rounded-lg font-medium bg-[#1F5AA6] text-white shadow-md cursor-pointer transition-all"
        >
          Individual Fees Report
        </button>

        <button
          onClick={() => navigate("/admin/reports", { state: { activeTab: "datewise" } })}
          className="px-5 py-2.5 rounded-lg font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer transition-all"
        >
          Date Wise Fee Report
        </button>
      </div>

      {/* 🔹 Breadcrumb + Academic Year Filter Row */}
      <div className="flex items-center justify-between mb-2">
        <nav className="flex items-center space-x-1.5 text-xl">
          <Link to="/admin/reports" className="text-gray-600 hover:text-gray-800 transition-colors">
            Fees Details
          </Link>
          <ChevronRight size={20} className="text-gray-400" />
          <span className="text-[#0b56a4] font-semibold">
            {student.name} ({student.rollNo})
          </span>
        </nav>

        {/* 🔹 Academic Year Filter Aligned to the Right */}
        <CustomSelect
          placeholder="Academic Year"
          value={academicYear}
          onChange={setAcademicYear}
          options={["2024-2025", "2025-2026", "2026-2027"]}
          className="w-48"
        />
      </div>

      <ReportsDetailsFilter
        search={search}
        onSearchChange={setSearch}
        sem={sem}
        onSemChange={setSem}
        feesHead={feesHead}
        onFeesHeadChange={setFeesHead}
        paymentMode={paymentMode}
        onPaymentModeChange={setPaymentMode}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedRows={selectedRows}
        onClearFilters={() => {
          setSearch("");
          setSem("");
          setFeesHead("");
          setPaymentMode("");
          setDateRange({ start: "", end: "" });
        }}
        onExport={handleExport}
      />

      {/* 🔹 Fees Table */}
      <div className="bg-white rounded-xl border border-[#D9D9D9] overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="cursor-pointer" />
              </th>
              <th className="py-4 px-2">Receipt No</th>
              <th>Fees Head</th>
              <th>Sub Head</th>
              <th>Demand</th>
              <th>Concession</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Payment Date</th>
              <th className="text-center">Payment Mode</th>
              <th></th>
            </tr>
          </thead>

          <tbody className="">
            {filteredFees.length > 0 ? (
              filteredFees.map((fee) => (
                <tr key={fee.receiptNo} className="">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(fee.receiptNo)}
                      onChange={() => handleRowSelect(fee.receiptNo)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-2 ">{fee.receiptNo}</td>
                  <td>{fee.feeHead}</td>
                  <td>{fee.subHead}</td>
                  <td>₹{fee.demand}</td>
                  <td>₹{fee.concession}</td>
                  <td className="">₹{fee.paid}</td>
                  <td className="text-red-500 ">₹{fee.balance}</td>
                  <td>{normalizeDate(fee.paymentDate)}</td>
                  <td className="text-center">
                    <span className="">{fee.paymentMode}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleSingleExport(fee)}
                      className="bg-[#0B56A4] mr-4 text-white p-2 rounded-full hover:bg-[#084482] transition-colors cursor-pointer"
                    >
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                  <td colSpan="12">
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                      <img src={nodata} alt="No data" className="w-40 mb-4" />
                      <p className="text-gray-500">No results found.</p>
                    </div>
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}