import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { ApiRequest } from "../utils/ApiRequest";

// ADDED: onSuccess to the props destructuring
const RecallDrawer = ({ isOpen, onClose, payment, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Reason is required");
      return;
    }

    setError("");
    setLoading(true);

    const payload = {
      receiptNo: payment.receipt,
      rollNo: payment.roll,
      reason: reason.trim(),
      feeHeadIds: [payment.breakdownId], 
    };

    try {
      const response = await ApiRequest("/api/receiptRecall", "POST", payload);

      if (response.success) {
        toast.success("Recall processed successfully");
        setReason("");
        
        // Safety check: Only call onSuccess if it was actually passed as a prop
        if (onSuccess) {
          await onSuccess();
        }
        
        onClose();
      } else {
        toast.error(response.message || "Recall failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to process recall");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-[25%] m-2 rounded-xl bg-white shadow-2xl overflow-y-auto animate-slideIn">
        
        {/* Header */}
        <div className="border-b border-gray-300">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Request for Re-call
            </h2>

            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors rounded-full p-1.5"
            >
              <X className="w-4 h-4 text-gray-600 hover:text-black" />
            </button>
          </div>
        </div>

        {payment && (
          <div className="space-y-4 p-4">
            
            {/* Student Info */}
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

            {/* Payment Details */}
            <div className="grid grid-cols-[150px_1fr] gap-x-12 gap-y-3 text-[15px]">
              <span className="text-gray-600">Receipt Number</span>
              <span className="font-medium text-gray-800">{payment.receipt}</span>

              <span className="text-gray-600">Roll Number</span>
              <span className="font-medium text-gray-800">{payment.roll}</span>

              <span className="text-gray-600">Sem Period</span>
              <span className="font-medium text-gray-800">{payment.semPeriod}</span>

              <span className="text-gray-600">Fees Head</span>
              <span className="font-medium text-gray-800">{payment.head}</span>

              <span className="text-gray-600">Amount</span>
              <span className="font-medium text-gray-800">₹{payment.amount}</span>

              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-800">
                {new Date(payment.date).toLocaleDateString()}
              </span>
            </div>

            {/* Reason */}
            <div className="space-y-1 pt-2">
              <label className="text-gray-700 font-medium">
                Reason for Re-call :
              </label>

              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Write a reason here..."
                className={`w-full h-24 mt-1 border rounded-xl p-2 resize-none focus:outline-none ${
                  error
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:ring-1 focus:ring-[#0b56a4]"
                }`}
              />

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0b56a4] hover:bg-[#074c96] cursor-pointer"
              }`}
            >
              {loading ? "Submitting..." : "Confirm Recall"}
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default RecallDrawer;