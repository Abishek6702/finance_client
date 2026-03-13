import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

import Dayscholar from "../assets/dayscholar.svg";
import Hostel from "../assets/hostel.svg";
import Transport from "../assets/transport1.svg";

const IndividualDCB = ({student}) => {

  // const location = useLocation();
  // const student = location.state?.student;

  // =========================
  // Convert Backend Data
  // =========================

  const records = student?.feeSummary || [];
  console.log("Student Data:", student);
console.log("Fee Summary:", student?.feeSummary);

  const data = records.map((record) => ({
  year: record.academicYear,
  class: student.department,
  demand: record.demand,
  concession: record.concession,
  paid: record.paid,
  fine: 0,
  overdue: record.overdue,
  type: record.status,
  total: record.total,
}));


  // =========================
  // Status Style
  // =========================
 const getStatusStyles = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";
    if (status === "Paid") return "bg-[#F3FCF7] text-[#44CF7D]";
    if (status === "Unpaid") return "bg-[#FCEAEE] text-[#ED6C83]";
    if (status === "Partial") return "bg-[#FFF6EA] text-[#FFA02D]";
    return "bg-gray-100 text-gray-600";
  };


  // =========================
  // Student Type Icons
  // =========================

  const getStudentImages = (record) => {
    if (record?.studentType?.hostel) return [Hostel];

    const images = [];

    if (!record?.studentType?.hostel) images.push(Dayscholar);

    if (record?.studentType?.transport) images.push(Transport);

    return images;
  };


  // =========================
  // Totals Calculation
  // =========================

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
    }
  );

  const overallStatus = data.every((row) =>
    row.type?.toLowerCase().includes("paid") &&
    !row.type?.toLowerCase().includes("partial")
  )
    ? "Paid"
    : "Partial";



  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          {/* Header */}

          <thead className="bg-gray-100 text-gray-700">

            <tr>
              {[
                "Academic Year",
                "Class",
                "Demand",
                "Concession",
                "Paid",
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

                <td className="px-4 py-3">
                  ₹{row.demand.toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  ₹{row.concession.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-green-600 font-medium">
                  ₹{row.paid.toLocaleString()}
                </td>

                {/* <td className="px-4 py-3">
                  ₹{row.fine.toLocaleString()}
                </td> */}

                <td className="px-4 py-3 text-red-500 font-medium">
                  ₹{row.overdue.toLocaleString()}
                </td>


                {/* Student Type */}

                <td className="p-3">
                  <div className="flex gap-2">

                    {getStudentImages(records[index]).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt="student-type"
                        className="w-6 h-6 object-contain"
                      />
                    ))}

                  </div>
                </td>


                {/* Status */}

                <td className="px-4 py-3">

                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyles(
                      row.type
                    )}`}
                  >
                    {row.type}
                  </span>

                </td>


                <td className="px-4 py-3">
                  ₹{row.total.toLocaleString()}
                </td>


                {/* Action */}

                <td className="px-4 py-3">

                  <Link
                    to={`/admin/fees_management/${student?.rollNo}/${row.year}`}
                    state={{
                      row: row,
                      student: student,
                    }}
                  >

                    <button className="bg-[#0B56A4] p-2 rounded-full text-white hover:scale-105 transition">

                      <ArrowUpRight size={16} />

                    </button>

                  </Link>

                </td>

              </tr>

            ))}

          </tbody>


          {/* Footer Totals */}

          <tfoot className="font-semibold border-t border-gray-200">

            <tr>

              <td colSpan="2"></td>

              <td className="px-4 py-3">
                ₹{totals.demand.toLocaleString()}
              </td>

              <td className="px-4 py-3">
                ₹{totals.concession.toLocaleString()}
              </td>

              <td className="px-4 py-3 text-green-700">
                ₹{totals.paid.toLocaleString()}
              </td>

              {/* <td className="px-4 py-3">
                ₹{totals.fine.toLocaleString()}
              </td> */}

              <td className="px-4 py-3 text-red-600">
                ₹{totals.overdue.toLocaleString()}
              </td>

              <td></td>


              {/* Overall Status */}

              <td className="px-4 py-3">

                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyles(
                    overallStatus
                  )}`}
                >
                  {overallStatus}
                </span>

              </td>

              <td className="px-4 py-3">
                ₹{totals.total.toLocaleString()}
              </td>

              <td></td>

            </tr>

          </tfoot>

        </table>

      </div>

    </div>
  );
};

export default IndividualDCB;