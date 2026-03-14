import React from "react";
import ClassWiseFeeReportFilter from "./ClassWiseFeeReportFilter.jsx";
import { Download } from "lucide-react";

const ClassWiseFeeReport = () => {
  return (
    <>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <ClassWiseFeeReportFilter />

          <button className="bg-[#1F5AA6] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#174a8c] transition-all shadow-sm active:scale-95 h-[42px]">
            <Download size={18} />
        <span className="font-medium text-sm">Export Data</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ClassWiseFeeReport;
