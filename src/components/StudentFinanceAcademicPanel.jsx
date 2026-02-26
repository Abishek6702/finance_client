import React from "react";
import { ArrowUpRight, ChevronRight, X } from "lucide-react";
import Dayscholar from "../assets/dayscholar.svg";
import Hostel from "../assets/hostel.svg";
import Transport from "../assets/transport1.svg";
import { Link } from "react-router-dom";
import AcademicAccordionRow from "./AcademicAccordionRow"

const StudentFinanceAcademicPanel = ({student,academicYear}) => {
  const data = [
    {
      year: "2024 - 2025",
      semester: "Odd",
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
      semester: "Even",

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
  const [openIndexes, setOpenIndexes] = React.useState([]);
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

  const getStudentImages = (student) => {
    console.log("test1L:", student.st);
    // If hostler → show only hostel
    if (student.ishostler) {
      return [Hostel];
    }

    const images = [];

    // If day scholar → show day scholar
    if (student.isdayscholer) {
      images.push(Dayscholar);
    }

    // If transport → show transport
    if (student.iscollegetransport) {
      images.push(Transport);
    }

    return images;
  };

  const toggleRow = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index) // close it
        : [...prev, index] // open it
    );
  };
  return (
    <div className="bg-white w-full rounded-2xl border border-gray-200 overflow-hidden ">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "",
                "Semester Type",
                "Academic Year",
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
              <React.Fragment key={index}>
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleRow(index)}
                      className="bg-[#0b56a4] rounded-full text-white p-1 hover:bg-[#084482] transition cursor-pointer"
                    >
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          openIndexes.includes(index) ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">{row.semester} Semester</td>

                  <td className="px-4 py-3">{academicYear?.year}</td>
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
                  <td className="p-3">
                    <div className="flex gap-2">
                      {getStudentImages(student).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="student-type"
                          className="w-6 h-6 object-contain"
                        />
                      ))}
                    </div>
                  </td>

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
                </tr>
                {openIndexes.includes(index) && (
  <AcademicAccordionRow row={row} />
)}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot className=" font-semibold border-t border-gray-200">
            <tr>
              <td colSpan="3"></td>

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

export default StudentFinanceAcademicPanel;
