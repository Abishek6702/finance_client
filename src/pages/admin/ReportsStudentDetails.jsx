import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import ReportsDetailsFilter from "../../components/ReportsDetailsFilter";
import DateWiseFeeReport from "../../components/DateWiseFeeReport";
import { ChevronRight, Download } from 'lucide-react';

export default function ReportsStudentDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Retrieve student data from navigation state
  const student = state?.user;

  // Local states for filtering student-specific fees
  const [search, setSearch] = useState("");
  const [sem, setSem] = useState("");
  const [feesHead, setFeesHead] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filter Logic for the table
  const filteredFees = useMemo(() => {
    if (!student?.fees) return [];

    return student.fees.filter((fee) => {
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
        (!feesHead || fee.feesHead === feesHead) &&
        (!paymentMode || fee.paymentMode === paymentMode) &&
        matchesDate
      );
    });
  }, [student, search, sem, feesHead, paymentMode, dateRange]);

  // Selection Handlers
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

  // Export Logic
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
        <p className="text-gray-500 mb-4">No student data found.</p>
        <button onClick={() => navigate("/admin/reports")} className="text-[#1F5AA6] font-medium underline">
          Back to Reports
        </button>
      </div>
    );
  }

  return (
    <div className="p-1">
      {/* 🔹 Navigation Tabs - Now redirects to main page with specific Tab state */}
      <div className="flex gap-3 mb-6">
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

      {/* 🔹 Breadcrumb */}
      <nav className="flex items-center space-x-1.5 text-xl mb-4">
        <Link to="/admin/reports" className="">
          Fees Details
        </Link>
        <ChevronRight size={20} className="text-gray-400" />
        <span className="text-[#0b56a4] font-semibold">{student.name} ({student.rollNo})</span>
      </nav>

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
              <div className="bg-white rounded-xl border border-[#D9D9D9]">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
              </th>
              <th>Receipt No</th>
              <th>Fees Head</th>
              <th>Sub Head</th>
              <th>Demand</th>
              <th>Concession</th>
              <th>Paid</th>
              <th>Fine</th>
              <th>Balance</th>
              <th>Payment Date</th>
              <th className="text-center">Payment Mode</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredFees.length > 0 ? (
              filteredFees.map((fee) => (
                <tr key={fee.receiptNo}>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(fee.receiptNo)}
                      onChange={() => handleRowSelect(fee.receiptNo)}
                    />
                  </td>
                  <td>{fee.receiptNo}</td>
                  <td>{fee.feesHead}</td>
                  <td>{fee.subHead}</td>
                  <td>₹{fee.demand}</td>
                  <td>₹{fee.concession}</td>
                  <td className="text-green-600 font-medium">₹{fee.paid}</td>
                  <td>{fee.fine}</td>
                  <td className="text-red-500 font-medium">{fee.balance}</td>
                  <td>{fee.paymentDate}</td>
                  <td className="text-center">{fee.paymentMode}</td>
                  <td>
                    <button
                      onClick={() => handleSingleExport(fee)}
                      className="bg-[#0B56A4] text-white p-2 rounded-3xl text-sm cursor-pointer"
                    >
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center p-6 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}