import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Dayscholar from "../assets/dayscholar.svg";
import Hostel from "../assets/hostel.svg";
import Transport from "../assets/transport1.svg";

export default function FeeTable({ data }) {
  const navigate = useNavigate();

  const handleNavigate = (student) => {
    navigate(`/admin/fees_management/${student.id}`, {
      state: { student },
    });
  };

  const getStatusStyles = (status) => {
    const normalized = status.toLowerCase();

    if (normalized === "paid") {
      return "bg-green-100 text-green-700";
    }
    if (normalized === "partial") {
      return "bg-orange-100 text-orange-700";
    }
    if (normalized === "overdue") {
      return "bg-red-100 text-red-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  const getStudentImages = (student) => {
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

  return (
    <div className="w-full bg-white rounded-2xl shadow">
      <div className=" max-h-[calc(100vh-260px)] overflow-auto  rounded-2xl">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-45" />
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

          <thead className="sticky top-0 bg-[#F0F0F0] z-20">
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
                "Type",
                "",
              ].map((header) => (
                <th key={header} className="p-3 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((student) => (
              <tr key={student.id} className="">
                <td className="p-3">
                  <div className="flex gap-3 items-center">
                    <img
                      src={student.profileImage}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">
                        {student.year}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-3">{student.rollNo}</td>
                <td className="p-3">{student.department}</td>
                <td className="p-3">₹{student.totalFees}</td>
                <td className="p-3">₹{student.concession}</td>

                {/* Paid column → always green */}
                <td className="p-3 text-green-600 font-medium">
                  ₹{student.paid}
                </td>

                <td className="p-3 text-red-500">₹{student.overdue}</td>

                {/* Dynamic Status */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                      student.status,
                    )}`}
                  >
                    {student.status}
                  </span>
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

                {/* Navigate on click */}
                <td className="p-3">
                  <button
                    onClick={() => handleNavigate(student)}
                    className="bg-[#0B56A4] rounded-full p-2 text-white cursor-pointer"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
