import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import Dayscholar from "../assets/dayscholar.svg";
import Hostel from "../assets/hostel.svg";
import Transport from "../assets/transport1.svg";

export default function FeeManagementTable({
  data = [],
  selectedIds = [],
  setSelectedIds,
}) {
  const navigate = useNavigate();

  const handleNavigate = (student) => {
    console.log("Navigating with rollNo:", student.rollNo);
    navigate(`/admin/fees_management/${student.rollNo}`, {
      state: { student },
    });
  };

  const toggleSelectAll = () => {
    if (data.length > 0 && selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((student) => student.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const getStatusStyles = (status) => {
    const normalized = status?.toLowerCase();

    if (normalized.includes("paid") && !normalized.includes("partial"))
      return "bg-green-100 text-green-700";

    if (normalized.includes("partial"))
      return "bg-orange-100 text-orange-700";

    if (normalized.includes("unpaid"))
      return "bg-red-100 text-red-700";

    return "bg-gray-100 text-gray-700";
  };

  const getStudentImages = (student) => {
    if (student.ishostler) return [Hostel];

    const images = [];

    if (student.isdayscholer) images.push(Dayscholar);

    if (student.iscollegetransport) images.push(Transport);

    return images;
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow">
      <div className="max-h-[calc(100vh-260px)] overflow-auto rounded-2xl">
        <table className="w-full">

          <thead className="sticky top-0 z-30">
            <tr className="bg-[#F0F0F0]">

              <th className="p-3">
                <input
                  type="checkbox"
                  checked={
                    data?.length > 0 &&
                    selectedIds?.length === data?.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>

              <th className="p-3 text-center font-semibold">
                Student Details
              </th>

              <th className="p-3 text-center font-semibold">
                Roll Number
              </th>

              <th className="p-3 text-center font-semibold">
                Department
              </th>

              <th className="p-3 text-center font-semibold">
                Total Fees
              </th>

              <th className="p-3 text-center font-semibold">
                Concession
              </th>

              <th className="p-3 text-center font-semibold">
                Paid
              </th>

              <th className="p-3 text-center font-semibold">
                Overdue
              </th>

              <th className="p-3 text-center font-semibold">
                Status
              </th>

              <th className="p-3 text-center font-semibold">
                Type
              </th>

              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>

            {data?.map((student, index) => (
              <tr key={student.id || student.rollNo || index}>

                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(student.id)}
                    onChange={() => toggleSelect(student.id)}
                  />
                </td>

                <td className="p-3">
                  <div className="flex gap-3 items-start ">

                    <img
                      src={student.profileImage}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />

                    <div>
                      <div className="font-medium ">
                        {student.name}
                      </div>

                      <div className="text-sm text-gray-500 ">
                        {student.year} / {student.department}
                      </div>
                    </div>

                  </div>
                </td>

                <td className="p-3 text-center">
                  {student.rollNo}
                </td>

                <td className="p-3 text-center">
                  {student.department}
                </td>

                <td className="p-3 text-center">
                  ₹{student.totalFees}
                </td>

                <td className="p-3 text-center">
                  ₹{student.concession}
                </td>

                <td className="p-3 text-green-600 font-medium text-center">
                  ₹{student.paid}
                </td>

                <td className="p-3 text-red-500 text-center">
                  ₹{student.overdue}
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                      student.status
                    )}`}
                  >
                    {student.status}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    {getStudentImages(student).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        className="w-6 h-6"
                        alt="student type"
                      />
                    ))}
                  </div>
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => handleNavigate(student)}
                    className="bg-[#0B56A4] rounded-full p-2 text-white"
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