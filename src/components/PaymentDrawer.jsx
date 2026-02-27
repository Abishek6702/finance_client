import React from "react";

const PaymentDrawer = ({
  show,
  onClose,
  selectedStudent,
  enteredRows,
  totalAmount,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-[25%] bg-white h-[97vh] shadow-2xl p-6 overflow-y-auto m-2 rounded-xl">
        
        <h2 className="text-xl font-semibold mb-4">
          Payment Summary
        </h2>

        {/* Student Info */}
        <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2"><img src={selectedStudent?.img || ""} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          <p className="font-medium">{selectedStudent.name}</p></div>
          <p className="text-gray-500">{selectedStudent.id}</p>
        </div>

        {/* Entered Rows */}
        <div className="space-y-3">
          {enteredRows.map((row, index) => (
            <div
              key={index}
              className="flex justify-between border-b pb-2"
            >
              <span>{row.feeHead}</span>
              <span className="font-semibold">
                ₹{row.enteredAmount}
              </span>
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
          onClick={onClose}
          className="mt-6 w-full py-2 bg-gray-200 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentDrawer;