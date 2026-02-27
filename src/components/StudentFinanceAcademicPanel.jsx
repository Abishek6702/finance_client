import React from "react";
import { ChevronRight } from "lucide-react";
import Dayscholar from "../assets/dayscholar.svg";
import Hostel from "../assets/hostel.svg";
import Transport from "../assets/transport1.svg";
import AcademicAccordionRow from "./AcademicAccordionRow";

const StudentFinanceAcademicPanel = ({ student, academicYear }) => {
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

  const oddData = data.filter((row) => row.semester === "Odd");
  const evenData = data.filter((row) => row.semester === "Even");

  const toggleRow = (key) => {
    setOpenIndexes((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key],
    );
  };

  const getStatusStyles = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";
    const normalized = status.toLowerCase();

    if (normalized === "paid") return "bg-[#F3FCF7] text-[#44CF7D]";
    if (normalized === "overdue") return "bg-[#FCEAEE] text-[#ED6C83]";
    if (normalized === "partial") return "bg-[#FFF6EA] text-[#FFA02D]";

    return "bg-gray-100 text-gray-600";
  };

  const getStudentImages = (student) => {
    if (student?.ishostler) return [Hostel];

    const images = [];
    if (student?.isdayscholer) images.push(Dayscholar);
    if (student?.iscollegetransport) images.push(Transport);

    return images;
  };

  const renderTable = (rows, typePrefix) => {
    const overallStatus = rows.every((row) => row.type === "Paid")
      ? "Paid"
      : "Partial";

    return (
      <div className="mb-6">
        <div className="overflow-hidden rounded-xl border border-[#d9d9d9]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 rounded-2xl">
                <tr className="whitespace-nowrap  rounded-2xl">
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

              <tbody>
                {rows.map((row, index) => (
                  <React.Fragment key={`${typePrefix}-${index}`}>
                    <tr className="border-t border-gray-200 hover:bg-gray-50 transition bg-[#ffffff]">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleRow(`${typePrefix}-${index}`)}
                          className="bg-[#0b56a4] rounded-full text-white p-1 hover:bg-[#084482] transition"
                        >
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-300 ${
                              openIndexes.includes(`${typePrefix}-${index}`)
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                        </button>
                      </td>

                      <td className="px-4 py-3">{row.semester} Semester</td>

                      <td className="px-4 py-3">{academicYear?.year}</td>

                      <td className="px-4 py-3">
                        ₹{row.demand.toLocaleString()}
                      </td>

                      <td className="px-4 py-3">
                        ₹{row.concession.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-green-600 font-medium">
                        ₹{row.paid.toLocaleString()}
                      </td>

                      <td className="px-4 py-3">
                        ₹{row.fine.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-red-500 font-medium">
                        ₹{row.overdue.toLocaleString()}
                      </td>

                      <td className="p-3">
                        <div className="flex gap-2">
                          {getStudentImages(student).map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="student-type"
                              className="w-6 h-6 object-contain"
                            />
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyles(
                            row.type,
                          )}`}
                        >
                          {row.type}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        ₹{row.total.toLocaleString()}
                      </td>

                      <td></td>
                    </tr>

                    {openIndexes.includes(`${typePrefix}-${index}`) && (
                      <AcademicAccordionRow row={row} />
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className=" w-full  overflow-hidden">
      {oddData.length > 0 && renderTable(oddData, "odd")}
      {evenData.length > 0 && renderTable(evenData, "even")}
    </div>
  );
};

export default StudentFinanceAcademicPanel;
