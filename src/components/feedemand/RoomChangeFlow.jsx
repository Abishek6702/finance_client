import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, ChevronDown, Search, CheckCircle2 } from "lucide-react";
// import { generateRefundReceipt } from "../utils/generateRefundReceipt";

const fmt = (val) =>
  isNaN(parseFloat(val))
    ? "₹ —"
    : `₹ ${parseFloat(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const inputCls = (err) =>
  `w-full border rounded-lg px-3 py-2 text-sm text-gray-800 bg-white
  focus:outline-none focus:ring-1 focus:border-transparent transition
  ${err ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-[#0b56a4]"}`;

// ─── Field ────────────────────────────────────────────────────────────────────
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

// ─── Read-only field ──────────────────────────────────────────────────────────
const ReadOnlyField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 cursor-not-allowed select-none">
      {value}
    </div>
  </div>
);

// ─── Tile ─────────────────────────────────────────────────────────────────────
const Tile = ({ label, value, variant = "neutral" }) => {
  const styles = { neutral: "bg-gray-50", blue: "bg-blue-50 border border-blue-100", green: "bg-green-50 border border-green-100" };
  const text   = { neutral: "text-gray-800", blue: "text-[#0b56a4]", green: "text-green-700" };
  return (
    <div className={`flex flex-col gap-0.5 p-3 rounded-lg ${styles[variant]}`}>
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-bold ${text[variant]}`}>{value}</span>
    </div>
  );
};

// ─── Radio card ───────────────────────────────────────────────────────────────
const RadioCard = ({ label, description, checked, onChange }) => (
  <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
    ${checked ? "border-[#0b56a4] bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
    <input type="radio" className="mt-0.5 accent-[#0b56a4]" checked={checked} onChange={onChange} />
    <div>
      <p className={`text-sm font-semibold ${checked ? "text-[#0b56a4]" : "text-gray-700"}`}>{label}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
  </label>
);

// ─── Searchable Select ────────────────────────────────────────────────────────
const SearchableSelect = ({ value, onChange, options, placeholder, error, disabled }) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const containerRef      = useRef(null);
  const inputRef          = useRef(null);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false); setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (val) => { onChange(val); setOpen(false); setQuery(""); };

  return (
    <div ref={containerRef} className="relative">
      <button type="button" disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); } }}
        className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 text-sm bg-white transition
          focus:outline-none focus:ring-1 focus:border-transparent
          ${disabled ? "bg-gray-50 cursor-not-allowed text-gray-400 border-gray-100" :
            error    ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-[#0b56a4]"}
          ${!value ? "text-gray-400" : "text-gray-800"}`}>
        <span>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input ref={inputRef} type="text"
              className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
              placeholder="Type to search..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <ul className="max-h-44 overflow-y-auto">
            {filtered.length > 0 ? filtered.map((opt) => (
              <li key={opt} onMouseDown={() => handleSelect(opt)}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors
                  ${value === opt ? "bg-blue-50 text-[#0b56a4] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                {opt}
              </li>
            )) : <li className="px-3 py-3 text-sm text-gray-400 text-center">No results found</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

// ─── Table Row ────────────────────────────────────────────────────────────────
const TableRow = ({ label, value }) => (
  <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-white">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value}</span>
  </div>
);


// ─── Constants ───────────────────────────────────────────────────────────────
const BLOCKS        = ["Block A", "Block B", "Block C", "Block D"];
const SHARING_TYPES = ["Single", "Double", "Triple", "4-Sharing"];
const ROOM_NOS      = [
  "A-101", "A-102", "A-103", "A-104", "A-201", "A-202", "A-203", "A-204",
  "B-101", "B-102", "B-103", "B-104", "B-201", "B-202", "B-203", "B-204",
  "C-101", "C-102", "C-103", "C-104", "C-201", "C-202", "C-203", "C-204",
  "D-101", "D-102", "D-103", "D-104", "D-201", "D-202", "D-203", "D-204",
];
const HOSTEL_FEES = {
  "Single|attached":        25000,
  "Single|not_attached":    20000,
  "Double|attached":        18000,
  "Double|not_attached":    15000,
  "Triple|attached":        14000,
  "Triple|not_attached":    12000,
  "4-Sharing|attached":     12000,
  "4-Sharing|not_attached": 10000,
};

// ─── Validation ───────────────────────────────────────────────────────────────
const validateClosing = (data) => {
  const errors = {};
  if (!data.endDate)          errors.endDate          = "End date is required";
  if (!data.conceptionAmount) errors.conceptionAmount = "Conception amount is required";
  if (!data.refundMode)       errors.refundMode       = "Please select a refund mode";
  if (data.refundMode === "refund" && !data.refundMethod) 
    errors.refundMethod = "Please select cash or bank"; // 👈 add this
  return errors;
};

const validateNewRoom = (data, hasExcess) => {
  const errors = {};
  if (!data.block)         errors.block         = "Block is required";
  if (!data.sharing)       errors.sharing       = "Sharing type is required";
  if (!data.roomNo)        errors.roomNo        = "Room number is required";
  if (!data.roomType)      errors.roomType      = "Please select bathroom type";
  if (!data.effectiveDate) errors.effectiveDate = "Effective date is required";
  if (hasExcess && !data.excessMode) errors.excessMode = "Please select how to handle excess amount";
  return errors;
};

// ─── RoomChangeFlow ───────────────────────────────────────────────────────────
const RoomChangeFlow = ({ student, onClose }) => {
  const [step, setStep]                   = useState(0);
  const [accordionOpen, setAccordionOpen] = useState(true);
  

  // Current room from backend — fallback to static for now
  const currentBlock    = student?.hostelBlock       ?? "Block A";
  const currentRoom     = student?.hostelRoomNo      ?? "A-101";
  const currentSharing  = student?.hostelSharing     ?? "Double";
  const currentBathroom = student?.hostelRoomType === "attached" ? "Attached" : "Not Attached";
  const currentTotal    = student?.hostelTotalAmount ?? 18000;
  const currentPaid     = student?.hostelPaidAmount  ?? 15000;

  // ── Step 0: closing state ──────────────────────────────────────────────────
  const [closing, setClosing] = useState({ 
    endDate: "", conceptionAmount: "", refundMode: "", refundMethod: "" 
  });
  const [closingErrors, setClosingErrors] = useState({});

  const setC = (key, val) => {
    setClosing((p) => ({ ...p, [key]: val }));
    if (closingErrors[key]) setClosingErrors((p) => ({ ...p, [key]: "" }));
  };

  const closingBalance = Math.max(0, currentPaid - (parseFloat(closing.conceptionAmount) || 0));

  // ── Step 1: new room state ─────────────────────────────────────────────────
  const [newRoom, setNewRoom]       = useState({ block: "", sharing: "", roomNo: "", floor: "", roomType: "", effectiveDate: "", reductionAmount: "", excessMode: "" });
  const [newRoomErrors, setNewRoomErrors] = useState({});

  const setR = (key, val) => {
    setNewRoom((p) => ({ ...p, [key]: val }));
    if (newRoomErrors[key]) setNewRoomErrors((p) => ({ ...p, [key]: "" }));
  };

  const feeKey       = newRoom.sharing && newRoom.roomType ? `${newRoom.sharing}|${newRoom.roomType}` : null;
  const newRoomFee   = feeKey ? (HOSTEL_FEES[feeKey] ?? null) : null;
  const reductionAmt = parseFloat(newRoom.reductionAmount) || 0;
  const payable      = newRoomFee !== null ? Math.max(0, newRoomFee - reductionAmt) : null;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleContinue = () => {
    const errs = validateClosing(closing);
    if (Object.keys(errs).length > 0) { setClosingErrors(errs); return; }
    setStep(1);
  };

  const handleSubmit = () => {
    const errs = validateNewRoom(newRoom, false);
    if (Object.keys(errs).length > 0) { setNewRoomErrors(errs); return; }

    // Generate receipt if refund selected in step 0
    if (closing.refundMode === "refund") {
      generateRefundReceipt({
        receiptNo   : "AUTO-001",
        studentName : student?.name?.toUpperCase(),
        rollNo      : student?.rollNo,
        year        : `${student?.year ?? ""} ${student?.department ?? ""} - ${student?.section ?? ""}`,
        semPeriod   : student?.semPeriod ?? "—",
        rows: [
          { sl: 1, particular: "Current Room - Paid Amount",   amount: currentPaid },
          { sl: 2, particular: "Conception Amount",            amount: parseFloat(closing.conceptionAmount) },
          { sl: 3, particular: "Balance (Refundable)",         amount: closingBalance },
        ],
        paymentMode : "Bank",
        totalAmount : closingBalance,
        remarks     : `Room change refund. New room: ${newRoom.block} / ${newRoom.roomNo}. Effective: ${newRoom.effectiveDate}`,
      });
    }

    console.log("Room Change submit", { student, closing, newRoom, payable });
    onClose();
  };

  return (
    <div className="flex flex-col gap-5 mt-4">


      {/* ── Step 0: Current room closing ── */}
      {step === 0 && (
        <>
          {/* Accordion */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button type="button" onClick={() => setAccordionOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition">
              <span className="text-sm font-semibold text-gray-700">Current Room Details</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${accordionOpen ? "rotate-180" : ""}`} />
            </button>
            {accordionOpen && (
              <>
                <TableRow label="Block"    value={currentBlock} />
                <TableRow label="Room No." value={currentRoom} />
                <TableRow label="Sharing"  value={currentSharing} />
                <TableRow label="Bathroom" value={currentBathroom} />
              </>
            )}
          </div>

          {/* Paid info + closing fields */}
          <div className="grid grid-cols-2 gap-3">
            <ReadOnlyField label="Total Room Amount" value={fmt(currentTotal)} />
            <ReadOnlyField label="Paid Amount"       value={fmt(currentPaid)} />

            <Field label="Room End Date" required error={closingErrors.endDate}>
              <input className={inputCls(closingErrors.endDate)} type="date"
                value={closing.endDate} onChange={(e) => setC("endDate", e.target.value)} />
            </Field>

            <Field label="Conception Amount" required error={closingErrors.conceptionAmount}>
              <input className={inputCls(closingErrors.conceptionAmount)} type="number" min="0" placeholder="0.00"
                value={closing.conceptionAmount} onChange={(e) => setC("conceptionAmount", e.target.value)} />
            </Field>
          </div>

          {/* Balance tiles */}
          <div className="grid grid-cols-3 gap-3">
            <Tile label="Paid Amount"          value={fmt(currentPaid)} />
            <Tile label="Conception Amount"    value={fmt(closing.conceptionAmount)} />
            <Tile label="Balance (Refundable)" value={fmt(closingBalance)} variant="blue" />
          </div>

          {/* Refund mode */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Refund Mode <span className="text-red-400">*</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <RadioCard label="Refund"
                checked={closing.refundMode === "refund"}
                onChange={() => setC("refundMode", "refund")} />
              <RadioCard label="Student Wallet"
                checked={closing.refundMode === "wallet"}
                onChange={() => { setC("refundMode", "wallet"); setC("refundMethod", ""); }} />
            </div>
            {closingErrors.refundMode && (
              <div className="flex items-center gap-1 mt-1.5">
                <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                <span className="text-xs text-red-400">{closingErrors.refundMode}</span>
              </div>
            )}

{closing.refundMode === "refund" && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Refund Via <span className="text-red-400">*</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <RadioCard label="Cash"
                    checked={closing.refundMethod === "cash"}
                    onChange={() => setC("refundMethod", "cash")} />
                  <RadioCard label="Bank"
                    checked={closing.refundMethod === "bank"}
                    onChange={() => setC("refundMethod", "bank")} />
                </div>
                {closingErrors.refundMethod && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="text-xs text-red-400">{closingErrors.refundMethod}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={handleContinue}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#0b56a4] text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
            Continue →
          </button>
        </>
      )}

      {/* ── Step 1: New room setup ── */}
      {step === 1 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="New Block" required error={newRoomErrors.block}>
              <select className={inputCls(newRoomErrors.block) + " cursor-pointer"}
                value={newRoom.block} onChange={(e) => setR("block", e.target.value)}>
                <option value="">Select block</option>
                {BLOCKS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>

            <Field label="Sharing Type" required error={newRoomErrors.sharing}>
              <select className={inputCls(newRoomErrors.sharing) + " cursor-pointer"}
                value={newRoom.sharing} onChange={(e) => setR("sharing", e.target.value)}>
                <option value="">Select sharing</option>
                {SHARING_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="New Room No." required error={newRoomErrors.roomNo}>
              <SearchableSelect value={newRoom.roomNo} onChange={(val) => setR("roomNo", val)}
                options={ROOM_NOS} placeholder="Search room no." error={newRoomErrors.roomNo} />
            </Field>

            <Field label="Floor">
              <input className={inputCls(false)} type="text" placeholder="e.g. 2nd Floor"
                value={newRoom.floor} onChange={(e) => setR("floor", e.target.value)} />
            </Field>

            <Field label="Effective Date" required error={newRoomErrors.effectiveDate}>
              <input className={inputCls(newRoomErrors.effectiveDate)} type="date"
                value={newRoom.effectiveDate} onChange={(e) => setR("effectiveDate", e.target.value)} />
            </Field>
          </div>

          {/* Bathroom type */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Bathroom Type <span className="text-red-400">*</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <RadioCard label="Attached" description="Private bathroom inside the room"
                checked={newRoom.roomType === "attached"} onChange={() => setR("roomType", "attached")} />
              <RadioCard label="Not Attached" description="Shared bathroom on the floor"
                checked={newRoom.roomType === "not_attached"} onChange={() => setR("roomType", "not_attached")} />
            </div>
            {newRoomErrors.roomType && (
              <div className="flex items-center gap-1 mt-1.5">
                <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                <span className="text-xs text-red-400">{newRoomErrors.roomType}</span>
              </div>
            )}
          </div>

          {/* Fee — shown once sharing + bathroom selected */}
          {newRoomFee !== null && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <ReadOnlyField label="Total Amount" value={fmt(newRoomFee)} />
                <Field label="Reduction Amount">
                  <input className={inputCls(false)} type="number" min="0" placeholder="0.00"
                    value={newRoom.reductionAmount} onChange={(e) => setR("reductionAmount", e.target.value)} />
                </Field>
              </div>
              {newRoom.reductionAmount !== "" && (
                <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Payable Amount</span>
                  <span className="text-base font-bold text-green-700">{fmt(payable)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(0)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer">
              ← Back
            </button>
            <button onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-[#0b56a4] text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
              Submit
            </button>
          </div>
        </>
      )}

    </div>
  );
};

export default RoomChangeFlow;