import React, { useState } from "react";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";

const RecallDrawer = ({ isOpen, onClose, data, onApprove, onReject }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!rejectReason.trim()) {
      setError("Reason is required");
      return;
    }

    setError(""); // clear error

    const payload = {
      dataId: data.id,
      name: data.name,
      receipt: data.receipt,
      amount: data.amount,
      reason: rejectReason.trim(),
    };

    console.log("Recall Request Data:", payload);
    toast.success("Recall Requested");

    onClose();
  };
  const getStatusStyles = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";

    const normalized = status.toLowerCase();

    if (normalized === "approved") return "bg-[#F3FCF7] text-[#44CF7D]";

    if (normalized === "rejected") return "bg-[#FCEAEE] text-[#ED6C83]";

    if (normalized === "pending") return "bg-[#FFF6EA] text-[#FFA02D]";

    return "bg-gray-100 text-gray-600";
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

        {data && (
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={data.avatar}
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <div className="font-semibold">{data.name}</div>
                  <div className="text-sm text-gray-500">{data.sub}</div>
                </div>
              </div>
              {data?.Status?.toLowerCase() !== "pending" && (
                <div>
                  <p className="p-3 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-md text-sm font-medium ${getStatusStyles(
                        data.Status,
                      )}`}
                    >
                      {data.Status}
                    </span>
                  </p>
                </div>
              )}
              {data?.Status?.toLowerCase() === "pending" && (
                <div className="bg-[#f3f8fe] w-18.5 rounded-xl flex items-center gap-2 p-2 text-white">
                  <div
                    className="bg-[#2eb67d] rounded-full p-1 cursor-pointer"
                    onClick={() => onApprove(data)}
                  >
                    <Check className="w-4 h-4" />
                  </div>
                  <div
                    className="bg-[#f94144] rounded-full p-1 cursor-pointer"
                    onClick={() => onReject(data)}
                  >
                    <X className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>

            {/* content */}
            {/* Details Section */}
            <div className="grid grid-cols-[150px_1fr] gap-x-15 gap-y-3 text-[15px]">
              <span className="text-gray-600">Receipt Number</span>
              <span className="font-medium text-gray-800">{data.receipt}</span>

              <span className="text-gray-600">Roll Number</span>
              <span className="font-medium text-gray-800">{data.roll}</span>

              <span className="text-gray-600">Sem Period</span>
              <span className="font-medium text-gray-800">
                {data.semPeriod}
              </span>

              <span className="text-gray-600">Fees Head</span>
              <span className="font-medium text-gray-800">{data.head}</span>

              <span className="text-gray-600">Amount</span>
              <span className="font-medium text-gray-800">{data.amount}</span>

              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-800">{data.date}</span>

              <span className="text-gray-600">data Mode</span>
              <span className="font-medium text-gray-800">{data.mode}</span>

              <span className="text-gray-600">Bank Name</span>
              <span className="font-medium text-gray-800">{data.bank}</span>
            </div>
            <div className="text-[15px] mt-4">
              <p className="font-medium text-gray-800">Reason for Re-call : </p>
              <p className="text-gray-600">{data.Reasonforrecall}</p>
            </div>

            {data.Status == "Rejected" && (
              <>
                <div className="border-t border-gray-300"></div>
                <div className="text-[15px]">
                  <p className="font-medium text-gray-800">
                    Reason for Rejected :{" "}
                  </p>
                  <p className="text-gray-600">{data.Rejectreason}</p>
                </div>
              </>
            )}
            {/* Reason Section
            {data.Status === "Pending" && (
              <>
                <div className="space-y-1 pt-1.5">
                  <label className="text-gray-700 font-medium">
                    Reason for Re-call rejection :
                  </label>

                  <textarea
                    value={rejectReason}
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
                
              </>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecallDrawer;
