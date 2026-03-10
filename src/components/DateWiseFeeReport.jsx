import React, { useState, useMemo, useEffect, use } from "react";
import { StudentDetails } from "../data";
import ReportsDateWiseFilter from "./ReportsDateWiseFilter";
import * as XLSX from "xlsx";
import nodata from "../assets/nodata.svg";

export default function DateWiseFeeReport() {
  const today = new Date().toISOString().split("T")[0];

  const [dateRange, setDateRange] = useState({
    start: today,
    end: today,
  });

  const [academicYear, setAcademicYear] = useState("");

  // // 🔹 Prepare All Transactions
  // const allTransactions = useMemo(() => {
  //   return StudentDetails.flatMap((student) =>
  //     student.fees.map((fee, index) => ({
  //       uniqueId: `${student.id}-${fee.receiptNo}-${index}`,
  //       name: student.name,
  //       year: student.year,
  //       department: student.department,
  //       rollNo: student.rollNo,
  //       sem: fee.sem,
  //       feeHead: fee.feesHead,
  //       amount: fee.demand,
  //       date: fee.paymentDate,
  //       paymentMode: fee.paymentMode,
  //       bank: fee.bank,
  //       receiptNo: fee.receiptNo,
  //       profileImage: student.profileImage,

  //       // ✅ Used for filtering only
  //       academicYear: student.academicyear,
  //     }))
  //   );
  // }, []);

  const [allTransactions, setAllTransactions] = useState([]);
  // use api to fetch data from backend and set it to allTransactions state
  const token = localStorage.getItem("token");
  // 🔹 Fetch Transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/reports/datewise?fromDate=${dateRange.start}&toDate=${dateRange.end}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = await response.json();
        // console.log("API Response date wise :", data.data.rows);
  
        if (data.success) {
          setAllTransactions(data.data.rows);
        } else {
          setAllTransactions([]);
        }
  
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setAllTransactions([]);
      }
    };
  
    if (dateRange.start && dateRange.end) {
      fetchTransactions();
    }
  }, [dateRange, token]);

  // console.log("All Transactions:", allTransactions.rows);

  // 🔹 Filtering Logic

  console.log("original Data:", allTransactions);

  const filteredData = useMemo(() => {
    if (!Array.isArray(allTransactions)) return [];
  
    return allTransactions.filter((item) => {
      const itemDate = new Date(item.date).toISOString().split("T")[0];
  
      const matchesStart =
        !dateRange.start || itemDate >= dateRange.start;
  
      const matchesEnd =
        !dateRange.end || itemDate <= dateRange.end;
  
      return matchesStart && matchesEnd;
    });
  }, [allTransactions, dateRange]);

  // 🔹 Export Function
  const handleExport = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }
  
    const exportData = filteredData.map((item) => ({
      "Roll No": item.rollNo,
      "Student Name": item.student?.studentName,
      "Year": item.student?.year,
      "Section": item.student?.section,
      "Department": item.student?.department,
      "Sem Period": item.paymentSemester,
      "Fee Head": item.feeHead,
      "Sub Head": item.subHead,
      "Amount": item.amount,
      "Date": new Date(item.date).toLocaleDateString("en-GB"),
      "Payment Mode": item.paymentMode,
      "Bank": item.bank,
      "Receipt No": item.receiptNo,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DateWise_Report");
  
    const fileName = `Fee_Report_${dateRange.start || "All"}_${dateRange.end || ""}.xlsx`;
  
    XLSX.writeFile(workbook, fileName);
  };
  console.log("Filtered Data:", filteredData);
  function normalizeDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
  }
  return (
    <div className="mt-4">
      <ReportsDateWiseFilter
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        year={academicYear}
        onYearChange={setAcademicYear}
        onExport={handleExport}
        onClearFilters={() => {
          setDateRange({ start: "", end: "" });
          setAcademicYear("");
        }}
      />

      <div className="bg-white rounded-xl border border-gray-300 h-[calc(100vh-35vh)] overflow-auto shadow-sm">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[7%]" />
            <col className="w-[12%]" />
          </colgroup>

          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-4 font-semibold text-center">Student Details</th>
              <th className="font-semibold text-center">Roll Number</th>
              <th className="font-semibold text-center">Sem Period</th>
              <th className="font-semibold text-center">Fee Head</th>
              <th className="font-semibold text-center">Amount</th>
              <th className="font-semibold text-center">Date</th>
              <th className="font-semibold text-center">Payment Mode</th>
              <th className="font-semibold text-center">Bank</th>
              <th className="font-semibold text-center">Receipt Number</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.uniqueId}>
                  <td className="pl-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.student.studentPhoto  || "/default-avatar.png"}
                        alt={item.student.studentName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p>{item.student.studentName}</p>
                        <p className="text-gray-500">
                          {item.student.year} year / {item.student.department} - {item.student.section}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="text-center">{item.rollNo}</td>
                  <td className="text-center">{item.paymentSemester} Sem</td>
                  <td className="text-center">{item.feeHead}</td>
                  <td className="text-center">₹{item.amount}</td>
                  <td className="text-center">{normalizeDate(item.date)}</td>
                  <td className="text-center">{item.paymentMode}</td>
                  <td className="text-center">{item.bank || "N/A"}</td>
                  <td className="text-center">{item.receiptNo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-20 text-gray-400">
                  <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                    <img src={nodata} alt="No data" className="w-50 " />
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
