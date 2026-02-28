import React, { useState } from "react";
import { feeData } from "../data.js";
import { ArrowUpRight, Search } from "lucide-react";
import PaymentDrawer from "./PaymentDrawer";
import nodata from "../assets/nodata.svg";

const NewpaymnetTable = ({ selectedStudent, filters }) => {
  const [enteredAmounts, setEnteredAmounts] = useState({});
  const [showDrawer, setShowDrawer] = useState(false);
  console.log("l", filters);
  console.log(selectedStudent);
  const getStatusStyles = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";

    const normalized = status.toLowerCase();

    if (normalized === "paid") return "bg-[#F3FCF7] text-[#44CF7D]";

    if (normalized === "overdue") return "bg-[#FCEAEE] text-[#ED6C83]";

    if (normalized === "partial") return "bg-[#FFF6EA] text-[#FFA02D]";

    return "bg-gray-100 text-gray-600";
  };

  const isOverdueDate = (dateString) => {
    if (!dateString) return false;

    const [day, month, year] = dateString.split("-");

    const lastDate = new Date(year, month - 1, day); // month is 0-based
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);

    return lastDate < today;
  };
  const filteredData = feeData.filter((item) => {
    return (
      item.academicYear === filters.academicYear &&
      item.semester === filters.semester &&
      (filters.feeHead === "All" || item.feeHead === filters.feeHead)
    );
  });
  const handleAmountChange = (index, value) => {
    setEnteredAmounts((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const totals = filteredData.reduce(
    (acc, item, index) => {
      acc.totalAmount += Number(item.totalAmount || 0);
      acc.concession += Number(item.concession || 0);
      acc.paid += Number(item.paid || 0);
      acc.pending += Number(item.pending || 0);
      acc.fine += Number(item.fine || 0);
      acc.enterAmount += Number(enteredAmounts[index] || 0);

      return acc;
    },
    {
      totalAmount: 0,
      concession: 0,
      paid: 0,
      pending: 0,
      fine: 0,
      enterAmount: 0,
    },
  );
  const hasEnteredAmount = totals.enterAmount > 0;
  const enteredRows = filteredData
    .map((item, index) => ({
      ...item,
      enteredAmount: Number(enteredAmounts[index] || 0),
    }))
    .filter((item) => item.enteredAmount > 0);
  return (
    <div className="w-full border rounded-2xl border-gray-200">
      <div className="w-full bg-white rounded-2xl  ">
        {/* Horizontal Scroll */}
        <div className="overflow-x-auto ">
          {/* Vertical Scroll */}
          <div className="h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar relative  rounded-xl">
            <table className="border-collapse w-full h-4">
              <thead className="sticky top-0 z-30 bg-[#F0F0F0]">
                <tr>
                  {[
                    "Fee Head",
                    "Sub Head",
                    "Total Amount",
                    "Concession",
                    "Last Date",
                    "Fine",
                    "Paid",
                    "Pending",
                    "Status",
                    "Enter Amount",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-3 text-center font-semibold whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white">
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="p-3 text-center whitespace-nowrap">
                      {item.feeHead}
                    </td>
                    <td className="p-3 text-center">{item.subHead}</td>
                    <td className="p-3 text-center">₹{item.totalAmount}</td>
                    <td className="p-3 text-center">₹{item.concession}</td>
                    <td
                      className={`p-3 text-center  ${
                        isOverdueDate(item.lastDate)
                          ? "text-[#ED6C83]"
                          : "text-gray-700"
                      }`}
                    >
                      {item.lastDate}
                    </td>
                    <td className="p-3 text-center text-[#ED6C83] font-semibold">
                      ₹{item.fine}
                    </td>
                    <td className="p-3 text-center text-[#44CF7D] font-semibold">
                      ₹{item.paid}
                    </td>
                    <td className="p-3 text-center font-semibold text-gray-800">
                      ₹{item.pending}
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-md text-sm font-medium ${getStatusStyles(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={enteredAmounts[index] || ""}
                        onChange={(e) =>
                          handleAmountChange(index, e.target.value)
                        }
                        placeholder="Enter Amount"
                        className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg text-center focus:outline-none "
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-gray-100 font-semibold">
                <tr>
                  <td className="p-3 text-center">Total</td>
                  <td></td>

                  <td className="p-3 text-center ">₹{totals.totalAmount}</td>

                  <td className="p-3 text-center ">₹{totals.concession}</td>

                  <td></td>

                  <td className="p-3 text-center text-red-500">
                    ₹{totals.fine}
                  </td>

                  <td className="p-3 text-center text-green-600">
                    ₹{totals.paid}
                  </td>

                  <td className="p-3 text-center text-gray-800">
                    ₹{totals.pending}
                  </td>

                  <td></td>

                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span>₹{totals.enterAmount}</span>

                      <button
                        disabled={!hasEnteredAmount}
                        onClick={() => setShowDrawer(true)}
                        className={`p-1  rounded-full text-sm font-medium transition-colors
        ${
          hasEnteredAmount
            ? "bg-[#1F5AA6] text-white  cursor-pointer"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
            <PaymentDrawer
              show={showDrawer}
              onClose={() => setShowDrawer(false)}
              selectedStudent={selectedStudent}
              enteredRows={enteredRows}
              totalAmount={totals.enterAmount}
            />
            {filteredData.length === 0 && (
              <div className="py-6 flex flex-col items-center justify-center text-gray-400">
                <img src={nodata} alt="No data" className="w-50 " />
                <p className="text-gray-500">No results found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewpaymnetTable;
