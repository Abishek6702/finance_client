import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, ChevronDown, Search } from "lucide-react";

// ─── Utilities ────────────────────────────────────────────────────────────────
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

// ─── Searchable Select ────────────────────────────────────────────────────────
const SearchableSelect = ({ value, onChange, options, placeholder, error, disabled }) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const containerRef      = useRef(null);
  const inputRef          = useRef(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
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

  const handleSelect = (val) => { onChange(val); setOpen(false); setQuery(""); };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); } }}
        className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 text-sm bg-white transition
          focus:outline-none focus:ring-1 focus:border-transparent
          ${disabled ? "bg-gray-50 cursor-not-allowed text-gray-400 border-gray-100" :
            error    ? "border-red-400 focus:ring-red-400" :
                       "border-gray-200 focus:ring-[#0b56a4]"}
          ${!value ? "text-gray-400" : "text-gray-800"}`}
      >
        <span>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
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
              filtered.map((opt) => (
                <li
                  key={opt}
                  onMouseDown={() => handleSelect(opt)}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors
                    ${value === opt ? "bg-blue-50 text-[#0b56a4] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {opt}
                </li>
              ))
            ) : (
              <li className="px-3 py-3 text-sm text-gray-400 text-center">No results found</li>
            )}
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

// Fee per route — replace with API when ready
const ROUTE_FEES = {
  "Route 1 - City Center": 15000,
  "Route 2 - East Campus": 18000,
  "Route 3 - West Zone":   12000,
  "Route 4 - North Hub":   20000,
};

// ─── Validation ───────────────────────────────────────────────────────────────
const validate = (data) => {
  const errors = {};
  if (!data.route)         errors.route         = "Please select a route";
  if (!data.stop)          errors.stop          = "Please select a stop";
  if (!data.busNo)         errors.busNo         = "Please select a bus number";
  if (!data.effectiveDate) errors.effectiveDate = "Effective date is required";
  return errors;
};

// ─── RequiresTransportFlow ────────────────────────────────────────────────────
const RequiresTransportFlow = ({ student, onClose }) => {
  const [data, setData]     = useState({ route: "", stop: "", busNo: "", effectiveDate: "", reductionAmount: "" });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    // reset stop when route changes
    if (key === "route") {
      setData((p) => ({ ...p, route: val, stop: "" }));
    } else {
      setData((p) => ({ ...p, [key]: val }));
    }
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const availableStops = STOPS_MAP[data.route] || [];

  // Show fee only once all 3 selected
  const allSelected  = data.route && data.stop && data.busNo;
  const totalAmount  = allSelected ? (ROUTE_FEES[data.route] ?? null) : null;
  const reductionAmt = parseFloat(data.reductionAmount) || 0;
  const needToPay    = totalAmount !== null ? Math.max(0, totalAmount - reductionAmt) : null;

  const handleSubmit = () => {
    const errs = validate(data);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    // TODO: replace with your API call
    console.log("Requires Transport submit", { student, transport: data,  });
    onClose();
  };

  return (
    <div className="flex flex-col gap-5 mt-4">

      <div className="grid grid-cols-2 gap-3">
        <Field label="Route" required error={errors.route}>
          <SearchableSelect
            value={data.route}
            onChange={(val) => set("route", val)}
            options={ROUTES}
            placeholder="Select route"
            error={errors.route}
          />
        </Field>

        <Field label="Stop" required error={errors.stop}>
          <SearchableSelect
            value={data.stop}
            onChange={(val) => set("stop", val)}
            options={availableStops}
            placeholder={data.route ? "Select stop" : "Select route first"}
            error={errors.stop}
            disabled={!data.route}
          />
        </Field>

        <Field label="Bus No." required error={errors.busNo}>
          <SearchableSelect
            value={data.busNo}
            onChange={(val) => set("busNo", val)}
            options={BUS_NOS}
            placeholder="Select bus"
            error={errors.busNo}
          />
        </Field>
        <Field label="Effective Date" required error={errors.effectiveDate}>
          <input
            className={inputCls(errors.effectiveDate)}
            type="date"
            value={data.effectiveDate}
            onChange={(e) => set("effectiveDate", e.target.value)}
          />
        </Field>
      </div>

      {/* Fee section — shown once route + stop + bus all selected */}
      {totalAmount !== null && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Total amount read-only */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Total Amount</label>
              <div className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 cursor-not-allowed select-none">
                {fmt(totalAmount)}
              </div>
            </div>

            {/* Reduction input */}
            <Field label="Reduction Amount">
              <input
                className={inputCls(false)}
                type="number"
                min="0"
                placeholder="0.00"
                value={data.reductionAmount}
                onChange={(e) => set("reductionAmount", e.target.value)}
              />
            </Field>
          </div>

          {/* Need to pay — shown once reduction entered */}
          {data.reductionAmount !== "" && (
            <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-100 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Need to be Paid</span>
              <span className="text-base font-bold text-green-700">{fmt(needToPay)}</span>
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

export default RequiresTransportFlow;