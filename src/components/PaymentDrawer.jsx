import React, { useState } from "react";
import { X, ChevronUp, ChevronDown, ChevronRight, ChevronsRight } from "lucide-react";
import { toast } from "react-hot-toast";
import CustomSelect from "./CustomSelect";
import PaymentMethodFields from "./PaymentMethodFields";

const PaymentDrawer = ({
  show,
  onClose,
  selectedStudent,
  enteredRows,
  totalAmount,
}) => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [formData, setFormData] = useState({});

  if (!show) return null;

  const handleBilling = () => {
    const billingPayload = {
      student: selectedStudent,
      fees: enteredRows,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      paymentDetails: formData,
    };

    console.log("=== BILLING DATA ===");
    console.log(billingPayload);

    toast.success("Billing successful!");
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-[28%] bg-white h-[97vh] shadow-xl m-2 rounded-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between mb-3  border-b border-gray-300 pb-3">
          <h2 className="text-lg font-semibold text-gray-700">Final Payment</h2>
          <div
            className="bg-gray-100 rounded-full p-1 cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-600" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 space-y-4">
          {/* Student Info */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedStudent?.img || ""}
                alt="Profile"
                className="w-11 h-11 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {selectedStudent?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedStudent?.year} / {selectedStudent?.dept}
                </p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">{selectedStudent?.id}</p>
          </div>

          {/* Grey Card */}
          <div className="bg-gray-100 rounded-xl p-4">
            {/* Total Row */}
            <div
              onClick={() => setOpen(!open)}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="text-gray-700 font-medium">Total Amount</span>

              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold">
                  ₹{totalAmount}
                </span>
                {open ? (
                  <ChevronUp size={18} className="text-green-600" />
                ) : (
                  <ChevronDown size={18} className="text-green-600" />
                )}
              </div>
            </div>

            {/* Divider */}

            {/* Accordion Content */}
            {open && (
              <>
                <div className="border-t border-gray-300 my-3" />

                <div className="space-y-3">
                  {enteredRows.map((row, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-gray-700"
                    >
                      <span>{row.feeHead}</span>
                      <span className="font-medium">₹{row.enteredAmount}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="space-y-3">
            <label className="font-semibold text-gray-700">
              Payment Method
            </label>

            <CustomSelect
              placeholder="Select Payment"
              value={paymentMethod}
              onChange={(value) => {
                setPaymentMethod(value);
                setFormData({});
              }}
              options={["Cash", "UPI", "Cheque", "DD", "Card", "Net Banking"]}
              className="w-full mt-1"
            />

            {/* Dynamic Fields */}
            <PaymentMethodFields
              paymentMethod={paymentMethod}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        </div>
        {/* Submit Button */}
        <div className="p-6">
  <button
    onClick={handleBilling}
    className="w-full py-2 bg-[#0B56A4] text-white rounded-lg font-semibold 
               flex items-center justify-center gap-2 transition  cursor-pointer   "
  >
    Submit
    <ChevronsRight size={18} />
  </button>
</div>
      </div>
    </div>
  );
};

export default PaymentDrawer;
