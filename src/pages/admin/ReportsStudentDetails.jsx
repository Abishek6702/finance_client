import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import ReportsDetailsFilter from "../../components/ReportsDetailsFilter";
import CustomSelect from "../../components/CustomSelect"; // Import your CustomSelect
import { ChevronRight, Download } from "lucide-react";
import nodata from "../../assets/nodata.svg";
import axios from "axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [academicYear, setAcademicYear] = useState(
    student?.academicyear || "2025-2026",
  );

  useEffect(() => {
    const fetchStudentReport = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/reports/individual?rollNo=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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
          matchesDate =
            fee.paymentDate >= dateRange.start &&
            fee.paymentDate <= dateRange.end;
        } else {
          matchesDate = fee.paymentDate === dateRange.start;
        }
      }

      return (
        (!search ||
          fee.receiptNo.toLowerCase().includes(search.toLowerCase())) &&
        (!sem || fee.sem === sem) &&
        (!feesHead || fee.feeHead === feesHead) &&
        (!paymentMode || fee.paymentMode === paymentMode) &&
        (!academicYear ||
          fee.paidForAcademicYear === academicYear ||
          fee.currentAcademicYear === academicYear) &&
        matchesDate
      );
    });
  }, [student, search, sem, feesHead, paymentMode, dateRange, academicYear]);

  const handleRowSelect = (receiptNo) => {
    setSelectedRows((prev) =>
      prev.includes(receiptNo)
        ? prev.filter((id) => id !== receiptNo)
        : [...prev, receiptNo],
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
    if (!filteredFees.length) {
      alert("No data to export");
      return;
    }

    const dataToExport =
      selectedRows.length > 0
        ? filteredFees.filter((fee) => selectedRows.includes(fee.receiptNo))
        : filteredFees;

    // ✅ Student Header (Top Section)
    const studentInfo = [
      ["Student Name", student.studentName || student.name],
      ["Roll No", student.rollNo],
      ["Department", student.departmentName || student.department],
      ["Year", student.yearStudying || student.year],
      ["Section", student.section],
      [], // empty row
    ];

    // ✅ Table Data
    const tableData = dataToExport.map((fee) => ({
      "Receipt No": fee.receiptNo,
      "Fee Head": fee.feeHead,
      "Sub Head": fee.subHead,
      Demand: fee.demand,
      Concession: fee.concession,
      Paid: fee.paid,
      Balance: fee.balance,
      "Payment Date": normalizeDate(fee.paymentDate),
      "Payment Mode": fee.paymentMode,
    }));

    // Convert table
    const worksheet = XLSX.utils.json_to_sheet(tableData, { origin: "A7" });

    // Add student info manually at top
    XLSX.utils.sheet_add_aoa(worksheet, studentInfo, { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fees Report");

    XLSX.writeFile(workbook, `${student.rollNo}_Fees_Report.xlsx`);
  };

  const handlePdfExport = () => {
    if (!filteredFees.length) {
      alert("No data to export");
      return;
    }

    const dataToExport =
      selectedRows.length > 0
        ? filteredFees.filter((fee) => selectedRows.includes(fee.receiptNo))
        : filteredFees;

    const doc = new jsPDF();

    // ✅ Title
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Student Fee Report", 14, 15);

    // ✅ Student Info (Top Section)
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    console.log("Student data for PDF export:", student);
    const studentDetails = [
      ["Name", student.studentName || student.name],
      ["Roll No", student.rollNo],
      [
        "Class",
        `${student.yearStudying} ${student.departmentName} ${student.section}`,
      ],
    ];

    let startY = 22;

    studentDetails.forEach(([label, value], index) => {
      doc.text(`${label} : ${value}`, 14, startY + index * 6);
    });

    // ✅ Table Data
    const tableColumn = [
      "Receipt No",
      "Fee Head",
      "Sub Head",
      "Demand",
      "Concession",
      "Paid",
      "Balance",
      "Payment Date",
      "Payment Mode",
    ];

    const tableRows = dataToExport.map((fee) => [
      fee.receiptNo,
      fee.feeHead,
      fee.subHead,
      fee.demand,
      fee.concession,
      fee.paid,
      fee.balance,
      new Date(fee.paymentDate).toLocaleDateString("en-GB"),
      fee.paymentMode,
    ]);

    // ✅ Calculate Total (Paid or Demand — your choice)
    const totalAmount = dataToExport.reduce(
      (sum, fee) => sum + (fee.paid || 0),
      0,
    );

    // ✅ Table
    autoTable(doc, {
      startY: startY + studentDetails.length * 6 + 4,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
    });

    let finalY = doc.lastAutoTable.finalY || 40;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    // ✅ If no space → new page
    if (finalY + 20 > pageHeight) {
      doc.addPage();
      finalY = 20;
    }

    // ✅ Background bar (full width inside margin)
    doc.setFillColor(240, 240, 240);
    doc.rect(10, finalY + 5, pageWidth - 20, 10, "F");

    // ✅ Text (CENTER aligned)
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setCharSpace(0); // fix weird spacing

    doc.text(
      `Total Paid :  ${totalAmount.toLocaleString()}`,
      pageWidth / 2, // ✅ center horizontally
      finalY + 12,
      { align: "center" }, // ✅ center alignment
    );

    // ✅ Save
    doc.save(`${student.rollNo}_Fee_Report.pdf`);
  };
  const handleSingleExport = (fee) => {
    window.open(`/receipt/${fee.receiptNo}`, "_blank");
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
          onClick={() =>
            navigate("/admin/reports", { state: { activeTab: "individual" } })
          }
          className="px-5 py-2.5 rounded-lg font-medium bg-[#1F5AA6] text-white shadow-md cursor-pointer transition-all"
        >
          Individual Fees Report
        </button>

        <button
          onClick={() =>
            navigate("/admin/reports", { state: { activeTab: "datewise" } })
          }
          className="px-5 py-2.5 rounded-lg font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer transition-all"
        >
          Date Wise Fee Report
        </button>
      </div>

      {/* 🔹 Breadcrumb + Academic Year Filter Row */}
      <div className="flex items-center justify-between mb-2">
        <nav className="flex items-center space-x-1.5 text-xl">
          <Link
            to="/admin/reports"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Fees Details
          </Link>
          <ChevronRight size={20} className="text-gray-400" />
          <span className="text-[#0b56a4] font-semibold">
            {student.studentName} ({student.rollNo})
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
        onPdfExport={handlePdfExport}
      />

      {/* 🔹 Fees Table */}
      <div className="bg-white rounded-xl border border-[#D9D9D9] h-[calc(100vh-300px)] overflow-auto">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="cursor-pointer"
                />
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
