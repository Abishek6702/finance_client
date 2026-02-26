import React, { useState, useRef, useEffect } from "react";
import { Search, ListFilter, Calendar, X, Download } from "lucide-react";
import CustomSelect from "./CustomSelect";

export default function ReportsDetailsFilter({
  search,
  onSearchChange,
  sem,
  onSemChange,
  feesHead,
  onFeesHeadChange,
  paymentMode,
  onPaymentModeChange,
  dateRange = { start: "", end: "" },
  onDateRangeChange,
  onExport,
  selectedRows = [],
  onClearFilters,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getDateLabel = () => {
    if (!dateRange?.start) return "Date";
    return dateRange.end ? `${dateRange.start} to ${dateRange.end}` : dateRange.start;
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-3 items-center flex-wrap">
        {/* Search */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Receipt number"
            className="pl-4 pr-10 py-2 border border-[#D9D9D9] rounded-lg bg-white outline-none"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <CustomSelect placeholder="Even Sem" value={sem} onChange={onSemChange} options={["Odd", "Even"]} />
        <CustomSelect placeholder="Fees Head" value={feesHead} onChange={onFeesHeadChange} options={["Exam Fees", "Tuition Fees", "Practical"]} />
        <CustomSelect placeholder="Payment Mode" value={paymentMode} onChange={onPaymentModeChange} options={["UPI", "Cash", "Card", "Net Banking"]} />

        {/* Date Range Popover */}
        <div className="relative" ref={popoverRef}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="border border-[#D9D9D9] rounded-lg px-3 py-2 bg-white flex items-center gap-2 cursor-pointer min-w-[150px]"
          >
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm">{getDateLabel()}</span>
          </div>

          {isOpen && (
            <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 shadow-xl rounded-xl p-4 min-w-[250px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Range</span>
                <X size={14} className="cursor-pointer" onClick={() => setIsOpen(false)} />
              </div>
              <div className="space-y-3">
                <input
                  type="date"
                  value={dateRange?.start || ""}
                  onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                  className="w-full border rounded p-1.5 text-sm outline-none"
                />
                <input
                  type="date"
                  value={dateRange?.end || ""}
                  onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                  className="w-full border rounded p-1.5 text-sm outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClearFilters}
          className="border cursor-pointer border-gray-300 flex items-center gap-1 px-4 py-2 rounded-lg bg-white hover:bg-gray-100"
        >
          Clear <ListFilter className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onExport}
        className="bg-[#1F5AA6] text-white px-5 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
      >
        <Download size={18} />
        <span>Export ({selectedRows.length})</span>
      </button>
    </div>
  );
}