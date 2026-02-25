import React from "react";
import { ArrowUpRight } from "lucide-react";

const IndividualDCB = () => {
  const data = [
    {
      year: "2024 - 2025",
      class: "CSE - A",
      community: "BC",
      demand: 50000,
      concession: 2000,
      paid: 2100,
      fine: 0,
      overdue: 2100,
      type: "Paid",
      total: 50000,
    },
    {
      year: "2024 - 2025",
      class: "CSE - A",
      community: "BC",
      demand: 50000,
      concession: 2000,
      paid: 2100,
      fine: 0,
      overdue: 2100,
      type: "Partial",
      total: 50000,
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "Paid") return "bg-green-100 text-green-600";
    if (status === "Partial") return "bg-orange-100 text-orange-600";
    return "bg-gray-100 text-gray-600";
  };
  const totals = data.reduce(
    (acc, row) => {
      acc.demand += row.demand;
      acc.concession += row.concession;
      acc.paid += row.paid;
      acc.fine += row.fine;
      acc.overdue += row.overdue;
      acc.total += row.total;
      return acc;
    },
    {
      demand: 0,
      concession: 0,
      paid: 0,
      fine: 0,
      overdue: 0,
      total: 0,
    },
  );
  const overallStatus = data.every((row) => row.type === "Paid")
    ? "Paid"
    : "Partial";
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden ">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "Academic Year",
                "Class",
                // "Community",
                "Demand",
                "Concession",
                "Paid",
                "Fine",
                "Overdue",
                "Student Type",
                "Status",
                "Total",
                "",
              ].map((head) => (
                <th key={head} className="px-4 py-3 text-left font-medium">
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{row.year}</td>
                <td className="px-4 py-3">{row.class}</td>
                {/* <td className="px-4 py-3">{row.community}</td> */}
                <td className="px-4 py-3">₹{row.demand.toLocaleString()}</td>
                <td className="px-4 py-3">
                  ₹{row.concession.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-green-600 font-medium">
                  ₹{row.paid.toLocaleString()}
                </td>

                <td className="px-4 py-3">{row.fine}</td>

                <td className="px-4 py-3 text-red-500 font-medium">
                  ₹{row.overdue.toLocaleString()}
                </td>
                <td className="px-4 py-3">{row.type}</td>

                {/* Status Badge */}
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      row.type,
                    )}`}
                  >
                    {row.type}
                  </span>
                </td>

                <td className="px-4 py-3">₹{row.total.toLocaleString()}</td>

                {/* Action */}
                <td className="px-4 py-3">
                  <button className="bg-[#0B56A4] p-2 rounded-full text-white hover:scale-105 transition">
                    <ArrowUpRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className=" font-semibold border-t border-gray-200">
            <tr>
              <td colSpan="2"></td>

              <td className="px-4 py-3">₹{totals.demand.toLocaleString()}</td>

              <td className="px-4 py-3">
                ₹{totals.concession.toLocaleString()}
              </td>

              <td className="px-4 py-3 text-green-700">
                ₹{totals.paid.toLocaleString()}
              </td>

              <td className="px-4 py-3">₹{totals.fine.toLocaleString()}</td>

              <td className="px-4 py-3 text-red-600">
                ₹{totals.overdue.toLocaleString()}
              </td>

              <td></td>

              {/* Overall Status */}
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    overallStatus,
                  )}`}
                >
                  {overallStatus}
                </span>
              </td>

              <td className="px-4 py-3">₹{totals.total.toLocaleString()}</td>

              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default IndividualDCB;
