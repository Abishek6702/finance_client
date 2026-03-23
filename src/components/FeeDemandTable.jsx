import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, RefreshCcw } from "lucide-react";

import Dayscholar from "../assets/dayscholar.svg";
import Hostel from "../assets/hostel.svg";
import Transport from "../assets/transport1.svg";

export default function FeeDemandTable({
  data = [],
  selectedIds = [],
  setSelectedIds,
  onRowClick,
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



 const getStudentImages = (student) => {
  console.log("fee demand image", student);

  // Highest priority
  if (student.ishostler) {
    return [Hostel];
  }

  // Transport overrides dayscholar
  if (student.iscollegetransport) {
    return [Transport];
  }

  // Only dayscholar
  if (student.isdayscholer) {
    return [Dayscholar];
  }

  return [];
};

  return (
    <div className="w-full bg-white rounded-2xl  ">
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
                Year
              </th><th className="p-3 text-center font-semibold">
                Section
              </th>

            
              <th className="p-3 text-center font-semibold">
                Type
              </th>

              <th className="p-3 text-center font-semibold">
                Change Status    </th>
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

                <td className="p-3  ">
                  <div className="flex gap-3   items-center ">

                    <img
                      src={student.profileImage}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />

                    <div>
                      <div className="font-medium ">
                        {student.name}
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
                  {student.year}
                </td>
                <td className="p-3 text-center">
                  {student.section}
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
                    className="bg-[#0B56A4] cursor-pointer rounded-full p-2 text-white"
                    onClick={()=>onRowClick(student)}
                  >
                    <RefreshCcw className="w-5 h-5" />
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