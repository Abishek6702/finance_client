import React, { useState } from "react";
import ClassWiseFeeReportFilter from "./ClassWiseFeeReportFilter.jsx";
import { Download } from "lucide-react";
import ReportData from "../utils/ReportData.js";

const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN")}`;

const fmt = (amount) => Number(amount || 0).toLocaleString("en-IN");

// Fee heads — extend or derive from real data as needed
const FEE_HEADS = ["ERP & Skill Rack", "Exam Fees"];

const ClassWiseFeeReport = () => {
  const [isExportMode, setIsExportMode] = useState(false);
  const [filters, setFilters] = useState({
    academicYear: "",
    department: "",
    year: "",
    section: "",
    status: ""
  });

  const report = ReportData[0];
  const students = report?.students || [];
  const total = report?.total || {};

  const filteredStudents = students.filter((student) => {
    const details = student.studentDetails;

    return (
      (!filters.academicYear || report.academicYear === filters.academicYear) &&
      (!filters.department || details.department === filters.department) &&
      (!filters.year || details.year === filters.year) &&
      (!filters.section || details.section === filters.section) &&
      (!filters.status || student.status === filters.status)
    );
  });

  const filteredTotal = {
    oddSemTotal: filteredStudents.reduce((sum, s) => sum + s.oddSemTotalFee, 0),
    evenSemTotal: filteredStudents.reduce((sum, s) => sum + s.evenSemTotalFee, 0),
    yearTotalFee: filteredStudents.reduce((sum, s) => sum + s.yearTotalFee, 0),
    paidTotal: filteredStudents.reduce((sum, s) => sum + s.paidAmount, 0),
    pendingTotal: filteredStudents.reduce((sum, s) => sum + s.pendingAmount, 0)
  };

  const handleClearFilters = () => {
  setFilters({
    academicYear: "",
    department: "",
    year: "",
    section: "",
    status: ""
  });
};



    //  PDF generation — landscape A4
  const generatePDF = () => {
    const printWindow = window.open("", "_blank");

    const rowsHTML = filteredStudents
      .map((student, idx) => {
        const prevYrBal = student.previousYearPendingFee ?? 0;

        return `
          <tr>
            <td class="cc">${idx + 1}</td>
            <td class="cc">${student.rollNo}</td>
            <td class="cl bold">${student.studentDetails.name}</td>
            <td class="cc"></td>
            <td class="cc"></td>
            <td class="cc"></td>
            <td class="cr">${fmt(prevYrBal)}</td>
            <td class="cr">0</td>
            <td class="cr">0</td>

            <!-- ✅ ONLY TOTAL VALUES -->
            <td class="cr bold">${fmt(student.oddSemTotalFee)}</td>
            <td class="cr bold">${fmt(student.evenSemTotalFee)}</td>
            <td class="cr bold">${fmt(student.yearTotalFee)}</td>
          </tr>
        `;
      })
  .join("");

    const html = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Class Fee Report - ${report.class}</title>
        <style>
          @page { size: A4 landscape; margin: 10mm 12mm; }
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: Arial, sans-serif;
            font-size: 8.5px;
            color: #000;
            background: #fff;
          }

          /* ── College header ── */
          .hdr { text-align: center; border-bottom: 1.5px solid #000; padding-bottom: 5px; margin-bottom: 4px; }
          .hdr .name  { font-size: 14px; font-weight: bold; }
          .hdr .addr  { font-size: 8px; color: #444; margin-top: 1px; }
          .hdr .title { font-size: 9.5px; font-weight: bold; margin-top: 3px; }

          /* ── Meta bar ── */
          .meta { display: flex; gap: 20px; font-size: 8.5px; margin-bottom: 5px; }

          /* ── Table ── */
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 0.5px solid #666; padding: 2.5px 3px; vertical-align: middle; }

          thead th {
            background: #d4e3f5;
            font-weight: bold;
            text-align: center;
            line-height: 1.3;
          }
          .yr-hdr { background: #b8d0ee !important; }

          /* utility */
          .cc { text-align: center; }
          .cl { text-align: left; }
          .cr { text-align: right; }
          .bold { font-weight: bold; }
          .vb { border-right: 0.5px solid #666; }
          .fh { padding-left: 7px; }
          .italic-label { font-style: italic; }

          /* subtotal row */
          .sub-row td { background: #f2f2f2; border-top: 0.8px solid #999; }

          /* grand total footer */
          tfoot td { background: #d4e3f5; font-weight: bold; border-top: 1.2px solid #444; }

          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>

        <div class="hdr">
          <div class="name">Sri Eshwar College of Engineering</div>
          <div class="addr">Kondampatti Po, Vadasithur(via), Coimbatore-641202</div>
          <div class="title">Cumulative Balance History for students of ${report.class} - ${report.section}</div>
        </div>

        <div class="meta">
          <span><strong>Academic Year:</strong> ${report.academicYear}</span>
          <span><strong>Department:</strong> ${report.department}</span>
          <span><strong>Section:</strong> ${report.section}</span>
          <span><strong>Generated:</strong> ${new Date().toLocaleDateString("en-IN")}</span>
        </div>

        <table>
          <thead>
            <tr>
              <th rowspan="2" style="width:3%">Sl.</th>
              <th rowspan="2" style="width:7%">Roll No.</th>
              <th rowspan="2" style="width:13%">Student Name</th>
              <th rowspan="2" style="width:3%">F.G</th>
              <th rowspan="2" style="width:4%">Comm.</th>
              <th rowspan="2" style="width:3.5%">Qt.</th>
              <th rowspan="2" style="width:5.5%">Yr1. Bal.</th>
              <th rowspan="2" style="width:5.5%">Yr2. Bal.</th>
              <th rowspan="2" style="width:5.5%">Yr3. Bal.</th>
              
              <th colspan="2" class="yr-hdr" style="width:18%">2025 – 2026</th>
              <th rowspan="2" style="width:8%">Total</th>
            </tr>
            <tr>
              <th class="yr-hdr">Odd Sem<br/>2025-2026</th>
              <th class="yr-hdr">Even Sem<br/>2025-2026</th>
            </tr>
          </thead>

          <tbody>${rowsHTML}</tbody>

          <tfoot>
            <tr>
              <td colspan="9" class="cr bold">Grand Total</td>
              <td class="cr">${fmt(filteredTotal.oddSemTotal)}</td>
              <td class="cr">${fmt(filteredTotal.evenSemTotal)}</td>
              <td class="cr">${fmt(filteredTotal.yearTotalFee)}</td>
            </tr>
          </tfoot>
        </table>

        <script>
          window.onload = function () { window.print(); };
        <\/script>
      </body>
      </html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  };

    //  Handle Export button click
  const handleExport = () => {
    // setIsExportMode(true);
    generatePDF();
  };

    //  Render
  return (
    <>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <ClassWiseFeeReportFilter  
            filters={filters}
            setFilters={setFilters} 
            onClearFilters={handleClearFilters}
          />

          <button
            onClick={handleExport}
            className="bg-[#1F5AA6] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#174a8c] transition-all shadow-sm active:scale-95 h-[42px]"
          >
            <Download size={18} />
            <span className="font-medium text-sm">Export Data</span>
          </button>
        </div>

        <div className="">
          <div className="bg-white rounded-xl border border-gray-300 h-[calc(100vh-40vh)] overflow-auto shadow-sm mt-5">
            <table className="w-full border-collapse table-fixed">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[8%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[8%]" />
              </colgroup>

              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-4 font-semibold text-center">Student Details</th>
                  <th className="font-semibold text-center">Roll No</th>
                  <th className="font-semibold text-center">Odd Sem</th>
                  <th className="font-semibold text-center">Even Sem</th>
                  <th className="font-semibold text-center">Year Total</th>
                  <th className="font-semibold text-center">Paid Amount</th>
                  <th className="font-semibold text-center">Pending</th>
                  <th className="font-semibold text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {students.length > 0 ? (
                  filteredStudents.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {/* Student Details */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.studentDetails.photo || "/default-avatar.png"}
                            alt={`${item.studentDetails.name}'s Photo`}
                            className="w-11 h-11 rounded-full object-cover flex-shrink-0 border border-gray-200"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                item.studentDetails.name
                              )}&background=1F5AA6&color=fff`;
                            }}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[14px] text-gray-900 leading-tight">
                              {item.studentDetails.name}
                            </p>
                            <p className="text-gray-400 text-[12px] mt-0.5 leading-tight">
                              {item.studentDetails.year} / {item.studentDetails.department} -{" "}
                              {item.studentDetails.section}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="text-center text-[13px] text-gray-700">{item.rollNo}</td>

                      <td className="text-center text-[13px] text-gray-700">
                        {formatCurrency(item.oddSemTotalFee)}
                      </td>

                      <td className="text-center text-[13px] text-gray-700">
                        {formatCurrency(item.evenSemTotalFee)}
                      </td>

                      <td className="text-center text-[13px] text-gray-700">
                        {formatCurrency(item.yearTotalFee)}
                      </td>

                      <td className="text-center text-[13px] text-green-700 font-medium">
                        {formatCurrency(item.paidAmount)}
                      </td>

                      <td className="text-center text-[13px] text-red-600 font-medium">
                        {formatCurrency(item.pendingAmount)}
                      </td>

                      <td className="text-center">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                            item.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isExportMode ? 9 : 8}
                      className="text-center py-20 text-gray-400"
                    >
                      <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                        <p className="text-gray-500">No results found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot className="bg-gray-100 sticky bottom-0 z-10">
                <tr>
                  <td colSpan="2" className="text-right font-semibold py-3 pr-4 text-sm">
                    
                  </td>
                  <td className="text-center font-semibold text-gray-800 text-sm">
                    {formatCurrency(filteredTotal.oddSemTotal)}
                  </td>
                  <td className="text-center font-semibold text-gray-800 text-sm">
                    {formatCurrency(filteredTotal.evenSemTotal)}
                  </td>
                  <td className="text-center font-semibold text-gray-800 text-sm">
                    {formatCurrency(filteredTotal.yearTotalFee)}
                  </td>
                  <td className="text-center font-semibold text-green-700 text-sm">
                    {formatCurrency(filteredTotal.paidTotal)}
                  </td>
                  <td className="text-center font-semibold text-red-700 text-sm">
                    {formatCurrency(filteredTotal.pendingTotal)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassWiseFeeReport;