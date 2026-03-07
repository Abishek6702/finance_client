import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import PaymentDrawer from "./PaymentDrawer";
import nodata from "../assets/nodata.svg";

const NewpaymnetTable = ({ selectedStudent, transactions = [], filters,onRefresh }) => {
  const [enteredAmounts, setEnteredAmounts] = useState({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [errors, setErrors] = useState({});

  const getStatusStyles = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";
    const normalized = status.toLowerCase();
    if (normalized === "paid") return "bg-[#F3FCF7] text-[#44CF7D]";
    if (normalized === "overdue") return "bg-[#FCEAEE] text-[#ED6C83]";
    if (normalized === "partially paid") return "bg-[#FFF6EA] text-[#FFA02D]";
    return "bg-gray-100 text-gray-600";
  };

  const isOverdueDate = (dateString) => {
    if (!dateString) return false;
    const [day, month, year] = dateString.split("-");
    const lastDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    return lastDate < today;
  };

  const filteredData = (transactions || []).filter((item) => {
    return (
      item.academicYear === filters.academicYear &&
      item.semester === filters.semester &&
      (filters.feeHead === "All" || item.feeHead === filters.feeHead)
    );
  });

  const handleAmountChange = (key, value, pendingAmount) => {
    const numericValue = Number(value);

    setEnteredAmounts((prev) => ({
      ...prev,
      [key]: value
    }));

    if (numericValue > pendingAmount) {
      setErrors((prev) => ({
        ...prev,
        [key]: `Exceeds ₹${pendingAmount}`
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [key]: ""
      }));
    }
  };

  const totals = filteredData.reduce(
    (acc, item) => {
      acc.totalAmount += Number(item.totalAmount || 0);
      acc.concession += Number(item.concession || 0);
      acc.paid += Number(item.paid || 0);
      acc.pending += Number(item.pending || 0);
      const key = `${item.feeHead}-${item.subHead}`;
      acc.enterAmount += Number(enteredAmounts[key] || 0);
      return acc;
    },
    { totalAmount: 0, concession: 0, paid: 0, pending: 0, enterAmount: 0 }
  );

  const enteredRows = filteredData
    .map((item) => ({ ...item, enteredAmount: Number(enteredAmounts[`${item.feeHead}-${item.subHead}`] || 0)}))
    .filter((item) => item.enteredAmount > 0);

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEnteredAmounts({});
    setErrors({});
  };
  const hasErrors = Object.values(errors).some((err) => err);

  return (
    <div className="w-full border rounded-xl border-gray-200 bg-white overflow-hidden">
      <div className="h-[calc(100vh-320px)] overflow-y-auto overflow-x-auto custom-scrollbar relative">
        <table className="border-collapse w-full table-fixed min-w-[1100px]">
          {/* Colgroup adjusted for no Fine field */}
          <colgroup><col className="w-[13%]"/><col className="w-[13%]"/><col className="w-[12%]"/><col className="w-[11%]"/><col className="w-[12%]"/><col className="w-[11%]"/><col className="w-[11%]"/><col className="w-[11%]"/><col className="w-[15%]"/></colgroup>

          <thead className="sticky top-0 z-40 bg-[#F0F0F0]">
            <tr className="">
              {[
                "Fee Head", "Sub Head", "Total Amount", "Concession", 
                "Last Date", "Paid", "Pending", "Status", "Enter Amount"
              ].map((header) => (
                <th key={header} className="p-3 text-center font-semibold ">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {filteredData.map((item) => (
              <tr key={`${item.feeHead}-${item.subHead}`} className="">
                <td className="p-1.5 text-center truncate">{item.feeHead}</td>
                <td className="p-1.5 text-center truncate">{item.subHead}</td>
                <td className="p-1.5 text-center text-gray-800 ">₹{item.totalAmount}</td>
                <td className="p-1.5 text-center text-gray-800 ">₹{item.concession}</td>
                <td className={`p-1.5 text-center ${isOverdueDate(item.lastDate) ? "text-[#ed6c83]" : ""}`}>
                  {item.lastDate}
                </td>
                <td className="p-1.5 text-center text-[#44CF7D] ">₹{item.paid}</td>
                <td className="p-1.5 text-center ">₹{item.pending}</td>
                <td className="p-1.5 text-center">
                  <span className={`px-3 py-1 rounded-md text-[12px] font-semibold ${getStatusStyles(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-1.5 text-center">
                  <div className="flex flex-col items-center justify-center min-h-[48px]">
                    <input
                      type="number"
                      min="0"
                      disabled={item.status?.toLowerCase() === "paid"}
                      value={enteredAmounts[`${item.feeHead}-${item.subHead}`] || ""}
                      onChange={(e) => handleAmountChange(`${item.feeHead}-${item.subHead}`, e.target.value, item.pending)}
                      placeholder="Enter Amount"
                      className={`w-full max-w-[120px] px-2 py-1.5 border rounded-lg text-center outline-none transition-all ${
                        item.status?.toLowerCase() === "paid" 
                          ? "bg-gray-50 cursor-not-allowed text-gray-400 border-gray-200" 
                          : errors[`${item.feeHead}-${item.subHead}`] 
                            ? "border-red-500 bg-red-50 text-red-600" 
                            : "border-gray-200 text-gray-700 focus:border-gray-400"
                      }`}
                    />
                    {errors[`${item.feeHead}-${item.subHead}`] && (
                      <span className="text-[10px] text-red-600 mt-1 leading-none font-medium">
                        {errors[`${item.feeHead}-${item.subHead}`]}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className="sticky bottom-0 z-40 bg-[#f3f4f6] border-t-2 border-gray-200">
            <tr className="font-semibold ">
              <td className="p-3 text-center">Total</td>
              <td className="p-3"></td>
              <td className="p-3 text-center">₹{totals.totalAmount}</td>
              <td className="p-3 text-center">₹{totals.concession}</td>
              <td className="p-3"></td>
              <td className="p-3 text-center ">₹{totals.paid}</td>
              <td className="p-3 text-center ">₹{totals.pending}</td>
              <td className="p-3"></td>
              <td className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-900">₹{totals.enterAmount}</span>
                  <button 
                    disabled={totals.enterAmount <= 0 || hasErrors}
                    onClick={() => setShowDrawer(true)}
                    className={`p-1.5 rounded-lg transition-all ${
                      totals.enterAmount > 0 
                      ? "bg-[#1f5aa6] text-white hover:bg-gray-300 cursor-pointer" 
                      : "bg-gray-200 rounded-xl cursor-not-allowed"
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>

        {filteredData.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center bg-white">
            <img src={nodata} alt="No data" className="w-40 opacity-60" />
            <p className="text-gray-400 mt-4 font-medium">No payment records found.</p>
          </div>
        )}
      </div>

      <PaymentDrawer
      show={showDrawer}
      onClose={handleCloseDrawer}
      onRefresh={onRefresh} // Pass it here
      selectedStudent={selectedStudent}
      enteredRows={enteredRows}
      totalAmount={totals.enterAmount}
    />
    </div>
  );
};

export default NewpaymnetTable;