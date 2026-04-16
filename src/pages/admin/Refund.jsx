import React, { useState } from "react";
import RefundTab from "./RefundTab.jsx";
import WalletToRefund from "./WalletToRefund.jsx";
import AcknowledgedTab from "./AcknowledgedTab.jsx";

const Refund = () => {
  const [activeTab, setActiveTab] = useState("refund");

  const renderTab = () => {
    switch (activeTab) {
      case "wallet":
        return <WalletToRefund />;
      case "acknowledged":
        return <AcknowledgedTab />;
      case "refund":
      default:
        return <RefundTab />;
    }
  };

  const tabStyle = (tab) =>
    `px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
      activeTab === tab
        ? "bg-blue-600 text-white shadow"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;

  return (
    <div className="overflow-hidden">
    


      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("refund")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
            activeTab === "refund"
              ? "bg-[#1F5AA6] text-white shadow-md"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Refund
        </button>

        <button
          onClick={() => setActiveTab("wallet")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
            activeTab === "wallet"
              ? "bg-[#1F5AA6] text-white shadow-md"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Wallet To Refund
        </button>
        <button
          onClick={() => setActiveTab("acknowledged")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
            activeTab === "acknowledged"
              ? "bg-[#1F5AA6] text-white shadow-md"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Acknowledgement
        </button>
      </div>

      {/* Content */}
      <div className=" h-[calc(100vh-200px)]">
        {renderTab()}
      </div>
    </div>
  );
};

export default Refund;