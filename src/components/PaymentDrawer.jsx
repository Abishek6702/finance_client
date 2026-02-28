import React from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
const PaymentDrawer = ({
  show,
  onClose,
  selectedStudent,
  enteredRows,
  totalAmount,
}) => {
  if (!show) return null;
  const handleBilling = () => {
    toast.success("Billing successful!");
    onClose();
    window.location.reload();
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-[25%] bg-white h-[97vh] shadow-2xl p-6 overflow-y-auto m-2 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Payment Summary</h2>
          <div
            className="bg-gray-100 text-gray-600 rounded-full p-1 cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </div>
        </div>

        {/* Student Info */}
        <div className="mb-6 flex justify-between items-center ">
          <div className="flex items-center gap-2">
            <img
              src={selectedStudent?.img || ""}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="">
              <p className="font-medium">{selectedStudent.name}</p>
              <p className="text-sm text-gray-500">
                {selectedStudent.year} / {selectedStudent.dept}
              </p>
            </div>
          </div>
          <p className="text-gray-500">{selectedStudent.id}</p>
        </div>

        {/* Entered Rows */}
        <div className="space-y-3 overflow-auto max-h-40">
          {enteredRows.map((row, index) => (
            <div
              key={index}
              className="flex justify-between border-b border-gray-300 pb-2"
            >
              <span>{row.feeHead}</span>
              <span className="font-semibold mr-2">₹{row.enteredAmount}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 flex justify-between text-lg font-semibold">
          <span>Total Payable</span>
          <span>₹{totalAmount}</span>
        </div>

        {/* Close Button */}
        <button
          onClick={handleBilling}
          className="mt-6 w-full py-2 bg-[#0b56a4] text-white cursor-pointer rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PaymentDrawer;
