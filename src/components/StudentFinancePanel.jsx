import React, { useState } from "react";

import  IndividualDCB  from "./IndividualDCB";
import FeesReceipt from "./FeesReceipt";

export const StudentFinancePanel = ({ student }) => {
  const [activeTab, setActiveTab] = useState("dcb"); // ✅ default first active

  return (
    <div className=" w-full">
      
      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("dcb")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "dcb"
              ? "bg-[#0B56A4] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Individual DCB
        </button>

        <button
          onClick={() => setActiveTab("receipt")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "receipt"
              ? "bg-[#0B56A4] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Fees Receipt
        </button>
      </div>

      {/* Render Component Based on Active Tab */}
      {activeTab === "dcb" && <IndividualDCB student={student} />}
      {activeTab === "receipt" && <FeesReceipt student={student} />}
    </div>
  );
};
