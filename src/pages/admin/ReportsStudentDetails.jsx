import React, { useMemo, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import ReportsDetailsFilter from "../../components/ReportsDetailsFilter";
import { Download } from 'lucide-react';
import DateWiseFeeReport from '../../components/DateWiseFeeReport';

export default function ReportsStudentDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const student = state?.user;

  const [search, setSearch] = useState("");
  const [sem, setSem] = useState("");
  const [feesHead, setFeesHead] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState("individual");


  const filteredFees = useMemo(() => {
    if (!student?.fees) return [];

    return student.fees.filter((fee) => {
      return (
        (!search || fee.receiptNo.includes(search)) &&
        (!sem || fee.sem === sem) &&
        (!feesHead || fee.feesHead === feesHead) &&
        (!paymentMode || fee.paymentMode === paymentMode) &&
        (!date || fee.paymentDate === date)
      );
    });
  }, [student, search, sem, feesHead, paymentMode, date]);

  const handleRowSelect = (receiptNo) => {
    setSelectedRows((prev) =>
      prev.includes(receiptNo)
        ? prev.filter((id) => id !== receiptNo)
        : [...prev, receiptNo]
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
    const dataToExport = filteredFees.filter((fee) =>
      selectedRows.includes(fee.receiptNo)
    );

    if (dataToExport.length === 0) {
      alert("Please select at least one row");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fees Report");

    XLSX.writeFile(workbook, "Fees_Report.xlsx");
  };

  const handleSingleExport = (fee) => {
  const worksheet = XLSX.utils.json_to_sheet([fee]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Receipt");

  XLSX.writeFile(workbook, `Receipt_${fee.receiptNo}.xlsx`);
};

  if (!student) {
    return <p className="p-6">No student selected</p>;
  }

  return (
    <>
        <div className="flex gap-3 mb-4">
            <button
                onClick={() => navigate("/admin/reports")}
                className="px-4 py-2 rounded-lg bg-[#1F5AA6] text-white"
            >
                Individual Fees Report
            </button>

            <button
                onClick={() => setActiveTab("datewise")}
                className={`px-4 py-2 rounded-lg ${
                activeTab === "datewise"
                    ? "bg-[#1F5AA6] text-white"
                    : "bg-gray-200"
                }`}
            >
                Date Wise Fee Report
            </button>
            </div>



        <h2 className="text-lg mb-4 text-gray-600">
            Individual Fees Report {" > "}
            <span className="text-[#1F5AA6] font-medium">
            {student.name} ({student.rollNo})
            </span>
        </h2>
      <ReportsDetailsFilter
        search={search}
        onSearchChange={setSearch}
        sem={sem}
        onSemChange={setSem}
        feesHead={feesHead}
        onFeesHeadChange={setFeesHead}
        paymentMode={paymentMode}
        onPaymentModeChange={setPaymentMode}
        date={date}
        onDateChange={setDate}
        year={year}
        onYearChange={setYear}
        onClearFilters={() => {
            setSearch("");
            setSem("");
            setFeesHead("");
            setPaymentMode("");
            setDate("");
            setYear("");
        }}
        onExport={handleExport}
      />

      <div className="bg-white rounded-xl border border-[#D9D9D9]">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
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
              <th>Payment Mode</th>
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
                  <td>{fee.paymentMode}</td>
                  <td>
                    <button
                        onClick={() => handleSingleExport(fee)}
                        className="bg-[#0B56A4] text-white p-2 rounded-3xl text-sm cursor-pointer"
                    >
                        <Download/>
                    </button>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center p-6 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
