import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, ChevronDown, Search, CheckCircle2 } from "lucide-react";

const fmt = (val) =>
  isNaN(parseFloat(val))
    ? "₹ —"
    : `₹ ${parseFloat(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const inputCls = (err) =>
  `w-full border rounded-lg px-3 py-2 text-sm text-gray-800 bg-white
  focus:outline-none focus:ring-1 focus:border-transparent transition
  ${err ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-[#0b56a4]"}`;

// ─── Read-only field ──────────────────────────────────────────────────────────
const ReadOnlyField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 cursor-not-allowed select-none">
      {value}
    </div>
  </div>
);

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

// ─── Tile ─────────────────────────────────────────────────────────────────────
const Tile = ({ label, value, highlight }) => (
  <div className={`flex flex-col gap-0.5 p-3 rounded-lg ${highlight ? "bg-blue-50 border border-blue-100" : "bg-gray-50"}`}>
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
    <span className={`text-sm font-bold ${highlight ? "text-[#0b56a4]" : "text-gray-800"}`}>{value}</span>
  </div>
);

// ─── Radio card ───────────────────────────────────────────────────────────────
const RadioCard = ({ label, checked, onChange }) => (
  <label
    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
      ${checked ? "border-[#0b56a4] bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
  >
    <input type="radio" className="accent-[#0b56a4]" checked={checked} onChange={onChange} />
    <p className={`text-sm font-semibold ${checked ? "text-[#0b56a4]" : "text-gray-700"}`}>{label}</p>
  </label>
);

// ─── Table row (for current details) ─────────────────────────────────────────
const TableRow = ({ label, value }) => (
  <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-white">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value}</span>
  </div>
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

// ─── Constants — replace with API / props when ready ─────────────────────────
const ROUTES  = ["Route 1 - City Center", "Route 2 - East Campus", "Route 3 - West Zone", "Route 4 - North Hub"];
const BUS_NOS = ["TN-01-AB-1234", "TN-02-CD-5678", "TN-03-EF-9012", "TN-04-GH-3456"];
const STOPS_MAP = {
  "Route 1 - City Center": ["Stop A - Main Gate", "Stop B - Market",    "Stop C - Hospital",  "Stop D - City Center"],
  "Route 2 - East Campus": ["Stop A - Main Gate", "Stop E - East Park", "Stop F - Lake View", "Stop G - East Campus"],
  "Route 3 - West Zone":   ["Stop A - Main Gate", "Stop H - West Mall", "Stop I - Tech Park", "Stop J - West Zone"],
  "Route 4 - North Hub":   ["Stop A - Main Gate", "Stop K - North Gate","Stop L - Stadium",   "Stop M - North Hub"],
};
const ROUTE_FEES = {
  "Route 1 - City Center": 15000,
  "Route 2 - East Campus": 18000,
  "Route 3 - West Zone":   12000,
  "Route 4 - North Hub":   20000,
};

// ─── Validation ───────────────────────────────────────────────────────────────
const validateTransport = (data) => {
  const errors = {};
  if (!data.route)         errors.route         = "Please select a route";
  if (!data.stop)          errors.stop          = "Please select a stop";
  if (!data.busNo)         errors.busNo         = "Please select a bus number";
  if (!data.effectiveDate) errors.effectiveDate = "Effective date is required";
  return errors;
};

// ─── RequireTransportFlow ─────────────────────────────────────────────────────
const RequireTransportFlow = ({ student, onClose }) => {
  const [step, setStep]             = useState(0);
  const [accordionOpen, setAccordionOpen] = useState(true);

  // Current hostel details — from backend, fallback to static for now
  // TODO: replace field names once backend is ready
  const currentBlock    = student?.hostelBlock      ?? "Block A";
  const currentRoom     = student?.hostelRoomNo     ?? "A-101";
  const currentSharing  = student?.hostelSharing    ?? "Double";
  const currentBathroom = student?.hostelRoomType === "attached" ? "Attached" : "Not Attached";
  const hostelPaid      = student?.hostelPaidAmount ?? 18000;
  const hostelTotal     = student?.hostelTotalAmount ?? 25000;

  // Step 0 hostel closing state
  const [hostelClose, setHostelClose] = useState({
    endDate: "", conceptionAmount: "", refundMode: "",
  });
  const [hostelErrors, setHostelErrors] = useState({});

  const setH = (key, val) => {
    setHostelClose((p) => ({ ...p, [key]: val }));
    if (hostelErrors[key]) setHostelErrors((p) => ({ ...p, [key]: "" }));
  };

  const balance = Math.max(
    0,
    hostelPaid - (parseFloat(hostelClose.conceptionAmount) || 0)
  );

  const validateHostelClose = (data) => {
    const errors = {};
    if (!data.endDate)          errors.endDate          = "End date is required";
    if (!data.conceptionAmount) errors.conceptionAmount = "Conception amount is required";
    if (!data.refundMode)       errors.refundMode       = "Please select a refund mode";
    return errors;
  };

  // Step 1 transport state
  const [transport, setTransport] = useState({
    route: "", stop: "", busNo: "", effectiveDate: "", reductionAmount: "",
  });
  const [errors, setErrors] = useState({});

  const setT = (key, val) => {
    if (key === "route") setTransport((p) => ({ ...p, route: val, stop: "" }));
    else                 setTransport((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const availableStops = STOPS_MAP[transport.route] || [];
  const allSelected    = transport.route && transport.stop && transport.busNo;
  const totalAmount    = allSelected ? (ROUTE_FEES[transport.route] ?? null) : null;
  const reductionAmt   = parseFloat(transport.reductionAmount) || 0;
  const needToPay      = totalAmount !== null ? Math.max(0, totalAmount - reductionAmt) : null;

  const handleContinue = () => {
    const errs = validateHostelClose(hostelClose);
    if (Object.keys(errs).length > 0) { setHostelErrors(errs); return; }
    setStep(1);
  };

  const handleSubmit = () => {
    const errs = validateTransport(transport);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    console.log("Require Transport submit", { student, transport, needToPay });
    onClose();
  };

  return (
    <div className="flex flex-col gap-5 mt-4">


      {/* ── Step 0: Hostel closing details ── */}
      {step === 0 && (
        <>
          {/* Current hostel details table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setAccordionOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="text-sm font-semibold text-gray-700">Current Hostel Details</span>
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

          {/* Paid details — read-only from backend */}
          <div className="grid grid-cols-2 gap-3">
            <ReadOnlyField label="Total Hostel Amount" value={fmt(hostelTotal)} />
            <ReadOnlyField label="Paid Amount"         value={fmt(hostelPaid)} />

            <Field label="Hostel End Date" required error={hostelErrors.endDate}>
              <input className={inputCls(hostelErrors.endDate)} type="date"
                value={hostelClose.endDate}
                onChange={(e) => setH("endDate", e.target.value)} />
            </Field>

            <Field label="Conception Amount" required error={hostelErrors.conceptionAmount}>
              <input className={inputCls(hostelErrors.conceptionAmount)} type="number" min="0" placeholder="0.00"
                value={hostelClose.conceptionAmount}
                onChange={(e) => setH("conceptionAmount", e.target.value)} />
            </Field>
          </div>

          {/* Balance tiles */}
          <div className="grid grid-cols-3 gap-3">
            <Tile label="Paid Amount"          value={fmt(hostelPaid)} />
            <Tile label="Conception Amount"    value={fmt(hostelClose.conceptionAmount)} />
            <Tile label="Balance (Refundable)" value={fmt(balance)} highlight />
          </div>

          {/* Refund mode */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Refund Mode <span className="text-red-400">*</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <RadioCard label="Refund"
                checked={hostelClose.refundMode === "refund"}
                onChange={() => setH("refundMode", "refund")} />
              <RadioCard label="Student Wallet"
                checked={hostelClose.refundMode === "wallet"}
                onChange={() => setH("refundMode", "wallet")} />
            </div>
            {hostelErrors.refundMode && (
              <div className="flex items-center gap-1 mt-1.5">
                <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                <span className="text-xs text-red-400">{hostelErrors.refundMode}</span>
              </div>
            )}
          </div>

          <button onClick={handleContinue}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#0b56a4] text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
            Continue →
          </button>
        </>
      )}

      {/* ── Step 1: Transport selection ── */}
      {step === 1 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Route" required error={errors.route}>
              <SearchableSelect value={transport.route} onChange={(val) => setT("route", val)}
                options={ROUTES} placeholder="Select route" error={errors.route} />
            </Field>

            <Field label="Stop" required error={errors.stop}>
              <SearchableSelect value={transport.stop} onChange={(val) => setT("stop", val)}
                options={availableStops}
                placeholder={transport.route ? "Select stop" : "Select route first"}
                error={errors.stop} disabled={!transport.route} />
            </Field>

            <Field label="Bus No." required error={errors.busNo}>
              <SearchableSelect value={transport.busNo} onChange={(val) => setT("busNo", val)}
                options={BUS_NOS} placeholder="Select bus" error={errors.busNo} />
            </Field>

            <Field label="Effective Date" required error={errors.effectiveDate}>
              <input className={inputCls(errors.effectiveDate)} type="date"
                value={transport.effectiveDate}
                onChange={(e) => setT("effectiveDate", e.target.value)} />
            </Field>
          </div>

          {/* Fee — shown once route + stop + bus selected */}
          {totalAmount !== null && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <ReadOnlyField label="Total Amount" value={fmt(totalAmount)} />
                <Field label="Reduction Amount">
                  <input className={inputCls(false)} type="number" min="0" placeholder="0.00"
                    value={transport.reductionAmount}
                    onChange={(e) => setT("reductionAmount", e.target.value)} />
                </Field>
              </div>
              {transport.reductionAmount !== "" && (
                <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Need to be Paid</span>
                  <span className="text-base font-bold text-green-700">{fmt(needToPay)}</span>
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

export default RequireTransportFlow;