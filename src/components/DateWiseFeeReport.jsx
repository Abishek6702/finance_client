import React from "react";
import { StudentDetails, academicSampleData } from "../data";

export default function DateWiseFeeReport() {
  // Flatten student + fee data
  const tableData = StudentDetails.flatMap((student) =>
    student.fees.map((fee) => ({
      id: `${student.id}-${fee.receiptNo}`,
      name: student.name,
      year: student.year,
      department: student.department,
      rollNo: student.rollNo,
      sem: fee.sem,
      feeHead: fee.feesHead,
      amount: fee.demand,
      date: fee.paymentDate,
      paymentMode: fee.paymentMode,
      bank: fee.bank,
      receiptNo: fee.receiptNo,
      profileImage: student.profileImage,
    }))
  );

  return (
    <>
    {/* filter block */}
    <div>
        <p>lorem ipsum</p>
    </div>
    <div className="bg-white rounded-xl border border-gray-300  h-[calc(100vh-35vh)] overflow-auto ">
      <table className="w-full h-full text-left   ">
        {/* Header */}
        <thead className="bg-gray-100 text-gray-700 sticky top-0 z-5">
          <tr>
            <th className="p-4">Student Details</th>
            <th>Roll Number</th>
            <th>Sem Period</th>
            <th>Fee Head</th>
            <th>Amount</th>
            <th className="text-center">Date</th>
            <th className="text-center">Payment Mode</th>
            <th >Bank</th>
            <th className="text-center">Receipt Number</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="">
          {tableData.map((item) => (
            <tr key={item.id} className=" hover:bg-gray-50">
              
              {/* Student Details */}
              <td className="p-4 flex items-center gap-3">
                <img
                  src={item.profileImage}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.year} / {item.department}
                  </p>
                </div>
              </td>

              <td>{item.rollNo}</td>
              <td>{item.sem} Sem</td>
              <td>{item.feeHead}</td>
              <td className="font-medium">₹{item.amount}</td>
              <td className="text-center">{item.date}</td>
              <td className="text-center">{item.paymentMode}</td>
              <td>{item.bank}</td>
              <td className="text-center">{item.receiptNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
