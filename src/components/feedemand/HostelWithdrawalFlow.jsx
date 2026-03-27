import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const getAcademicYears = () => {
  const now = new Date();
  const year = now.getFullYear();

  const currentStartYear = now.getMonth() >= 5 ? year : year - 1;

  const current = `${currentStartYear}-${currentStartYear + 1}`;
  const next = `${currentStartYear + 1}-${currentStartYear + 2}`;

  return { current, next, list: [current, next] };
};
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
  <div
    className={`flex flex-col gap-0.5 p-3 rounded-lg ${highlight ? "bg-blue-50 border border-blue-100" : "bg-gray-50"}`}
  >
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
      {label}
    </span>
    <span
      className={`text-sm font-bold ${highlight ? "text-[#0b56a4]" : "text-gray-800"}`}
    >
      {value}
    </span>
  </div>
);

const RadioCard = ({ label, checked, onChange }) => (
  <label
    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
      ${checked ? "border-[#0b56a4] bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
  >
    <input
      type="radio"
      className="accent-[#0b56a4]"
      checked={checked}
      onChange={onChange}
    />
    <p
      className={`text-sm font-semibold ${checked ? "text-[#0b56a4]" : "text-gray-700"}`}
    >
      {label}
    </p>
  </label>
);

const validate = (data) => {
  const errors = {};
  if (!data.endDate) errors.endDate = "End date is required";
  if (!data.academicYear) errors.academicYear = "Academic year is required";
  if (!data.conceptionAmount)
    errors.conceptionAmount = "Conception amount is required";
  if (data.refundMode === "refund" && !data.refundMethod)
    errors.refundMethod = "Please select cash or bank";
  
  if (data.refundMethod === "bank") {
    if (!data.paymentFrom)
      errors.paymentFrom = "Payment from is required for bank refunds";
    if (!data.studentAccountNumber)
      errors.studentAccountNumber =
        "Student account number is required for bank refunds";
    if (!data.StudentbankName)
      errors.StudentbankName = "Student bank name is required for bank refunds";
  }

  return errors;
};

// ─── HostelWithdrawalFlow ─────────────────────────────────────────────────────
const HostelWithdrawalFlow = ({ student, onClose }) => {
  // From backend — fallback to static for now
  // TODO: replace field names once backend is ready

  const [hostelSummary, setHostelSummary] = useState({
    total: 0,
    paid: 0,
  });

  const totalAmount = hostelSummary.total;
  const paidAmount = hostelSummary.paid;
  const { current, list: academicYear } = getAcademicYears();

  const [data, setData] = useState({
    academicYear: current,

    endDate: "",
    conceptionAmount: "",
    refundMode: "",
    refundMethod: "",
    paymentFrom: "",
    studentAccountNumber: "",
    StudentbankName: "",
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setData((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const balance = Math.max(
    0,
    paidAmount - (parseFloat(data.conceptionAmount) || 0),
  );

  const fetchHostelData = async () => {
    try {
      const token = localStorage.getItem("token");
      // add query to api
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/feedemands/${student.rollNo}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            academicYear: data.academicYear,
          },
        },
      );
      const json = res.data;
      // console.log("transport data fetched:", json);
      if (json.success) {
        const details = json.data.studentType.hostelDetails;
        console.log("hostel details:", json.data.studentType.hostelDetails);
        setHostelSummary({
          total: details?.fee || 0,
          paid: details?.paid || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching hostel data:", err);
    }
  };
  useEffect(() => {
    fetchHostelData();
  }, []);

  const handleSubmit = async () => {
    const errs = validate(data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const payload = {
        facilityType: "hostel",
        applyFromAcademicYear: data.academicYear,
        endDate: data.endDate,
        conceptionAmount: parseFloat(data.conceptionAmount) || 0,
        refundAmount: balance,
        refundMode: data.refundMode === "wallet" ? "wallet" : data.refundMethod, // cash OR bank

        ...(data.refundMethod === "bank" && {
          collegeAccount: data.paymentFrom,
          studentBankName: data.StudentbankName,
          studentAccount: data.studentAccountNumber,
        }),
      };
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/studentFacility/cancel/${student.rollNo}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Hostel withdrawal submitted successfully!");
        onClose(); // ✅ only here
      } else {
        toast.error(res.data.message || "Failed to submit");
      }
    } catch (err) {
      console.error("Error submitting transport withdrawal:", err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Read-only — from backend */}
        <Field label="Academic Year" required error={errors.academicYear}>
          <select
            className={inputCls(errors.academicYear) + " cursor-pointer"}
            value={data.academicYear}
            onChange={(e) => set("academicYear", e.target.value)}
          >
            <option value="">Select Academic year</option>
            {academicYear.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <ReadOnlyField label="Total Hostel Amount" value={fmt(totalAmount)} />
        <ReadOnlyField label="Paid Amount" value={fmt(paidAmount)} />

        {/* Editable */}
        <Field label="Hostel End Date" required error={errors.endDate}>
          <input
            className={inputCls(errors.endDate)}
            type="date"
            value={data.endDate}
            onChange={(e) => set("endDate", e.target.value)}
          />
        </Field>

        <Field
          label="Conception Amount"
          required
          error={errors.conceptionAmount}
        >
          <input
            className={inputCls(errors.conceptionAmount)}
            type="number"
            min="0"
            placeholder="0.00"
            value={data.conceptionAmount}
            onChange={(e) => set("conceptionAmount", e.target.value)}
          />
        </Field>
      </div>

      {/* Balance tiles */}
      <div className="grid grid-cols-3 gap-3">
        <Tile label="Paid Amount" value={fmt(paidAmount)} />
        <Tile label="Conception Amount" value={fmt(data.conceptionAmount)} />
        <Tile label="Balance (Refundable)" value={fmt(balance)} highlight />
      </div>

      {balance > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Refund Mode <span className="text-red-400">*</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <RadioCard
              label="Refund"
              checked={data.refundMode === "refund"}
              onChange={() => set("refundMode", "refund")}
            />
            <RadioCard
              label="Student Wallet"
              checked={data.refundMode === "wallet"}
              // change Student Wallet onChange to:
              onChange={() => {
                set("refundMode", "wallet");
                set("refundMethod", "");
              }}
            />
          </div>
          {errors.refundMode && (
            <div className="flex items-center gap-1 mt-1.5">
              <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
              <span className="text-xs text-red-400">{errors.refundMode}</span>
            </div>
          )}

          {data.refundMode === "refund" && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Refund Via <span className="text-red-400">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <RadioCard
                  label="Cash"
                  checked={data.refundMethod === "cash"}
                  onChange={() => set("refundMethod", "cash")}
                />
                <RadioCard
                  label="Bank"
                  checked={data.refundMethod === "bank"}
                  onChange={() => set("refundMethod", "bank")}
                />
              </div>
              {errors.refundMethod && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="text-xs text-red-400">
                    {errors.refundMethod}
                  </span>
                </div>
              )}
            </div>
          )}
          {data.refundMethod === "bank" && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Payment from" required error={errors.paymentFrom}>
                <input
                  className={inputCls(errors.paymentFrom)}
                  type="text"
                  placeholder="Enter payment from"
                  value={data.paymentFrom}
                  onChange={(e) => set("paymentFrom", e.target.value)}
                />
              </Field>
              <Field
                label="Student Account Number"
                required
                error={errors.studentAccountNumber}
              >
                <input
                  className={inputCls(errors.studentAccountNumber)}
                  type="text"
                  placeholder="Enter student account number"
                  value={data.studentAccountNumber}
                  onChange={(e) => set("studentAccountNumber", e.target.value)}
                />
              </Field>
              <Field
                label="Student Bank name"
                required
                error={errors.StudentbankName}
              >
                <input
                  className={inputCls(errors.StudentbankName)}
                  type="text"
                  placeholder="Enter student bank name"
                  value={data.StudentbankName}
                  onChange={(e) => set("StudentbankName", e.target.value)}
                />
              </Field>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#0b56a4] text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
      >
        Submit
      </button>
    </div>
  );
};

export default HostelWithdrawalFlow;
