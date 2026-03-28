import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, ChevronDown, Search, CheckCircle2 } from "lucide-react";
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

// ─── Info tile ────────────────────────────────────────────────────────────────
const Tile = ({ label, value, highlight, green }) => (
  <div
    className={`flex flex-col gap-0.5 p-3 rounded-lg ${
      highlight
        ? "bg-blue-50 border border-blue-100"
        : green
          ? "bg-green-50 border border-green-100"
          : "bg-gray-50"
    }`}
  >
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
      {label}
    </span>
    <span
      className={`text-sm font-bold ${
        highlight
          ? "text-[#0b56a4]"
          : green
            ? "text-green-700"
            : "text-gray-800"
      }`}
    >
      {value}
    </span>
  </div>
);

// ─── Radio card ───────────────────────────────────────────────────────────────
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

  const filtered = (options || []).filter(
    (o) =>
      typeof o === "string" && o.toLowerCase().includes(query.toLowerCase()),
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
          focus:outline-none focus:ring-2 focus:border-transparent
          ${
            disabled
              ? "bg-gray-50 cursor-not-allowed text-gray-400 border-gray-100"
              : error
                ? "border-red-400 focus:ring-red-400 text-gray-800"
                : "border-gray-200 focus:ring-[#0b56a4]"
          }
          ${!disabled && !value ? "text-gray-400" : ""}`}
      >
        <span className={value ? "text-gray-800" : ""}>
          {value || placeholder}
        </span>
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

// ─── Table Row ────────────────────────────────────────────────────────────────
const TableRow = ({ label, value, isHeader, valueGreen }) => (
  <div
    className={`flex items-center justify-between px-4 py-2.5
    ${isHeader ? "bg-gray-50" : "border-t border-gray-100 bg-white"}`}
  >
    <span
      className={
        isHeader
          ? "text-xs font-semibold text-gray-400 uppercase tracking-wide"
          : "text-sm text-gray-500"
      }
    >
      {label}
    </span>
    <span
      className={
        isHeader
          ? "text-xs font-semibold text-gray-400 uppercase tracking-wide"
          : `text-sm font-semibold ${valueGreen ? "text-green-600" : "text-gray-800"}`
      }
    >
      {value}
    </span>
  </div>
);

// ─── Static mock data — replace with API / props when ready ──────────────────
const ROUTES = [
  "Route 1 - City Center",
  "Route 2 - East Campus",
  "Route 3 - West Zone",
  "Route 4 - North Hub",
];
const BUS_NOS = [
  "TN-01-AB-1234",
  "TN-02-CD-5678",
  "TN-03-EF-9012",
  "TN-04-GH-3456",
];
const STOPS_MAP = {
  "Route 1 - City Center": [
    "Stop A - Main Gate",
    "Stop B - Market",
    "Stop C - Hospital",
    "Stop D - City Center",
  ],
  "Route 2 - East Campus": [
    "Stop A - Main Gate",
    "Stop E - East Park",
    "Stop F - Lake View",
    "Stop G - East Campus",
  ],
  "Route 3 - West Zone": [
    "Stop A - Main Gate",
    "Stop H - West Mall",
    "Stop I - Tech Park",
    "Stop J - West Zone",
  ],
  "Route 4 - North Hub": [
    "Stop A - Main Gate",
    "Stop K - North Gate",
    "Stop L - Stadium",
    "Stop M - North Hub",
  ],
};

// Route fee map — replace with API / props once ready
// Key matches the route name in ROUTES array
const ROUTE_FEES = {
  "Route 1 - City Center": 15000,
  "Route 2 - East Campus": 18000,
  "Route 3 - West Zone": 12000,
  "Route 4 - North Hub": 20000,
};

// ─── Validation ───────────────────────────────────────────────────────────────
const validateFee = (data) => {
  const errors = {};
  if (!data.academicYear) errors.academicYear = "Academic year is required";

  if (!data.endDate) errors.endDate = "End date is required";
  if (!data.conceptionAmount)
    errors.conceptionAmount = "Conception amount is required";
  if (data.refundMode === "refund" && !data.refundMethod)
    errors.refundMethod = "Please select cash or bank"; // 👈 add this

  if (data.refundMode === "refund" && data.refundMethod === "bank") {
    if (!data.paymentFrom) errors.paymentFrom = "Payment from is required";
    if (!data.studentAccountNumber)
      errors.studentAccountNumber = "Student account number is required";
    if (!data.StudentbankName)
      errors.StudentbankName = "Student bank name is required";
  }
  return errors;
};

const validateRoute = (data) => {
  const errors = {};
  if (!data.newRoute) errors.newRoute = "Please select a route";
  if (!data.newStop) errors.newStop = "Please select a stop";
  if (!data.newBusNo) errors.newBusNo = "Please select a bus number";
  if (!data.effectiveDate) errors.effectiveDate = "Effective date is required";
  if (data.refundMode === "refund" && !data.refundMethod)
    errors.refundMethod = "Please select cash or bank";
  return errors;
};

const { current, list: academicYear } = getAcademicYears();

// ─── RouteChangeFlow ──────────────────────────────────────────────────────────
const RouteChangeFlow = ({ student, onClose }) => {
  const [step, setStep] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [transportData, setTransportData] = useState([]);
  const [transportInfo, setTransportInfo] = useState({
    routes: [],
    busNos: [],
  });
  const [currentRouteData, setCurrentRouteData] = useState([]);

  // From backend — fallback to static for now
  const totalAmount = currentRouteData?.fee;
  const paidAmount = currentRouteData?.paid;
  const currentRoute = currentRouteData?.route;
  const currentStop = currentRouteData?.stop;
  const currentBusNo = currentRouteData?.busNo;

  const [fee, setFee] = useState({
    academicYear: current,
    endDate: "",
    conceptionAmount: "",
    refundMode: "",
    refundMethod: "",
    paymentFrom: "",
    studentAccountNumber: "",
    StudentbankName: "",
  });

  const [route, setRoute] = useState({
    newRoute: "",
    newStop: "",
    newBusNo: "",
    effectiveDate: "",
    reductionAmount: "",
  });

  const [feeErrors, setFeeErrors] = useState({});
  const [routeErrors, setRouteErrors] = useState({});

  const setF = (key, val) => {
    setFee((p) => ({ ...p, [key]: val }));
    if (feeErrors[key]) setFeeErrors((p) => ({ ...p, [key]: "" }));
  };

  const setR = (key, val) => {
    if (key === "newRoute") {
      setRoute((p) => ({
        ...p,
        newRoute: val,
        newStop: "",
        newBusNo: "",
      }));
    } else {
      setRoute((p) => ({ ...p, [key]: val }));
    }
  };

  // Step 1 calculations
  const balance = Math.max(
    0,
    paidAmount - (parseFloat(fee.conceptionAmount) || 0),
  );

  const selectedRoute = transportData.find(
    (item) => item.route === route.newRoute && item.busNo === route.newBusNo,
  );

  const selectedStop = selectedRoute?.stops?.find(
    (s) => s.stop === route.newStop,
  );

  const newRouteFee = selectedStop?.fee ?? null;
  const transportId = selectedStop?.id ?? null;

  const routeSelected = route.newRoute && route.newStop && route.newBusNo;
  const reductionAmt = parseFloat(route.reductionAmount) || 0;
  const needToPay =
    newRouteFee !== null ? Math.max(0, newRouteFee - reductionAmt) : null;

  const availableStops = STOPS_MAP[route.newRoute] || [];

  const fetchCurrentRoute = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/feedemands/${student.rollNo}?academicYear=${fee.academicYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = res.data;
      console.log("Current route data fetched:", json);
      if (json.success) {
        setCurrentRouteData(json.data.studentType.transportDetails);
        // setHostelInfo(json.data.info);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurrentRoute();
  }, []);
  const fetchTransport = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/transport`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const json = res.data;
      // console.log("Transport data fetched:", json);
      if (json.success) {
        setTransportData(json.data.detailed);
        setTransportInfo(json.data.info);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransport();
  }, []);
  const handleContinue = () => {
    const errors = validateFee(fee);
    if (Object.keys(errors).length > 0) {
      setFeeErrors(errors);
      return;
    }
    setStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const errors = validateRoute(route);
    if (Object.keys(errors).length > 0) {
      setRouteErrors(errors);
      return;
    }
    setRouteErrors({});
    try {
      const token = localStorage.getItem("token");

      const payload = {
        cancel: {
          facilityType: "transport",
          applyFromAcademicYear: fee.academicYear,
          endDate: fee.endDate,
          conceptionAmount: parseFloat(fee.conceptionAmount),

          ...(balance > 0 && {
            refundAmount: balance,
            refundMode:
              fee.refundMode === "wallet"
                ? "wallet"
                : fee.refundMethod,

            ...(fee.refundMethod === "bank" && {
              collegeAccount: fee.paymentFrom,
              studentBankName: fee.StudentbankName,
              studentAccount: fee.studentAccountNumber,
            }),
          }),
        },
        assign: {
          transport: {
            isApplicable: true,
            id: transportId,
          },
          applyFromAcademicYear: fee.academicYear,
          effectiveDate: route.effectiveDate,
          ...(route.reductionAmount > 0 && {
            reduction: parseFloat(route.reductionAmount),
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
        toast.success("Transport requirement updated successfully!");
        onClose();
      }
    } catch (err) {
      console.error("POST ERROR:", err);
      setLoading(false);
    }
  };

  const selectedRouteData = transportData.find(
    (t) => t.route === route.newRoute,
  );

  const stopOptions = selectedRouteData?.stops?.map((s) => s.stop) || [];

  const busOptions = [
    ...new Set(
      transportData
        .filter((t) => t.route === route.newRoute)
        .map((t) => t.busNo),
    ),
  ];

  return (
    <div className="flex flex-col gap-6 mt-4">
      <Field label="Academic Year" required error={feeErrors.academicYear}>
        <select
          className={inputCls(feeErrors.academicYear) + " cursor-pointer"}
          value={fee.academicYear}
          onChange={(e) => setF("academicYear", e.target.value)}
        >
          <option value="">Select Academic year</option>
          {academicYear.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </Field>
      {/* ─── Step 0: Fee Summary ─── */}
      {step === 0 && (
        <>
          {/* Current Route Accordion */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setAccordionOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="text-sm font-semibold text-gray-700">
                Current Route Details
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${accordionOpen ? "rotate-180" : ""}`}
              />
            </button>

            {accordionOpen && (
              <>
                <TableRow label="Route" value={currentRoute} />
                <TableRow label="Bus Number" value={currentBusNo} />
                <TableRow label="Current Stop" value={currentStop} />
              </>
            )}
          </div>

          {/* Fee fields */}
          <div className="grid grid-cols-2 gap-3">
            <ReadOnlyField
              label="Total Transport Amount"
              value={fmt(totalAmount)}
            />
            <ReadOnlyField label="Paid Amount" value={fmt(paidAmount)} />

            <Field
              label="Transport End Date"
              required
              error={feeErrors.endDate}
            >
              <input
                className={inputCls(feeErrors.endDate)}
                type="date"
                value={fee.endDate}
                onChange={(e) => setF("endDate", e.target.value)}
              />
            </Field>

            <Field
              label="Conception Amount"
              required
              error={feeErrors.conceptionAmount}
            >
              <input
                className={inputCls(feeErrors.conceptionAmount)}
                type="number"
                min="0"
                placeholder="0.00"
                value={fee.conceptionAmount}
                onChange={(e) => setF("conceptionAmount", e.target.value)}
              />
            </Field>
          </div>

          {/* Balance tiles */}
          <div className="grid grid-cols-3 gap-3">
            <Tile label="Paid Amount" value={fmt(paidAmount)} />
            <Tile label="Conception Amount" value={fmt(fee.conceptionAmount)} />
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
                  checked={fee.refundMode === "refund"}
                  onChange={() => setF("refundMode", "refund")}
                />
                <RadioCard
                  label="Student Wallet"
                  checked={fee.refundMode === "wallet"}
                  // change Student Wallet onChange to:
                  onChange={() => {
                    setF("refundMode", "wallet");
                    setF("refundMethod", "");
                  }}
                />
              </div>
              {feeErrors.refundMode && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="text-xs text-red-400">
                    {feeErrors.refundMode}
                  </span>
                </div>
              )}

              {fee.refundMode === "refund" && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Refund Via <span className="text-red-400">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <RadioCard
                      label="Cash"
                      checked={fee.refundMethod === "cash"}
                      onChange={() => setF("refundMethod", "cash")}
                    />
                    <RadioCard
                      label="Bank"
                      checked={fee.refundMethod === "bank"}
                      onChange={() => setF("refundMethod", "bank")}
                    />
                  </div>
                  {feeErrors.refundMethod && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="text-xs text-red-400">
                        {feeErrors.refundMethod}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {fee.refundMethod === "bank" && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Field
                    label="Payment from"
                    required
                    error={feeErrors.paymentFrom}
                  >
                    <input
                      className={inputCls(feeErrors.paymentFrom)}
                      type="text"
                      placeholder="Enter payment from"
                      value={fee.paymentFrom}
                      onChange={(e) => setF("paymentFrom", e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Student Account Number"
                    required
                    error={feeErrors.studentAccountNumber}
                  >
                    <input
                      className={inputCls(feeErrors.studentAccountNumber)}
                      type="text"
                      placeholder="Enter student account number"
                      value={fee.studentAccountNumber}
                      onChange={(e) =>
                        setF("studentAccountNumber", e.target.value)
                      }
                    />
                  </Field>
                  <Field
                    label="Student Bank name"
                    required
                    error={feeErrors.StudentbankName}
                  >
                    <input
                      className={inputCls(feeErrors.StudentbankName)}
                      type="text"
                      placeholder="Enter student bank name"
                      value={fee.StudentbankName}
                      onChange={(e) => setF("StudentbankName", e.target.value)}
                    />
                  </Field>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleContinue}
            className="w-full cursor-pointer py-2.5 rounded-lg text-sm font-semibold bg-[#0b56a4] text-white hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Continue →
          </button>
        </>
      )}

      {/* ─── Step 1: New Route Selection ─── */}
      {step === 1 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="New Route" required error={routeErrors.newRoute}>
              <SearchableSelect
                value={route.newRoute || ""}
                onChange={(val) => setR("newRoute", val)}
                options={transportInfo.routes}
                placeholder="Select route"
                error={routeErrors.newRoute}
              />
            </Field>
            <Field label="Bus Number" required error={routeErrors.newBusNo}>
              <SearchableSelect
                value={route.newBusNo || ""}
                onChange={(val) => setR("newBusNo", val)}
                options={busOptions}
                placeholder="Select bus"
                error={routeErrors.newBusNo}
                disabled={!route.newRoute}
              />
            </Field>
            <Field label="Route Stop" required error={routeErrors.newStop}>
              <SearchableSelect
                value={route.newStop || ""}
                onChange={(val) => setR("newStop", val)}
                options={stopOptions}
                placeholder={
                  route.newRoute ? "Select stop" : "Select route first"
                }
                error={routeErrors.newStop}
                disabled={!route.newRoute}
              />
            </Field>

            <Field
              label="Effective Date"
              required
              error={routeErrors.effectiveDate}
            >
              <input
                className={inputCls(routeErrors.effectiveDate)}
                type="date"
                value={route.effectiveDate}
                onChange={(e) => setR("effectiveDate", e.target.value)}
              />
            </Field>
          </div>

          {/* Fee summary — only shown once route + stop + bus are all selected */}
          {routeSelected && (
            <div className="flex flex-col gap-3">
              {/* Total fee read-only */}
              <div className="grid grid-cols-2 gap-3">
                <ReadOnlyField
                  label="Total Route Fee"
                  value={fmt(newRouteFee)}
                />

                <Field label="Reduction Amount">
                  <input
                    className={inputCls(false)}
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={route.reductionAmount}
                    onChange={(e) => setR("reductionAmount", e.target.value)}
                  />
                </Field>
              </div>

              {/* Need to pay tile — only when reduction is entered */}
              {route.reductionAmount !== "" && (
                <>
                  <Tile label="Need to be Paid" value={fmt(needToPay)} green />
                </>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="flex-1 py-2.5 rounded-lg text-sm cursor-pointer font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-[#0b56a4] cursor-pointer text-white hover:opacity-90 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Route Change"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RouteChangeFlow;
