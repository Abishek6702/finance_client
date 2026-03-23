import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

const fmt = (val) =>
  isNaN(parseFloat(val))
    ? "₹ —"
    : `₹ ${parseFloat(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const inputCls = (err) =>
  `w-full border rounded-lg px-3 py-2 text-sm text-gray-800 bg-white
  focus:outline-none focus:ring-1 focus:border-transparent transition
  ${err ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-[#0b56a4]"}`;

const ReadOnlyField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 cursor-not-allowed select-none">
      {value}
    </div>
  </div>
);

const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && (
      <div className="flex items-center gap-1 mt-0.5">
        <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
        <span className="text-xs text-red-400">{error}</span>
      </div>
    )}
  </div>
);

const Tile = ({ label, value, highlight }) => (
  <div className={`flex flex-col gap-0.5 p-3 rounded-lg ${highlight ? "bg-blue-50 border border-blue-100" : "bg-gray-50"}`}>
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
    <span className={`text-sm font-bold ${highlight ? "text-[#0b56a4]" : "text-gray-800"}`}>{value}</span>
  </div>
);

const RadioCard = ({ label, checked, onChange }) => (
  <label
    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
      ${checked ? "border-[#0b56a4] bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
  >
    <input type="radio" className="accent-[#0b56a4]" checked={checked} onChange={onChange} />
    <p className={`text-sm font-semibold ${checked ? "text-[#0b56a4]" : "text-gray-700"}`}>{label}</p>
  </label>
);

const validate = (data) => {
  const errors = {};
  if (!data.endDate)          errors.endDate          = "End date is required";
  if (!data.conceptionAmount) errors.conceptionAmount = "Conception amount is required";
  if (!data.refundMode)       errors.refundMode       = "Please select a refund mode";
  return errors;
};

// ─── HostelWithdrawalFlow ─────────────────────────────────────────────────────
const HostelWithdrawalFlow = ({ student, onClose }) => {
  // From backend — fallback to static for now
  // TODO: replace field names once backend is ready
  const totalAmount = student?.hostelTotalAmount ?? 25000;
  const paidAmount  = student?.hostelPaidAmount  ?? 18000;

  const [data, setData]     = useState({ endDate: "", conceptionAmount: "", refundMode: "" });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setData((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const balance = Math.max(0, paidAmount - (parseFloat(data.conceptionAmount) || 0));

  const handleSubmit = () => {
    const errs = validate(data);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    console.log("Hostel Withdrawal submit", {
      student,
      hostel: { totalAmount, paidAmount, balance, ...data },
    });
    onClose();
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Read-only — from backend */}
        <ReadOnlyField label="Total Hostel Amount" value={fmt(totalAmount)} />
        <ReadOnlyField label="Paid Amount"         value={fmt(paidAmount)} />

        {/* Editable */}
        <Field label="Hostel End Date" required error={errors.endDate}>
          <input className={inputCls(errors.endDate)} type="date"
            value={data.endDate} onChange={(e) => set("endDate", e.target.value)} />
        </Field>

        <Field label="Conception Amount" required error={errors.conceptionAmount}>
          <input className={inputCls(errors.conceptionAmount)} type="number" min="0" placeholder="0.00"
            value={data.conceptionAmount} onChange={(e) => set("conceptionAmount", e.target.value)} />
        </Field>
      </div>

      {/* Balance tiles */}
      <div className="grid grid-cols-3 gap-3">
        <Tile label="Paid Amount"          value={fmt(paidAmount)} />
        <Tile label="Conception Amount"    value={fmt(data.conceptionAmount)} />
        <Tile label="Balance (Refundable)" value={fmt(balance)} highlight />
      </div>

      {/* Refund mode */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Refund Mode <span className="text-red-400">*</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <RadioCard label="Refund"
            checked={data.refundMode === "refund"} onChange={() => set("refundMode", "refund")} />
          <RadioCard label="Student Wallet"
            checked={data.refundMode === "wallet"} onChange={() => set("refundMode", "wallet")} />
        </div>
        {errors.refundMode && (
          <div className="flex items-center gap-1 mt-1.5">
            <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
            <span className="text-xs text-red-400">{errors.refundMode}</span>
          </div>
        )}
      </div>

      <button onClick={handleSubmit}
        className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#0b56a4] text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
        Submit
      </button>
    </div>
  );
};

export default HostelWithdrawalFlow;