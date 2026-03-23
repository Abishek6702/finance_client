import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2, AlertCircle, ChevronDown, Search } from "lucide-react";


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
const validateTransport = (data) => {
  const errors = {};
  if (!data.endDate) errors.endDate = "End date is required";
  if (!data.conceptionAmount)
    errors.conceptionAmount = "Conception amount is required";
  if (!data.refundMode) errors.refundMode = "Please select a refund mode";
  return errors;
};

const validateHostel = (data) => {
  const errors = {};
  if (!data.block) errors.block = "Block is required";
  if (!data.sharing) errors.sharing = "Sharing type is required";
  if (!data.roomNo) errors.roomNo = "Room number is required";
  if (!data.roomType) errors.roomType = "Please select bathroom type";
  return errors;
};
// Fee map keyed by "sharing|roomType" — replace with API when ready
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
// ─── RequireHostelFlow ────────────────────────────────────────────────────────
const RequireHostelFlow = ({ student, onClose }) => {
  const [step, setStep] = useState(0);

  // These come from the student/backend — fallback to static values for now
  // TODO: replace with actual API field names once backend is ready
  const totalAmount = student?.transportTotalAmount ?? 18000;
  const paidAmount = student?.transportPaidAmount ?? 12000;

  const [transport, setTransport] = useState({
    endDate: "",
    conceptionAmount: "",
    refundMode: "",
  });

  const [hostel, setHostel] = useState({
    block: "",
    sharing: "",
    roomNo: "",
    floor: "",
    roomType: "",
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

  const feeKey       = hostel.sharing && hostel.roomType ? `${hostel.sharing}|${hostel.roomType}` : null;
  const hostelTotal  = feeKey ? (HOSTEL_FEES[feeKey] ?? null) : null;
  const reductionAmt = parseFloat(hostel.reductionAmount) || 0;
  const payable      = hostelTotal !== null ? Math.max(0, hostelTotal - reductionAmt) : null;

  const handleContinue = () => {
    const errors = validateTransport(transport);
    if (Object.keys(errors).length > 0) {
      setTransportErrors(errors);
      return;
    }
    setStep(1);
  };

  const handleSubmit = () => {
    const errors = validateHostel(hostel);
    if (Object.keys(errors).length > 0) {
      setHostelErrors(errors);
      return;
    }
    // TODO: replace with your API call
    console.log("Require Hostel submit", {
      student,
      transport: { totalAmount, paidAmount, ...transport },
      hostel,
    });
    onClose();
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
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
                onChange={() => setT("refundMode", "wallet")}
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
          </div>

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
                {BLOCKS.map((b) => (
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
                {SHARING_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Room No." required error={hostelErrors.roomNo}>
              <SearchableRoomSelect
                value={hostel.roomNo}
                onChange={(val) => setH("roomNo", val)}
                error={hostelErrors.roomNo}
              />
            </Field>

            <Field label="Floor">
              <input
                className={inputCls(false)}
                type="text"
                placeholder="e.g. 2nd Floor"
                value={hostel.floor}
                onChange={(e) => setH("floor", e.target.value)}
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
                  <span className="text-sm font-medium text-gray-600">Payable Amount</span>
                  <span className="text-base font-bold text-green-700">{fmt(payable)}</span>
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
