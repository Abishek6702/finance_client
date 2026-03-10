import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import nodata from "../assets/nodata.svg";
import RecallDrawer from "./RecallDrawer";

const PaymentTable = ({ data, loading, loadingMore, loadMore }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatYear = (year) => {
    const labels = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th" };
    return labels[year] ? `${labels[year]} year` : `${year} year`;
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollHeight - scrollTop <= clientHeight + 50) {
      loadMore();
    }
  };

  return (
    <div className="h-full">

      <div className="w-full bg-white rounded-2xl shadow-sm h-full flex flex-col overflow-hidden border border-gray-100">

        <div className="overflow-x-auto">

          <div
            className="max-h-[calc(100vh-320px)] overflow-y-auto"
            onScroll={handleScroll}
          >

            <table className="w-full table-fixed border-separate border-spacing-0">

              <colgroup>
                <col className="w-56" />
                <col className="w-32" />
                <col className="w-32" />
                <col className="w-40" />
                <col className="w-32" />
                <col className="w-40" />
                <col className="w-32" />
                <col className="w-32" />
                <col className="w-44" />
                <col className="w-20" />
              </colgroup>

              <thead className="sticky top-0 z-30">

                <tr className="bg-[#F8F9FA]">

                  <th className="p-4 text-left font-semibold sticky left-0 bg-[#F8F9FA] border-b border-gray-100 z-40">
                    Student Details
                  </th>

                  <th className="p-4 text-center font-semibold">Roll Number</th>
                  <th className="p-4 text-center font-semibold">Sem</th>
                  <th className="p-4 text-center font-semibold">Fee Head</th>
                  <th className="p-4 text-center font-semibold">Amount</th>
                  <th className="p-4 text-center font-semibold">Date</th>
                  <th className="p-4 text-center font-semibold">Payment Mode</th>
                  <th className="p-4 text-center font-semibold">Bank</th>
                  <th className="p-4 text-center font-semibold">Receipt</th>

                  <th className="p-4 sticky right-0 bg-[#F8F9FA] border-b border-gray-100 z-40"></th>

                </tr>

              </thead>

              <tbody className="bg-white">

                {data.map((item) => (

                  <tr key={item.id}>

                    <td className="p-4 sticky left-0 bg-white">

                      <div className="flex items-center gap-3">

                        <img
                          src={item.avatar}
                          className="w-10 h-10 rounded-full object-cover border border-gray-100"
                          alt=""
                        />

                        <div className="flex flex-col">

                          <span className="font-medium">{item.name}</span>

                          <span className="text-sm">
                            {formatYear(item.year)} / {item.dept} {'-'}{item.section}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center">{item.roll}</td>

                    <td className="p-4 text-center">
                      {item.semPeriod % 2 === 1 ? "Odd" : "Even"}
                    </td>

                    <td className="p-4 text-center">{item.head}</td>

                    <td className="p-4 text-center">
                      ₹{item.amount?.toLocaleString()}
                    </td>

                    <td className="p-4 text-center">
                      {new Date(item.date).toLocaleDateString("en-GB")}
                    </td>

                    <td className="p-4 text-center">{item.mode}</td>

                    <td className="p-4 text-center">
                      {item.bank === "-" ? "N/A" : item.bank}
                    </td>

                    <td className="p-4 text-center">{item.receipt}</td>

                    <td className="p-4 text-right sticky right-0 bg-white">

                      <button
                        className="p-2.5 bg-[#0B56A4] hover:bg-[#08417a] text-white rounded-full"
                        onClick={() => {
                          setSelectedPayment(item);
                          setIsModalOpen(true);
                        }}
                      >
                        <RotateCcw size={14} />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {loadingMore && (
              <div className="py-4 text-center text-gray-400 text-sm">
                Loading more payments...
              </div>
            )}

            {!loading && data.length === 0 && (
              <div className="py-24 flex flex-col items-center">
                <img src={nodata} className="w-32 opacity-20" alt="" />
                <p className="text-gray-400 mt-4">No transactions found</p>
              </div>
            )}

          </div>

        </div>

      </div>

      {isModalOpen && (
        <RecallDrawer
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          payment={selectedPayment}
        />
      )}

    </div>
  );
};

export default PaymentTable;