import React from "react";
import { Download } from "lucide-react";
import { academicSampleData } from "../data";
import nodata from "../assets/nodata.svg";


const AcademicAccordionRow = () => {
  console.log("AcademicAccordionRow - Row Data:", academicSampleData.details);
  const getStatusStyles = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";

    const normalized = status.toLowerCase();

    if (normalized === "paid") return "bg-[#F3FCF7] text-[#44CF7D]";

    if (normalized === "overdue") return "bg-[#FCEAEE] text-[#ED6C83]";

    if (normalized === "partial") return "bg-[#FFF6EA] text-[#FFA02D]";

    return "bg-gray-100 text-gray-600";
  };
  return (
    <tr className="">
      <td colSpan="12" className="px-6 py-4">
        <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
          <div className="overflow-x-auto ">
            <table className="w-full table-fixed text-sm text-center">
              <thead className="bg-gray-100 text-gray-600">
                <tr className="h-">
                  <th className=" whitespace-nowrap">Fees Head</th>
                  <th className="p-3">Total</th>

                  <th className="p-3">Concession</th>
                  <th className="">Fine</th>
                  <th className="">Paid</th>
                  <th className="">Overdue</th>
                  <th className="">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {academicSampleData.length > 0 ? (
                  academicSampleData.map((fee) => (
                    <tr key={fee.receiptNo} className="">
                      <td className="p-3">{fee.feesHead}</td>
                      <td className="">{fee.total}</td>
                      <td className="">₹{fee.concession}</td>

                      <td className="">{fee.fine}</td>
                      <td className=" text-red-500 font-medium">₹{fee.paid}</td>
                      <td className="">{fee.Overdue}</td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded text-sm font-medium ${getStatusStyles(
                            fee.status,
                          )}`}
                        >
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="h-20">
                    <td colSpan="10" className="text-center text-gray-500">
                    <img src={nodata} alt="No data" className="w-50 " />
                <p className="text-gray-500">No results found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default AcademicAccordionRow;
