import React from "react";
import Favlogo from "../assets/favlogo.svg";

export default function FeeTable({ data }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow overflow-hidden">
      <div className="max-h-105 overflow-y-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-65" />
            <col className="w-45" />
            <col className="w-30" />
            <col className="w-30" />
            <col className="w-30" />
            <col className="w-30" />
            <col className="w-30" />
            <col className="w-30" />
            <col className="w-35" />
            <col className="w-20" />
          </colgroup>

          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              {[
                "Student Details",
                "Roll Number",
                "Department",
                "Total Fees",
                "Concession",
                "Paid",
                "Overdue",
                "Status",
                "Last Payment",
                "Action",
              ].map((h) => (
                <th key={h} className="p-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((student) => (
              <tr key={student.id} >
                <td className="p-3">
                  <div className="flex gap-3 items-center">
                    <img src={Favlogo} className="w-10 h-10" />
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.year}</div>
                    </div>
                  </div>
                </td>

                <td className="p-3">{student.rollNo}</td>
                <td className="p-3">{student.department}</td>
                <td className="p-3">₹{student.totalFees}</td>
                <td className="p-3">₹{student.concession}</td>
                <td className="p-3">₹{student.paid}</td>
                <td className="p-3 text-red-500">₹{student.overdue}</td>
                <td className="p-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    {student.status}
                  </span>
                </td>
                <td className="p-3">{student.lastPayment}</td>
                <td className="p-3">
                  <img src={Favlogo} className="w-8 h-8 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
