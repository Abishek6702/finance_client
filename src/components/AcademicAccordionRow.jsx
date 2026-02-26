import React from "react";

const AcademicAccordionRow = ({ row }) => {
  return (
    <tr className="bg-gray-50">
      <td colSpan="12" className="px-6 py-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Class</p>
              <p className="font-medium">{row.class}</p>
            </div>

            <div>
              <p className="text-gray-500">Community</p>
              <p className="font-medium">{row.community}</p>
            </div>

            <div>
              <p className="text-gray-500">Semester</p>
              <p className="font-medium">{row.semester}</p>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default AcademicAccordionRow;