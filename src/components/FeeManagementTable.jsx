import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Dayscholar from '../assets/dayscholar.svg';
import Hostel from '../assets/hostel.svg';
import Transport from '../assets/transport.svg';

export default function FeeManagementTable({ data, selectedIds, setSelectedIds }) {
  const navigate = useNavigate();

  const handleNavigate = (student) => {
    navigate(`/admin/fees_management/${student.id}`, {
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
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusStyles = (status) => {
    const normalized = status.toLowerCase();
    if (normalized === "paid") return "bg-green-100 text-green-700";
    if (normalized === "partial") return "bg-orange-100 text-orange-700";
    if (normalized === "overdue") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const getTypeImage = (type) => {
    if (type === "Hostel") return Hostel;
    if (type === "Dayscholar") return Dayscholar;
    if (type === "Transport") return Transport;
    return null;
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow">
      <div className="max-h-[calc(100vh-260px)] overflow-auto rounded-2xl">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-12" /> 
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

          <thead className="sticky top-0 z-30">
            <tr className="bg-[#F0F0F0]">
              <th className="p-3 sticky left-0 bg-[#F0F0F0] z-40">
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedIds.length === data.length}
                    onChange={toggleSelectAll}
                    className="p-4"
                  />
                </div>
              </th>
              <th className="p-3 text-center font-semibold sticky left-12 bg-[#F0F0F0] z-40">
                Student Details
              </th>
              {[
                "Roll Number",
                "Department",
                "Total Fees",
                "Concession",
                "Paid",
                "Overdue",
                "Status",
                "Type",
              ].map((header) => (
                <th key={header} className="p-3 text-center font-semibold">
                  {header}
                </th>
              ))}
              <th className="p-3 sticky right-0 bg-[#F0F0F0] z-40"></th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {data.map((student) => (
              <tr key={student.id} className="">
                <td className="p-3 sticky left-0 bg-white z-10">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student.id)}
                      onChange={() => toggleSelect(student.id)}
                      className="p-4"
                    />
                  </div>
                </td>
                
                <td className="p-3 sticky left-12 bg-white z-10">
                  <div className="flex gap-3 items-center">
                    <img
                      src={student.profileImage}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">
                        {student.year} / {student.department}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-3 text-center">{student.rollNo}</td>
                <td className="p-3 text-center">{student.department}</td>
                <td className="p-3 text-center">₹{student.totalFees}</td>
                <td className="p-3 text-center">₹{student.concession}</td>
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
                  <div className="flex justify-center items-center">
                    <img
                      src={getTypeImage(student.type)}
                      alt={student.type}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </td>

                <td className="p-3 sticky right-0 bg-white z-10 text-center">
                  <button
                    onClick={() => handleNavigate(student)}
                    className="bg-[#0B56A4] rounded-full p-2 text-white cursor-pointer inline-flex items-center justify-center"
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