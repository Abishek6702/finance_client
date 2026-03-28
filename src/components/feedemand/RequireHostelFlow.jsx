import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2, AlertCircle, ChevronDown, Search } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";

const getAcademicYears = () => {
  const now = new Date();
  const year = now.getFullYear();

  const currentStartYear = now.getMonth() >= 5 ? year : year - 1;

  const current = `${currentStartYear}-${currentStartYear + 1}`;
  const next = `${currentStartYear + 1}-${currentStartYear + 2}`;

  return { current, next, list: [current, next] };
};
// ─── Utilities ────────────────────────────────────────────────────────────────
const fmt = (val) =>
  isNaN(parseFloat(val))
    ? "₹ —"
    : `₹ ${parseFloat(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const inputCls = (err) =>
  `w-full border rounded-lg px-3 py-2 text-sm text-gray-800 bg-white
  focus:outline-none focus:ring-1 focus:border-transparent transition
  ${err ? "border-red-400 focus:ring-[#0b56a4]" : "border-gray-200 focus:ring-[#0b56a4]"}`;

// ─── Field wrapper with error ─────────────────────────────────────────────────
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

// ─── Read-only display field (backend values — not editable) ──────────────────
const ReadOnlyField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 cursor-not-allowed select-none">
      {value}
    </div>
  </div>
);

// ─── Info tile ────────────────────────────────────────────────────────────────
const Tile = ({ label, value, highlight }) => (
  <div
    className={`flex flex-col gap-0.5 p-3 rounded-lg ${highlight ? "bg-blue-50 border border-blue-100" : "bg-gray-50"}`}
  >
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
      {label}
    </span>
    <span
      className={`text-sm font-semibold ${highlight ? "text-[#0b56a4]" : "text-gray-800"}`}
    >
      {value}
    </span>
  </div>
);

// ─── Radio card ───────────────────────────────────────────────────────────────
const RadioCard = ({ label, description, checked, onChange }) => (
  <label
    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
      ${checked ? "border-[#0b56a4] bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
  >
    <input
      type="radio"
      className="mt-0.5 accent-[#0b56a4]"
      checked={checked}
      onChange={onChange}
    />
    <div>
      <p
        className={`text-sm font-semibold ${checked ? "text-[#0b56a4]" : "text-gray-700"}`}
      >
        {label}
      </p>
      {description && (
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      )}
    </div>
  </label>
);

// ─── Constants ────────────────────────────────────────────────────────────────
const BLOCKS = ["Block A", "Block B", "Block C", "Block D"];
const SHARING_TYPES = ["Single", "Double", "Triple", "4-Sharing"];

const { current, list: academicYear } = getAcademicYears();

// Replace with API fetch or pass as prop when ready
const ROOM_NOS = [
  "A-101",
  "A-102",
  "A-103",
  "A-104",
  "A-201",
  "A-202",
  "A-203",
  "A-204",
  "B-101",
  "B-102",
  "B-103",
  "B-104",
  "B-201",
  "B-202",
  "B-203",
  "B-204",
  "C-101",
  "C-102",
  "C-103",
  "C-104",
  "C-201",
  "C-202",
  "C-203",
  "C-204",
  "D-101",
  "D-102",
  "D-103",
  "D-104",
  "D-201",
  "D-202",
  "D-203",
  "D-204",
];

// ─── Searchable Room Dropdown ─────────────────────────────────────────────────
const SearchableRoomSelect = ({ value, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = ROOM_NOS.filter((r) =>
    r.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (room) => {
    onChange(room);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 text-sm bg-white transition
          focus:outline-none focus:ring-1 focus:border-transparent
          ${error ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-[#0b56a4]"}
          ${value ? "text-gray-800" : "text-gray-400"}`}
      >
        <span>{value || "Search room no."}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <ul className="max-h-44 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((room) => (
                <li
                  key={room}
                  onMouseDown={() => handleSelect(room)}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors
                    ${value === room ? "bg-blue-50 text-[#0b56a4] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {room}
                </li>
              ))
            ) : (
              <li className="px-3 py-3 text-sm text-gray-400 text-center">
                No rooms found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// ─── Validation ───────────────────────────────────────────────────────────────
const validateTransport = (data, balance) => {
  const errors = {};
  if (!data.endDate) errors.endDate = "End date is required";
  if (!data.conceptionAmount)
    errors.conceptionAmount = "Conception amount is required";
  if (balance > 0 && !data.refundMode)
    errors.refundMode = "Please select a refund mode";

  if (data.refundMode === "refund" && !data.refundMethod)
    errors.refundMethod = "Please select cash or bank";

  if (data.refundMethod == "bank") {
    if (!data.paymentFrom) errors.paymentFrom = "Payment from is required";
    if (!data.studentAccountNumber)
      errors.studentAccountNumber = "Student account number is required";
    if (!data.StudentbankName)
      errors.StudentbankName = "Student bank name is required";
  }
  return errors;
};

const validateHostel = (data) => {
  const errors = {};
  if (!data.block) errors.block = "Block is required";
  if (!data.sharing) errors.sharing = "Sharing type is required";
  if (!data.roomType) errors.roomType = "Please select bathroom type";
  if (!data.effectiveDate) errors.effectiveDate = "Effective date is required";
  if (data.refundMode === "refund" && !data.refundMethod)
    errors.refundMethod = "Please select cash or bank";
  return errors;
};
// Fee map keyed by "sharing|roomType" — replace with API when ready
const HOSTEL_FEES = {
  "Single|attached": 25000,
  "Single|not_attached": 20000,
  "Double|attached": 18000,
  "Double|not_attached": 15000,
  "Triple|attached": 14000,
  "Triple|not_attached": 12000,
  "4-Sharing|attached": 12000,
  "4-Sharing|not_attached": 10000,
};
// ─── RequireHostelFlow ────────────────────────────────────────────────────────
const RequireHostelFlow = ({ student, onClose }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transportData, setTransportData] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [roomInfo, setRoomInfo] = useState({
    blocks: [],
    sharing: [],
    isAttached: [],
  });

  // These come from the student/backend — fallback to static values for now
  // TODO: replace with actual API field names once backend is ready
  const totalAmount = transportData?.fee;
  const paidAmount = transportData?.paid;

  const [transport, setTransport] = useState({
    academicYear: current,
    endDate: "",
    conceptionAmount: "",
    refundMode: "",
    refundMethod: "",
    paymentFrom: "",
    studentAccountNumber: "",
    StudentbankName: "",
  });

  const [hostel, setHostel] = useState({
    block: "",
    sharing: "",
    roomNo: "",
    floor: "",
    roomType: "",
    effectiveDate: "",
    reductionAmount: "",
  });

  const [transportErrors, setTransportErrors] = useState({});
  const [hostelErrors, setHostelErrors] = useState({});

  const setT = (key, val) => {
    setTransport((p) => ({ ...p, [key]: val }));
    if (transportErrors[key]) setTransportErrors((p) => ({ ...p, [key]: "" }));
  };

  const setH = (key, val) => {
    setHostel((p) => ({ ...p, [key]: val }));
    if (hostelErrors[key]) setHostelErrors((p) => ({ ...p, [key]: "" }));
  };

  const balance = Math.max(
    0,
    paidAmount - (parseFloat(transport.conceptionAmount) || 0),
  );

  const hostelTotal = (() => {
    if (!hostel.block || !hostel.sharing || !hostel.roomType) return null;

    const match = roomData.find(
      (r) =>
        r.block === hostel.block &&
        r.sharing === Number(hostel.sharing) &&
        r.isAttached === (hostel.roomType === "attached"),
    );

    return match?.fee ?? null;
  })();
  const reductionAmt = parseFloat(hostel.reductionAmount) || 0;
  const payable =
    hostelTotal !== null ? Math.max(0, hostelTotal - reductionAmt) : null;

  const fetchtransport = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/feedemands/${student.rollNo}?academicYear=${transport.academicYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = res.data;
      console.log("Transport data fetched:", json);
      if (json.success) {
        setTransportData(json.data.studentType.transportDetails);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchtransport();
  }, []);

  const fetchRoom = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/hostel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = res.data;
      // console.log("Hostel data fetched:", json);
      if (json.success) {
        setRoomData(json.data.detailed);
        setRoomInfo(json.data.info);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  const handleContinue = () => {
    const errors = validateTransport(transport, balance);
    if (Object.keys(errors).length > 0) {
      setTransportErrors(errors);
      return;
    }
    setStep(1);
  };
  const roomId = roomData.find(
    (r) =>
      r.block === hostel.block &&
      r.sharing === Number(hostel.sharing) &&
      r.isAttached === (hostel.roomType === "attached")
  )?.id;
  const handleSubmit = async () => {
    setLoading(true);

    const errors = validateHostel(hostel);
    if (Object.keys(errors).length > 0) {
      setHostelErrors(errors);
      setLoading(false);

      return;
    }
    try {
      const token = localStorage.getItem("token");

      const payload = {
        cancel: {
          facilityType: "transport",
          applyFromAcademicYear: transport.academicYear,
          endDate: transport.endDate,
          conceptionAmount: parseFloat(transport.conceptionAmount),

          ...(balance > 0 && {
            refundAmount: balance,
            refundMode:
              transport.refundMode === "wallet" ? "wallet" : transport.refundMethod,

            ...(transport.refundMethod === "bank" && {
              collegeAccount: transport.paymentFrom,
              studentBankName: transport.StudentbankName,
              studentAccount: transport.studentAccountNumber,
            }),
          }),
        },
        assign: {
          hostel: {
            isApplicable: true,
            id: roomId,
          },
          applyFromAcademicYear: transport.academicYear,
          effectiveDate: hostel.effectiveDate,
          ...(hostel.reductionAmount > 0 && {
            reduction: parseFloat(hostel.reductionAmount),
          }),
        },
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/studentFacility/cancel-assign/${student.rollNo}`, // 👈 adjust endpoint if needed
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-idempotency-key": uuidv4(),
          },
        },
      );

      if (res.data.success) {
        toast.success("Room updated successfully!");
        onClose();
      }
    } catch (err) {
      console.error("POST ERROR:", err);
      setLoading(false);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      <Field
        label="Academic Year"
        required
        error={transportErrors.academicYear}
      >
        <select
          className={inputCls(transportErrors.academicYear) + " cursor-pointer"}
          value={transport.academicYear}
          onChange={(e) => setT("academicYear", e.target.value)}
        >
          <option value="">Select Academic year</option>
          {academicYear.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </Field>

      {/* ─── Step 0: Transport Details ─── */}
      {step === 0 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {/* Read-only — from backend */}
            <ReadOnlyField
              label="Total Transport Amount"
              value={fmt(totalAmount)}
            />
            <ReadOnlyField label="Paid Amount" value={fmt(paidAmount)} />

            {/* Editable */}
            <Field
              label="Transport End Date"
              required
              error={transportErrors.endDate}
            >
              <input
                className={inputCls(transportErrors.endDate)}
                type="date"
                value={transport.endDate}
                onChange={(e) => setT("endDate", e.target.value)}
              />
            </Field>

            <Field
              label="Conception Amount"
              required
              error={transportErrors.conceptionAmount}
            >
              <input
                className={inputCls(transportErrors.conceptionAmount)}
                type="number"
                min="0"
                placeholder="0.00"
                value={transport.conceptionAmount}
                onChange={(e) => setT("conceptionAmount", e.target.value)}
              />
            </Field>
          </div>

          {/* Balance tiles */}
          <div className="grid grid-cols-3 gap-3">
            <Tile label="Paid Amount" value={fmt(paidAmount)} />
            <Tile
              label="Conception Amount"
              value={fmt(transport.conceptionAmount)}
            />
            <Tile label="Balance (Refundable)" value={fmt(balance)} highlight />
          </div>

          {/* Refund mode */}
          {balance > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Refund Mode <span className="text-red-400">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <RadioCard
                  label="Refund"
                  checked={transport.refundMode === "refund"}
                  onChange={() => setT("refundMode", "refund")}
                />
                <RadioCard
                  label="Student Wallet"
                  checked={transport.refundMode === "wallet"}
                  // change Student Wallet onChange to:
                  onChange={() => {
                    setT("refundMode", "wallet");
                    setT("refundMethod", "");
                  }}
                />
              </div>
              {transportErrors.refundMode && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="text-xs text-red-400">
                    {transportErrors.refundMode}
                  </span>
                </div>
              )}
              {transport.refundMode === "refund" && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Refund Via <span className="text-red-400">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <RadioCard
                      label="Cash"
                      checked={transport.refundMethod === "cash"}
                      onChange={() => setT("refundMethod", "cash")}
                    />
                    <RadioCard
                      label="Bank"
                      checked={transport.refundMethod === "bank"}
                      onChange={() => setT("refundMethod", "bank")}
                    />
                  </div>
                  {transportErrors.refundMethod && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="text-xs text-red-400">
                        {transportErrors.refundMethod}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {transport.refundMethod === "bank" && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Field
                    label="Payment from"
                    required
                    error={transportErrors.paymentFrom}
                  >
                    <input
                      className={inputCls(transportErrors.paymentFrom)}
                      type="text"
                      placeholder="Enter payment from"
                      value={transport.paymentFrom}
                      onChange={(e) => setT("paymentFrom", e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Student Account Number"
                    required
                    error={transportErrors.studentAccountNumber}
                  >
                    <input
                      className={inputCls(transportErrors.studentAccountNumber)}
                      type="text"
                      placeholder="Enter student account number"
                      value={transport.studentAccountNumber}
                      onChange={(e) =>
                        setT("studentAccountNumber", e.target.value)
                      }
                    />
                  </Field>
                  <Field
                    label="Student Bank name"
                    required
                    error={transportErrors.StudentbankName}
                  >
                    <input
                      className={inputCls(transportErrors.StudentbankName)}
                      type="text"
                      placeholder="Enter student bank name"
                      value={transport.StudentbankName}
                      onChange={(e) => setT("StudentbankName", e.target.value)}
                    />
                  </Field>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleContinue}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#0b56a4] text-white hover:bg-[#0b56a4] cursor-pointer active:scale-[0.98] transition-all"
          >
            Continue →
          </button>
        </>
      )}

      {/* ─── Step 1: Hostel Details ─── */}
      {step === 1 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Block" required error={hostelErrors.block}>
              <select
                className={inputCls(hostelErrors.block) + " cursor-pointer"}
                value={hostel.block}
                onChange={(e) => setH("block", e.target.value)}
              >
                <option value="">Select block</option>
                {roomInfo.blocks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Sharing Type" required error={hostelErrors.sharing}>
              <select
                className={inputCls(hostelErrors.sharing) + " cursor-pointer"}
                value={hostel.sharing}
                onChange={(e) => setH("sharing", e.target.value)}
              >
                <option value="">Select sharing</option>
                {roomInfo.sharing.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Effective Date"
              required
              error={hostelErrors.effectiveDate}
            >
              <input
                className={inputCls(hostelErrors.effectiveDate)}
                type="date"
                value={hostel.effectiveDate}
                onChange={(e) => setH("effectiveDate", e.target.value)}
              />
            </Field>
          </div>

          {/* Bathroom type */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Bathroom Type <span className="text-red-400">*</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <RadioCard
                label="Attached"
                checked={hostel.roomType === "attached"}
                onChange={() => setH("roomType", "attached")}
              />
              <RadioCard
                label="Not Attached"
                checked={hostel.roomType === "not_attached"}
                onChange={() => setH("roomType", "not_attached")}
              />
            </div>
            {hostelErrors.roomType && (
              <div className="flex items-center gap-1 mt-1.5">
                <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                <span className="text-xs text-red-400">
                  {hostelErrors.roomType}
                </span>
              </div>
            )}
          </div>

          {/* Fee summary — shown once sharing + bathroom selected */}
          {hostelTotal !== null && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <ReadOnlyField label="Total Amount" value={fmt(hostelTotal)} />
                <Field label="Reduction Amount">
                  <input
                    className={inputCls(false)}
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={hostel.reductionAmount}
                    onChange={(e) => setH("reductionAmount", e.target.value)}
                  />
                </Field>
              </div>
              {hostel.reductionAmount !== "" && (
                <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    Payable Amount
                  </span>
                  <span className="text-base font-bold text-green-700">
                    {fmt(payable)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-[#0b56a4] text-white hover:bg-[#0b56a4] cursor-pointer active:scale-[0.98] transition-all"
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RequireHostelFlow;
