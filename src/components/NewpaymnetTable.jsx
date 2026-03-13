import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import PaymentDrawer from "./PaymentDrawer";

const NewpaymnetTable = ({ selectedStudent, transactions = [], filters, onRefresh }) => {
  const [enteredAmounts, setEnteredAmounts] = useState({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [errors, setErrors] = useState({});

  const getStatusStyles = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";
    if (status === "Paid") return "bg-[#F3FCF7] text-[#44CF7D]";
    if (status === "Unpaid") return "bg-[#FCEAEE] text-[#ED6C83]";
    if (status === "Partial") return "bg-[#FFF6EA] text-[#FFA02D]";
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
      item.semesterType === filters.semester &&
      (filters.feeHead === "All" || item.feeHead === filters.feeHead)
    );
  });

  const handleAmountChange = (key, value, pendingAmount) => {
    const numericValue = Number(value);
    setEnteredAmounts((prev) => ({ ...prev, [key]: value }));

    if (numericValue > pendingAmount) {
      setErrors((prev) => ({ ...prev, [key]: `Exceeds ₹${pendingAmount}` }));
    } else {
      setErrors((prev) => ({ ...prev, [key]: "" }));
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
    .map((item) => ({ ...item, enteredAmount: Number(enteredAmounts[`${item.feeHead}-${item.subHead}`] || 0) }))
    .filter((item) => item.enteredAmount > 0);

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEnteredAmounts({});
    setErrors({});
  };

  const hasErrors = Object.values(errors).some((err) => err);

  return (
    <div className="w-full border rounded-xl border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-[calc(100vh-160px)]">
      
      {/* Table Wrapper using Flexbox to push footer down */}
      <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar relative flex flex-col">
        <table className="border-collapse w-full table-fixed min-w-[1100px] flex-1">
          <colgroup>
            <col className="w-[13%]"/><col className="w-[11%]"/><col className="w-[12%]"/>
            <col className="w-[11%]"/><col className="w-[12%]"/><col className="w-[11%]"/>
            <col className="w-[11%]"/><col className="w-[13%]"/><col className="w-[15%]"/>
          </colgroup>

          <thead className="sticky top-0 z-40 bg-[#F0F0F0] shadow-sm">
            <tr>
              {[
                "Fee Head", "Sub Head", "Total Amount", "Concession", 
                "Last Date", "Paid", "Pending", "Status", "Enter Amount"
              ].map((header) => (
                <th key={header} className="p-3 text-center font-semibold text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {filteredData.map((item) => {
              // Show Overdue if the status is Unpaid
              
              return (
                <tr key={`${item.feeHead}-${item.subHead}`} className="">
                  <td className="p-2 text-center ">{item.feeHead}</td>
                  <td className="p-2 text-center ">{item.subHead}</td>
                  <td className="p-2 text-center ">₹{item.totalAmount}</td>
                  <td className="p-2 text-center ">₹{item.concession}</td>
                  <td className={`p-2 text-center  ${isOverdueDate(item.lastDate) ? "text-[#ed6c83] " : ""}`}>
                    {item.lastDate}
                  </td>
                  <td className="p-2 text-center  text-[#44CF7D]">₹{item.paid}</td>
                  <td className="p-2 text-center ">₹{item.pending}</td>
                  <td className="p-2 text-center">
                    <span className={`px-3 py-1 rounded-md  ${getStatusStyles(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex flex-col items-center justify-center min-h-[52px]">
                      <input
                        type="number"
                        min="0"
                        disabled={item.status?.toLowerCase() === "paid"}
                        value={enteredAmounts[`${item.feeHead}-${item.subHead}`] || ""}
                        onChange={(e) => handleAmountChange(`${item.feeHead}-${item.subHead}`, e.target.value, item.pending)}
                        placeholder="0.00"
                        className={`w-full max-w-[110px] px-2 py-1.5 border rounded-lg text-center text-sm outline-none transition-all ${
                          item.status?.toLowerCase() === "paid" 
                            ? "bg-gray-50 cursor-not-allowed text-gray-400 border-gray-100" 
                            : errors[`${item.feeHead}-${item.subHead}`] 
                              ? "border-red-500 bg-red-50 text-red-600" 
                              : "border-gray-200 font-semibold"
                        }`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {/* This empty row expands to fill space, pushing the footer to the bottom */}
            <tr className="flex-1 min-h-0">
               <td colSpan="9" className="h-full"></td>
            </tr>
          </tbody>

          {/* Sticky footer that stays at the bottom line of the container */}
          <tfoot className="sticky bottom-0 z-40 bg-[#f0f0f0] border-t-2 border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <tr className="font-semibold">
              <td className="p-3 text-center">TOTAL</td>
              <td className="p-3"></td>
              <td className="p-3 text-center">₹{totals.totalAmount}</td>
              <td className="p-3 text-center">₹{totals.concession}</td>
              <td className="p-3"></td>
              <td className="p-3 text-center text-[#2ea35f]">₹{totals.paid}</td>
              <td className="p-3 text-center">₹{totals.pending}</td>
              <td className="p-3"></td>
              <td className="p-3 text-center">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-[#1f5aa6]">₹{totals.enterAmount}</span>
                  <button 
                    disabled={totals.enterAmount <= 0 || hasErrors}
                    onClick={() => setShowDrawer(true)}
                    className={`p-2 rounded-xl transition-all transform active:scale-95 ${
                      totals.enterAmount > 0 && !hasErrors
                      ? "bg-[#1f5aa6] text-white hover:bg-[#16427a] cursor-pointer shadow-md" 
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <PaymentDrawer
        show={showDrawer}
        onClose={handleCloseDrawer}
        onRefresh={onRefresh}
        selectedStudent={selectedStudent}
        enteredRows={enteredRows}
        totalAmount={totals.enterAmount}
      />
    </div>
  );
};

export default NewpaymnetTable;