import React from "react";
import { Filter, ListFilter, Search } from "lucide-react";
import CustomSelect from "./CustomSelect";
import { Download } from 'lucide-react';

export default function ReportsDetailsFilter({
  search,
  onSearchChange,
  sem,
  onSemChange,
  feesHead,
  onFeesHeadChange,
  paymentMode,
  onPaymentModeChange,
  date,
  onDateChange,
  year,
  onYearChange,
  onExport,
  selectedRows,
  onClearFilters,
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-3 items-center flex-wrap">

        {/* Search */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Receipt number"
            className="pl-4 pr-10 py-2 border border-[#D9D9D9] rounded-lg bg-white"
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* Semester */}
        <CustomSelect
          placeholder="Even Sem"
          value={sem}
          onChange={onSemChange}
          options={["Odd", "Even"]}
        />

        {/* Fees Head */}
        <CustomSelect
          placeholder="Fees Head"
          value={feesHead}
          onChange={onFeesHeadChange}
          options={["Exam Fees", "Tuition Fees", "Practical"]}
        />

        {/* Payment Mode */}
        <CustomSelect
          placeholder="Payment Mode"
          value={paymentMode}
          onChange={onPaymentModeChange}
          options={["UPI", "Cash", "Card", "Net Banking"]}
        />

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="border border-[#D9D9D9] rounded-lg px-3 py-2 bg-white"
        />

        {/* Academic Year
        <CustomSelect
          placeholder="All Years"
          value={year}
          onChange={onYearChange}
          options={["2024-2025", "2025-2026", "2026-2027"]}
        /> */}

        {/* Clear Button */}
        <button
          onClick={onClearFilters}
          className="border cursor-pointer border-gray-300 flex items-center gap-1 px-4 py-2 rounded-lg bg-white hover:bg-gray-100"
        >
          Clear <ListFilter className="w-4 h-4"/>
        </button>
      </div>

      {/* Export Button */}
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
