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
        <div className="">
          <div className="bg-white rounded-xl border border-gray-300 h-[calc(100vh-40vh)] overflow-auto shadow-sm">
                  <table className="w-full border-collapse table-fixed">
                    <colgroup>
                      <col className="w-[22%]" />
                      <col className="w-[10%]" />
                      <col className="w-[10%]" />
                      <col className="w-[12%]" />
                      <col className="w-[10%]" />
                      <col className="w-[12%]" />
                      <col className="w-[10%]" />
                      <col className="w-[7%]" />
                      <col className="w-[12%]" />
                    </colgroup>
          
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="p-4 font-semibold text-center">Student Details</th>
                        <th className="font-semibold text-center">Roll Number</th>
                        <th className="font-semibold text-center">Sem Period</th>
                        <th className="font-semibold text-center">Fee Head</th>
                        <th className="font-semibold text-center">Amount</th>
                        <th className="font-semibold text-center">Date</th>
                        <th className="font-semibold text-center">Payment Mode</th>
                        <th className="font-semibold text-center">Bank</th>
                        <th className="font-semibold text-center">Receipt Number</th>
                      </tr>
                    </thead>
          
                    <tbody>
                      {/* {filteredData.length > 0 ? (
                        filteredData.map((item) => ( */}
                          <tr >
                            <td className="pl-4 py-4">``
                              <div className="flex items-center gap-3">
                                <img
                                  src={"item.student.studentPhoto" || "/default-avatar.png"}
                                  alt={"Abishek's Photo"}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <p>{"Abishek"}</p>
                                  <p className="text-gray-500">
                                   1st year / ECE -{" "}
                                    A
                                  </p>
                                </div>
                              </div>
                            </td>
          
                            <td className="text-center">123</td>
                            <td className="text-center">2nd Sem</td>
                            <td className="text-center">Academic</td>
                            <td className="text-center">₹45,000</td>
                            <td className="text-center">11/11/2023</td>
                            <td className="text-center">bank</td>
                            <td className="text-center">IOB</td>
                            <td className="text-center">123456</td>
                          </tr>
                      {/* ) : (
                        <tr>
                          <td colSpan="9" className="text-center py-20 text-gray-400">
                            <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                              <img src={nodata} alt="No data" className="w-50 " />
                              <p className="text-gray-500">No results found.</p>
                            </div>
                          </td>
                        </tr>
                      )} */}
                    </tbody>
                    <tfoot className="bg-gray-100 sticky bottom-0 z-10">
                      <tr>
                        <td colSpan="8" className="text-right font-semibold py-3 pr-4">
                          Total :
                        </td>
                        <td className="text-center font-semibold text-green-700 text-lg ">
                          ₹1,100000
                        </td>
                        <td colSpan="4"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
        </div>
      </div>
    </>
  );
};

export default ClassWiseFeeReport;
