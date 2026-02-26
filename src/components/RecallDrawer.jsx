import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const RecallDrawer = ({ isOpen, onClose, payment }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Reason is required");
      return;
    }

    setError(""); // clear error

    const payload = {
      paymentId: payment.id,
      name: payment.name,
      receipt: payment.receipt,
      amount: payment.amount,
      reason: reason.trim(),
    };

    console.log("Recall Request Data:", payload);
    toast.success("Recall Requested")

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-[25%] m-2 rounded-xl  bg-white shadow-2xl overflow-y-auto animate-slideIn">
        <div className="border-b border-b-gray-300 w-full ">
          <div className="flex justify-between items-center  p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Request for Re-call
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
            <div className="flex items-center gap-3">
              <img
                src={payment.avatar}
                className="w-12 h-12 rounded-full object-cover"
                alt=""
              />
              <div>
                <div className="font-semibold">{payment.name}</div>
                <div className="text-sm text-gray-500">{payment.sub}</div>
              </div>
            </div>

            {/* content */}
            {/* Details Section */}
            <div className="grid grid-cols-[150px_1fr] gap-x-15 gap-y-3 text-[15px]">
              <span className="text-gray-600">Receipt Number</span>
              <span className="font-medium text-gray-800">
                {payment.receipt}
              </span>

              <span className="text-gray-600">Roll Number</span>
              <span className="font-medium text-gray-800">{payment.roll}</span>

              <span className="text-gray-600">Sem Period</span>
              <span className="font-medium text-gray-800">
                {payment.semPeriod}
              </span>

              <span className="text-gray-600">Fees Head</span>
              <span className="font-medium text-gray-800">{payment.head}</span>

              <span className="text-gray-600">Amount</span>
              <span className="font-medium text-gray-800">
                {payment.amount}
              </span>

              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-800">{payment.date}</span>

              <span className="text-gray-600">Payment Mode</span>
              <span className="font-medium text-gray-800">{payment.mode}</span>

              <span className="text-gray-600">Bank Name</span>
              <span className="font-medium text-gray-800">{payment.bank}</span>
            </div>

            {/* Reason Section */}
            <div className="space-y-1 pt-1.5">
              <label className="text-gray-700 font-medium">
                Reason for Re-call :
              </label>

              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError(""); // remove error while typing
                }}
                placeholder="write a reason here"
                className={`w-full h-24 mt-1 border rounded-xl p-2 resize-none focus:outline-none ${
                  error
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-[#0b56a4]"
                }`}
              />

              {error && <p className="text-red-500 text-sm ">{error}</p>}
            </div>

            <button
              className=" w-full bg-[#0b56a4] cursor-pointer hover:bg-[#074c96] text-white py-2 rounded-lg "
              onClick={handleSubmit}
            >
              Confirm Recall
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecallDrawer;
