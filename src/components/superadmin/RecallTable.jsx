import React, { useMemo, useState } from "react";
import { Check, MoveUpRight, Search, X } from "lucide-react";
import toast from "react-hot-toast";

const RecallTable = ({ activeTab, payments, onView, onApprove, onReject,filters,searchTerm }) => {


  const filteredData = useMemo(() => {
    return payments
      // Filter by status tab
      .filter(
        (item) =>
          item.Status.toLowerCase() === activeTab.toLowerCase()
      )
  
      // Search filter
      .filter((item) => {
        if (!searchTerm) return true;
  
        const term = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(term) ||
          item.roll.toLowerCase().includes(term) ||
          item.receipt.toLowerCase().includes(term)
        );
      })
  
      // Year filter
      .filter((item) => {
        if (!filters.year) return true;
  
        const [year] = item.sub.split(" / ");
        return year === filters.year;
      })
  
      // Department filter
      .filter((item) => {
        if (!filters.dept) return true;
  
        const [, dept] = item.sub.split(" / ");
        return dept === filters.dept;
      })
  
      // From date filter
      .filter((item) =>
        filters.fromDate
          ? item.raisedOn >= filters.fromDate
          : true
      )
  
      // To date filter
      .filter((item) =>
        filters.toDate
          ? item.raisedOn <= filters.toDate
          : true
      );
  }, [payments, activeTab, filters, searchTerm]);





  return (
    <div className="bg-[#F8F9FB] p-4 rounded-2xl">
      <div className="w-full bg-white rounded-2xl shadow  ">
        {/* Horizontal Scroll */}
        <div className="overflow-x-auto ">
          {/* Vertical Scroll */}
          <div className="max-h-[calc(100vh-230px)] overflow-y-auto custom-scrollbar relative  rounded-xl">
            <table className="border-collapse w-full">
              <thead className="sticky top-0 z-30 bg-[#F0F0F0]">
                <tr>
                  <th className="p-3 text-center font-semibold sticky left-0 bg-[#F0F0F0] z-40">
                    Student Details
                  </th>

                  {["Roll Number", "Receipt Number", "Raised On", "Reason"].map(
                    (header) => (
                      <th
                        key={header}
                        className="p-3 text-center font-semibold whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ),
                  )}
                  {activeTab === "approved" && (
                    <th className="p-3 text-center font-semibold w-30">
                      Approved On
                    </th>
                  )}
                  {activeTab === "rejected" && (
                    <th className="p-3 text-center font-semibold w-30">
                      Rejected On
                    </th>
                  )}
                  {activeTab === "rejected" && (
                    <th className="p-3 text-center font-semibold w-30">
                      Rejected Reason
                    </th>
                  )}

                  {/* Show Action header only for Pending */}
                  {activeTab === "pending" && (
                    <th className="p-3 text-center font-semibold w-30">
                      Action
                    </th>
                  )}

                  <th className="sticky right-0 bg-[#F0F0F0] p-3 w-17.5 z-40"></th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {filteredData.map((item) => (
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
                    <td className="p-3 text-center">{item.receipt}</td>
                    <td className="p-3 text-center">{item.raisedOn}</td>
                    <td className="p-3 max-w-62.5">
                      <div
                        className="truncate cursor-pointer"
                        title={item.Reasonforrecall}
                      >
                        {item.Reasonforrecall}
                      </div>
                    </td>
                    {activeTab === "pending" && (
                      <>
                        <td className="">
                          <div className="bg-[#f3f8fe] w-18.5 m-auto rounded-xl flex items-center gap-2 p-2 text-white ">
                            <div
                              className="bg-[#2eb67d] rounded-full m-auto p-0.5 cursor-pointer"
                              onClick={() => onApprove(item)}
                            >
                              <Check className="w-4 h-4" />
                            </div>
                            <div
                              className="bg-[#f94144] rounded-full m-auto p-0.5 cursor-pointer"
                              onClick={() => onReject(item)}
                            >
                              <X className="w-4 h-4" />
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                    {activeTab === "approved" && (
                      <>
                        <td className="p-3 text-center w-35">
                          {item.ApprovedOn}
                        </td>
                      </>
                    )}
                    {activeTab === "rejected" && (
                      <>
                        <td className="p-3 text-center w-35">
                          {item.RejectedOn}
                        </td>
                      </>
                    )}
                    {activeTab === "rejected" && (
                      <>
                        <td className="p-3 max-w-62.5">
                          <div
                            className="truncate cursor-pointer"
                            title={item.Rejectreason}
                          >
                            {item.Rejectreason}
                          </div>
                        </td>
                      </>
                    )}

                    <td className="sticky right-0 bg-white p-3 text-center w-17.5 z-20">
                      <button
                        onClick={() => onView(item)}
                        className={`p-2 rounded-full transition-all ${"bg-[#0B56A4] text-white hover:bg-[#084482] cursor-pointer"}`}
                      >
                        <MoveUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                <Search size={48} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">No results found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default RecallTable;
