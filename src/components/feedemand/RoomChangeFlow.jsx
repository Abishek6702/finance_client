import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, ChevronDown, Search } from "lucide-react";

const fmt = (val) =>
  isNaN(parseFloat(val))
    ? "₹ —"
    : `₹ ${parseFloat(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const inputCls = (err) =>
  `w-full border rounded-lg px-3 py-2 text-sm text-gray-800 bg-white
  focus:outline-none focus:ring-1 focus:border-transparent transition
  ${err ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-[#0b56a4]"}`;

// ─── Field wrapper ────────────────────────────────────────────────────────────
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

// ─── Radio card ───────────────────────────────────────────────────────────────
const RadioCard = ({ label, description, checked, onChange }) => (
  <label
    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
      ${checked ? "border-[#0b56a4] bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
  >
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
          ${!value ? "text-gray-400" : "text-gray-800"}`}
      >
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

// ─── Tile ─────────────────────────────────────────────────────────────────────
const Tile = ({ label, value, variant = "neutral" }) => {
  const styles = {
    neutral : "bg-gray-50",
    blue    : "bg-blue-50 border border-blue-100",
    green   : "bg-green-50 border border-green-100",
    amber   : "bg-amber-50 border border-amber-100",
  };
  const text = {
    neutral : "text-gray-800",
    blue    : "text-[#0b56a4]",
    green   : "text-green-700",
    amber   : "text-amber-700",
  };
  return (
    <div className={`flex flex-col gap-0.5 p-3 rounded-lg ${styles[variant]}`}>
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-bold ${text[variant]}`}>{value}</span>
    </div>
  );
};

// ─── Constants — replace with API / props when ready ─────────────────────────
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
const validate = (data, hasExcess) => {
  const errors = {};
  if (!data.block)         errors.block         = "Block is required";
  if (!data.sharing)       errors.sharing       = "Sharing type is required";
  if (!data.roomNo)        errors.roomNo        = "Room number is required";
  if (!data.roomType)      errors.roomType      = "Please select bathroom type";
  if (!data.effectiveDate) errors.effectiveDate = "Effective date is required";
  // refundMode only required when there is an excess amount
  if (hasExcess && !data.refundMode) errors.refundMode = "Please select how to handle the excess amount";
  return errors;
};

// ─── RoomChangeFlow ───────────────────────────────────────────────────────────
const RoomChangeFlow = ({ student, onClose }) => {
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [data, setData]     = useState({
    block: "", sharing: "", roomNo: "", floor: "",
    roomType: "", effectiveDate: "", refundMode: "",
  });
  const [errors, setErrors] = useState({});

  // Current room from backend — fallback to static for now
  // TODO: replace field names once backend is ready
  const currentBlock    = student?.hostelBlock       ?? "Block A";
  const currentRoom     = student?.hostelRoomNo      ?? "A-101";
  const currentSharing  = student?.hostelSharing     ?? "Double";
  const currentBathroom = student?.hostelRoomType === "attached" ? "Attached" : "Not Attached";
  const currentTotal    = student?.hostelTotalAmount ?? 18000;
  const currentPaid     = student?.hostelPaidAmount  ?? 15000;

  const set = (key, val) => {
    setData((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  // New room fee from selected sharing + bathroom
  const feeKey     = data.sharing && data.roomType ? `${data.sharing}|${data.roomType}` : null;
  const newRoomFee = feeKey ? (HOSTEL_FEES[feeKey] ?? null) : null;

  // diff = new fee − already paid
  // positive → student needs to pay more
  // zero or negative → excess, needs refund or wallet
  const diff      = newRoomFee !== null ? newRoomFee - currentPaid : null;
  const needToPay = diff !== null && diff > 0  ? diff         : null;
  const excessAmt = diff !== null && diff <= 0 ? Math.abs(diff) : null;
  const hasExcess = excessAmt !== null;

  const handleSubmit = () => {
    const errs = validate(data, hasExcess);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    // TODO: replace with your API call
    console.log("Room Change submit", { student, newRoom: data, newRoomFee, currentPaid, needToPay, excessAmt });
    onClose();
  };

  return (
    <div className="flex flex-col gap-5 mt-4">

      {/* ── Current room accordion ── */}
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

      {/* ── Current room paid info ── */}
      <div className="grid grid-cols-2 gap-3">
        <ReadOnlyField label="Current Room Total" value={fmt(currentTotal)} />
        <ReadOnlyField label="Paid Amount"        value={fmt(currentPaid)} />
      </div>

      {/* ── New room fields ── */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="New Block" required error={errors.block}>
          <select className={inputCls(errors.block) + " cursor-pointer"}
            value={data.block} onChange={(e) => set("block", e.target.value)}>
            <option value="">Select block</option>
            {BLOCKS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>

        <Field label="Sharing Type" required error={errors.sharing}>
          <select className={inputCls(errors.sharing) + " cursor-pointer"}
            value={data.sharing} onChange={(e) => set("sharing", e.target.value)}>
            <option value="">Select sharing</option>
            {SHARING_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="New Room No." required error={errors.roomNo}>
          <SearchableSelect value={data.roomNo} onChange={(val) => set("roomNo", val)}
            options={ROOM_NOS} placeholder="Search room no." error={errors.roomNo} />
        </Field>

        <Field label="Floor">
          <input className={inputCls(false)} type="text" placeholder="e.g. 2nd Floor"
            value={data.floor} onChange={(e) => set("floor", e.target.value)} />
        </Field>

        <Field label="Effective Date" required error={errors.effectiveDate}>
          <input className={inputCls(errors.effectiveDate)} type="date"
            value={data.effectiveDate} onChange={(e) => set("effectiveDate", e.target.value)} />
        </Field>
      </div>

      {/* ── Bathroom type ── */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Bathroom Type <span className="text-red-400">*</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <RadioCard label="Attached" 
            checked={data.roomType === "attached"} onChange={() => set("roomType", "attached")} />
          <RadioCard label="Not Attached" 
            checked={data.roomType === "not_attached"} onChange={() => set("roomType", "not_attached")} />
        </div>
        {errors.roomType && (
          <div className="flex items-center gap-1 mt-1.5">
            <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
            <span className="text-xs text-red-400">{errors.roomType}</span>
          </div>
        )}
      </div>

      {/* ── Fee summary — shown once sharing + bathroom selected ── */}
      {newRoomFee !== null && (
        <div className="flex flex-col gap-3">

          {/* 3 tiles: new room fee | already paid | result */}
          <div className="grid grid-cols-3 gap-3">
            <Tile label="New Room Fee"  value={fmt(newRoomFee)}   variant="neutral" />
            <Tile label="Already Paid"  value={fmt(currentPaid)}  variant="neutral" />
            {needToPay !== null && (
              <Tile label="Need to Pay"    value={fmt(needToPay)} variant="green" />
            )}
            {excessAmt !== null && (
              <Tile label="Excess Refund"  value={fmt(excessAmt)} variant="blue" />
            )}
          </div>

          {/* Refund / wallet mode — only when excess */}
          {hasExcess && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Excess Amount Mode <span className="text-red-400">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <RadioCard
                  label="Refund to Bank"
                  checked={data.refundMode === "refund"}
                  onChange={() => set("refundMode", "refund")}
                />
                <RadioCard
                  label="Student Wallet"
                  checked={data.refundMode === "wallet"}
                  onChange={() => set("refundMode", "wallet")}
                />
              </div>
              {errors.refundMode && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="text-xs text-red-400">{errors.refundMode}</span>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      <button onClick={handleSubmit}
        className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#0b56a4] text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
        Submit
      </button>

    </div>
  );
};

export default RoomChangeFlow;