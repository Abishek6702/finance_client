import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import nodata from "../assets/nodata.svg";
import RecallDrawer from "./RecallDrawer";

const PaymentTable = ({ data }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const RecallOpen = (item) => {
    setSelectedPayment(item);
    setIsModalOpen(true);
  };

  return (
    <div>
        <div className="w-full bg-white rounded-2xl shadow  ">
        {/* Horizontal Scroll */}
        <div className="overflow-x-auto ">
          {/* Vertical Scroll */}
          <div className="max-h-[calc(100vh-230px)] overflow-y-auto custom-scrollbar relative  rounded-xl">
            <table className="border-collapse w-full table-fixed">
              <colgroup>
                <col className="w-45" />
                <col className="w-30" />
                <col className="w-30" />
                <col className="w-40" />
                <col className="w-30" />
                <col className="w-30" />
                <col className="w-40" />
                <col className="w-30" />
                <col className="w-45" />
                <col className="w-20" />
              </colgroup>
              <thead className="sticky top-0 z-30 bg-[#F0F0F0]">
                <tr>
                  <th className="p-3 text-center font-semibold sticky left-0 bg-[#F0F0F0] z-40">
                    Student Details
                  </th>

                  {[
                    "Roll Number",
                    "Sem Period",
                    "Fee Head",
                    "Amount",
                    "Date",
                    "Payment Mode",
                    "Bank",
                    "Receipt Number",
                  ].map((header) => (
                    <th key={header} className="p-3 text-center font-semibold">
                      {header}
                    </th>
                  ))}

                  <th className="sticky right-0 bg-[#F0F0F0] p-3 font-semibold text-right z-40 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.1)]"></th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3 sticky left-0 bg-white z-20">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          alt=""
                        />
                        <div>
                          <div className="font-medium whitespace-nowrap">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.sub}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-center">{item.roll}</td>
                    <td className="p-3 text-center">{item.semPeriod}</td>
                    <td className="p-3 text-center">{item.head}</td>
                    <td className="p-3 text-center">{item.amount}</td>
                    <td className="p-3 text-center">{item.date}</td>
                    <td className="p-3 text-center">{item.mode}</td>
                    <td className="p-3 text-center">{item.bank}</td>
                    <td className="p-3 text-center">{item.receipt}</td>

                    <td className="sticky right-0 bg-white p-3 text-right z-20 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.1)]">
                      <button
                        disabled={item.isrecallrequested}
                        onClick={() =>
                          !item.isrecallrequested && RecallOpen(item)
                        }
                        className={`p-2 rounded-full transition-all ${
                          item.isrecallrequested
                            ? "bg-[#0B56A4]/50 text-white cursor-not-allowed"
                            : "bg-[#0B56A4] text-white hover:bg-[#084482] cursor-pointer"
                        }`}
                      >
                        <RotateCcw size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                <img src={nodata} alt="No data" className="w-50 " />
                              <p className="text-gray-500">No results found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <>
          <RecallDrawer
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            payment={selectedPayment}
          />
        </>
      )}
    </div>
  );
};

export default PaymentTable;