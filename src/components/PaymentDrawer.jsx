import React, { useState, useEffect } from "react";
import { X, ChevronUp, ChevronDown, ChevronsRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { ApiRequest } from "../utils/ApiRequest";
import CustomSelect from "./CustomSelect";
import PaymentMethodFields from "./PaymentMethodFields";

const PaymentDrawer = ({
  show,
  onClose,
  onRefresh,
  selectedStudent,
  enteredRows,
  totalAmount,
}) => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Functionality: Reset state when drawer closes
  useEffect(() => {
    if (!show) {
      setPaymentMethod("Cash");
      setFormData({});
      setOpen(false);
    }
  }, [show]);

  if (!show) return null;

  const handleBilling = async () => {
    if (totalAmount <= 0) return toast.error("Amount must be greater than 0");
    setLoading(true);

    try {
      // Grouping by semesterNumber to handle multi-semester records correctly
      const breakdownMap = {};

      enteredRows.forEach((row) => {
        const semNum = row.semesterNumber;
        if (!breakdownMap[semNum]) {
          breakdownMap[semNum] = {
            academicYear: row.academicYear,
            academic: {
              semesterNumber: semNum,
              tuition: 0,
              exam: 0,
              erp: 0,
              book: 0,
              lab: 0,
            },
            hostel: 0,
            transport: 0,
          };
        }

        const amt = Number(row.enteredAmount || 0);

        if (row.feeHead === "Academic") {
          // row.rawKey holds 'tuition', 'exam', etc. set in Payment.jsx
          breakdownMap[semNum].academic[row.rawKey] = amt;
        } else if (row.feeHead.toLowerCase().includes("hostel")) {
          breakdownMap[semNum].hostel += amt;
        } else if (row.feeHead.toLowerCase().includes("transport")) {
          breakdownMap[semNum].transport += amt;
        }
      });

      const payload = {
        rollNo: selectedStudent?.id,
        paymentType: paymentMethod,
        bankName: formData.bankName || "N/A",
        bankLocation: formData.bankLocation || "N/A",
        billingDate: selectedDate,
        remarks: formData.remarks || "Fee Payment",
        breakdowns: Object.values(breakdownMap), // Converts our map to the array expected by backend
      };

      const response = await ApiRequest("/api/feePayment/pay", "POST", payload);

      if (response.success !== false) {
        toast.success("Payment Successful!");
        window.open(`/receipt/${response.data}`, "_blank");
        if (onRefresh) await onRefresh();
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer Container - Reverting to Original UI Style */}
      <div className="relative w-[28%] bg-white h-[97vh] shadow-xl m-2 rounded-xl flex flex-col">
        {/* Header - Original Style */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Final Payment</h2>
          <div
            className="bg-gray-100 rounded-full p-1 cursor-pointer hover:bg-gray-200"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4 pt-4">
          {/* Student Info */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img
                src={selectedStudent?.img}
                className="w-11 h-11 rounded-full object-cover border"
                alt="Profile"
              />
              <div>
                <p className="font-bold text-gray-800 leading-tight">
                  {selectedStudent?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedStudent?.year} / {selectedStudent?.dept}
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-xs font-mono">
              {selectedStudent?.id}
            </p>
          </div>
          <div className="border inline-block p-2 ml-2 border-gray-500 border-1 rounded-sm ">
            <input
              type="date"
              value={selectedDate}
              max={today} // prevents selecting future dates
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Amount Box - Original Style */}
          <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100">
            <div
              onClick={() => setOpen(!open)}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="text-gray-600 font-medium">Total Amount</span>
              <div className="flex items-center gap-2">
                <span className="text-[#10B981] font-bold text-xl">
                  ₹{totalAmount}
                </span>
                {open ? (
                  <ChevronUp size={18} className="text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </div>
            </div>
            {open && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                {enteredRows.map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>{row.subHead}</span>
                    <span className="font-semibold text-gray-700">
                      ₹{row.enteredAmount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Method
              </label>
              <CustomSelect
                value={paymentMethod}
                onChange={(val) => {
                  setPaymentMethod(val);
                  setFormData({});
                }}
                options={["Cash", "UPI", "Cheque", "DD", "Card", "NetBanking"]}
              />
            </div>
            <PaymentMethodFields
              paymentMethod={paymentMethod}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        </div>

        {/* Footer - Original Blue Button Style */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleBilling}
            disabled={loading || totalAmount <= 0}
            className={`w-full py-3 bg-[#0B56A4] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 active:scale-95 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#094685]"
            }`}
          >
            {loading ? "Processing..." : "Submit"}
            {!loading && <ChevronsRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDrawer;
