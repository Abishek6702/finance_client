import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, ChevronDown, Search } from "lucide-react";
import axios from "axios";

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

// ─── Searchable Select ────────────────────────────────────────────────────────
const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase()),
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

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
        className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 text-sm bg-white transition
          focus:outline-none focus:ring-1 focus:border-transparent
          ${
            disabled
              ? "bg-gray-50 cursor-not-allowed text-gray-400 border-gray-100"
              : error
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-200 focus:ring-[#0b56a4]"
          }
          ${!value ? "text-gray-400" : "text-gray-800"}`}
      >
        <span>{value || placeholder}</span>
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
              <li className="px-3 py-3 text-sm text-gray-400 text-center">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// ─── Constants — replace with API / props when ready ─────────────────────────
const { current, list: academicYear } = getAcademicYears();

// ─── Validation ───────────────────────────────────────────────────────────────
const validate = (data) => {
  const errors = {};
  if (!data.block) errors.block = "Block is required";
  if (!data.academicYear) errors.academicYear = "Academic year is required";

  if (!data.sharing) errors.sharing = "Sharing type is required";
  if (!data.roomType) errors.roomType = "Please select bathroom type";
  if (!data.effectiveDate) errors.effectiveDate = "Effective date is required";
  return errors;
};

// ─── RequiresHostelFlow ───────────────────────────────────────────────────────
const RequiresHostelFlow = ({ student, onClose }) => {
  const [data, setData] = useState({
    academicYear: current,
    block: "",
    sharing: "",
    floor: "",
    roomType: "",
    effectiveDate: "",
    reductionAmount: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [hostelData, setHostelData] = useState([]);
  const [hostelInfo, setHostelInfo] = useState({
    blocks: [],
    sharing: [],
    isAttached: [],
  });

  const selectedHostel = hostelData.find(
    (item) =>
      item.block === data.block &&
      item.sharing === Number(data.sharing) &&
      item.isAttached === (data.roomType === "attached"),
  );

  const fetchHostel = async () => {
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
        setHostelData(json.data.detailed);
        setHostelInfo(json.data.info);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHostel();
  }, []);

  const set = (key, val) => {
    setData((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  // Show fee once sharing + roomType both selected
  const totalAmount = selectedHostel?.fee ?? null;
  const hostelId = selectedHostel?.id ?? null;
  const reductionAmt = parseFloat(data.reductionAmount) || 0;
  const needToPay =
    totalAmount !== null ? Math.max(0, totalAmount - reductionAmt) : null;

  const handleSubmit = async () => {
    setLoading(true);
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
        effectiveDate: data.effectiveDate,
        hostel: {
          isApplicable: true,
          id: hostelId,
        },
        reduction: reductionAmt,
        // needToPay: needToPay,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/studentFacility/assign/${student.rollNo}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // console.log("SUCCESS:", payload);
      setLoading(false);
      onClose(); // close modal after success
    } catch (err) {
      console.error("POST ERROR:", err);
    }
  };

  return (
    <div className="flex flex-col gap-5 mt-4">
      <div className="grid grid-cols-2 gap-3">
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

        <Field label="Block" required error={errors.block}>
          <select
            className={inputCls(errors.block) + " cursor-pointer"}
            value={data.block}
            onChange={(e) => set("block", e.target.value)}
          >
            <option value="">Select block</option>
            {hostelInfo.blocks.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sharing Type" required error={errors.sharing}>
          <select
            className={inputCls(errors.sharing) + " cursor-pointer"}
            value={data.sharing}
            onChange={(e) => set("sharing", e.target.value)}
          >
            <option value="">Select sharing</option>
            {hostelInfo.sharing.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
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

      {/* Bathroom type */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Bathroom Type <span className="text-red-400">*</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <RadioCard
            label="Attached"
            checked={data.roomType === "attached"}
            onChange={() => set("roomType", "attached")}
          />
          <RadioCard
            label="Not Attached"
            checked={data.roomType === "not_attached"}
            onChange={() => set("roomType", "not_attached")}
          />
        </div>
        {errors.roomType && (
          <div className="flex items-center gap-1 mt-1.5">
            <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
            <span className="text-xs text-red-400">{errors.roomType}</span>
          </div>
        )}
      </div>

      {/* Fee section — shown once sharing + bathroom type selected */}
      {totalAmount !== null && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Total amount read-only */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Total Amount
              </label>
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
              <span className="text-sm font-medium text-gray-600">
                Need to be Paid
              </span>
              <span className="text-base font-bold text-green-700">
                {fmt(needToPay)}
              </span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className={`w-full py-2.5 rounded-lg text-sm font-semibold bg-[#0b56a4] text-white hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default RequiresHostelFlow;
