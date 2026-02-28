import React, { useState, useMemo } from "react";
import {StudentDetails} from "../data";
import ReportsDateWiseFilter from "./ReportsDateWiseFilter";
import * as XLSX from "xlsx";

export default function DateWiseFeeReport() {
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const [academicYear, setAcademicYear] = useState("");

  // 🔹 Prepare All Transactions
  const allTransactions = useMemo(() => {
    return StudentDetails.flatMap((student) =>
      student.fees.map((fee, index) => ({
        uniqueId: `${student.id}-${fee.receiptNo}-${index}`,
        name: student.name,
        year: student.year,
        department: student.department,
        rollNo: student.rollNo,
        sem: fee.sem,
        feeHead: fee.feesHead,
        amount: fee.demand,
        date: fee.paymentDate,
        paymentMode: fee.paymentMode,
        bank: fee.bank,
        receiptNo: fee.receiptNo,
        profileImage: student.profileImage,

        // ✅ Used for filtering only
        academicYear: student.academicyear,
      }))
    );
  }, []);

  // 🔹 Filtering Logic
  const filteredData = useMemo(() => {
    return allTransactions.filter((item) => {
      const itemDate = new Date(item.date);

      const matchesStart =
        !dateRange.start || itemDate >= new Date(dateRange.start);

      const matchesEnd =
        !dateRange.end || itemDate <= new Date(dateRange.end);

      const matchesYear =
        !academicYear || item.academicYear === academicYear;

      return matchesStart && matchesEnd && matchesYear;
    });
  }, [allTransactions, dateRange, academicYear]);

  // 🔹 Export Function
  const handleExport = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map(
        ({ profileImage, uniqueId, academicYear, ...rest }) => rest
      )
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DateWise_Report");
    const fileName = `Fee_Report_${
      dateRange.start || "All"
    }_${dateRange.end || ""}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

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
                        src={item.profileImage}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p>{item.name}</p>
                        <p className="text-gray-500">
                          {item.year} / {item.department}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="text-center">{item.rollNo}</td>
                  <td className="text-center">{item.sem} Sem</td>
                  <td className="text-center">{item.feeHead}</td>
                  <td className="text-center">₹{item.amount}</td>
                  <td className="text-center">{item.date}</td>
                  <td className="text-center">{item.paymentMode}</td>
                  <td className="text-center">{item.bank || "N/A"}</td>
                  <td className="text-center">{item.receiptNo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-20 text-gray-400">
                  No records found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}