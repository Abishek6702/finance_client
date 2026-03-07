import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const RecallDetail = ({ isOpen, onClose, payment }) => {
  if (!isOpen) return null;

  

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-[25%] m-2 rounded-xl  bg-white shadow-2xl overflow-y-auto animate-slideIn">
        <div className="border-b border-b-gray-300 w-full ">
          <div className="flex justify-between items-center  p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Re-call Details
            </h2>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors rounded-full p-1.5"
              >
                <X className="w-4 h-4 text-gray-600 hover:text-black" />
              </button>
            </div>
          </div>
        </div>

        {payment && (
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={payment.avatar}
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <div className="font-semibold">{payment.name}</div>
                  <div className="text-sm text-gray-500">{payment.year} Year / {payment.departmentName} - {payment.section}</div>
                </div>
              </div>
             
            </div>

            {/* content */}
            {/* Details Section */}
            <div className="grid grid-cols-[150px_1fr] gap-x-13 gap-y-3 text-[15px]">
              <span className="text-gray-600">Receipt Number</span>
              <span className="font-medium text-gray-800">
                {payment.receipt}
              </span>

              <span className="text-gray-600">Roll Number</span>
              <span className="font-medium text-gray-800">{payment.roll}</span>

              <span className="text-gray-600">Sem Period</span>
              <span className="font-medium text-gray-800">
                {payment.sem}
              </span>

              <span className="text-gray-600">Fees Head</span>
              <span className="font-medium text-gray-800">{payment.head}</span>

              <span className="text-gray-600">Amount</span>
              <span className="font-medium text-gray-800">
                {payment.amount}
              </span>

              <span className="text-gray-600">Raised On</span>
              <span className="font-medium text-gray-800">
                {payment.raisedOn}
              </span>
              

              

              <span className="text-gray-600">Payment Mode</span>
              <span className="font-medium text-gray-800">{payment.mode}</span>

              <span className="text-gray-600">Bank Name</span>
              <span className="font-medium text-gray-800">{payment.bank}</span>
            </div>

            <div className="text-[15px] mt-4">
              <p className="font-medium text-gray-800">Reason for Re-call : </p>
              <p className="text-gray-600">{payment.Reasonforrecall}</p>
            </div>

            
          </div>
        )}
      </div>
    </div>
  );
};

export default RecallDetail;
