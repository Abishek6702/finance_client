import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ApiRequest } from "../../utils/ApiRequest";
import { ChevronRight } from "lucide-react";

import Dayscholar from "../../assets/dayscholar.svg";
import Hostel     from "../../assets/hostel.svg";
import Transport  from "../../assets/transport1.svg";
import Favlogo    from "../../assets/favlogo.svg";

import UserImg       from "../../assets/user.svg";
import RollnoImg     from "../../assets/rollno.svg";
import DepartmentImg from "../../assets/department.svg";
import MobileImg     from "../../assets/mobile.svg";
import EmailImg      from "../../assets/email.svg";
import BatchImg      from "../../assets/user.svg";

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) =>
  n !== undefined && n !== null
    ? `₹${Number(n).toLocaleString("en-IN")}`
    : "₹0";

const StatusBadge = ({ status }) => {
  const map = {
    Paid:    "bg-[#F3FCF7] text-[#44CF7D]",
    Unpaid:  "bg-[#FCEAEE] text-[#ED6C83]",
    Partial: "bg-[#FFF6EA] text-[#FFA02D]",
  };
  const cls = map[status] || map.Unpaid;
  return (
    <span className={`${cls} px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap inline-block`}>
      {status || "—"}
    </span>
  );
};

const getStudentImages = (record) => {
  const type = record?.studentType || {};
  if (type.hostel) return [Hostel];
  const images = [Dayscholar];
  if (type.transport) images.push(Transport);
  return images;
};

const StudentTypeIcons = ({ record }) => {
  const images = getStudentImages(record);
  if (!images.length) return <span className="text-gray-400">—</span>;
  return (
    <div className="flex items-center gap-1.5">
      {images.map((img, i) => (
        <img key={i} src={img} alt="type" className="w-[22px] h-[22px] object-contain" />
      ))}
    </div>
  );
};

// ─── table primitives ─────────────────────────────────────────────────────────

const TH = ({ children, className = "" }) => (
  <th className={`px-4 py-[11px] text-[12.5px] font-semibold text-[#222222] text-left bg-[#EAEFEF] border-b border-gray-200 whitespace-nowrap ${className}`}>
    {children}
  </th>
);

const TD = ({ children, className = "" }) => (
  <td className={`px-4 py-[13px] text-[13px] text-gray-700 border-b border-slate-100 whitespace-nowrap ${className}`}>
    {children}
  </td>
);

// Fine column removed from all column definitions
const YEAR_COLS     = ["Academic Year","Community","Demand","Concession","Paid","Overdue","Student Type","Status","Total"];
const SEM_COLS      = ["Semester Type","Academic Year","Demand","Concession","Paid","Overdue","Student Type","Status","Total"];
const FEEHEADS_COLS = ["Fees Head","Total","Concession","Paid","Overdue","Status"];
const OVERALL_COLS  = ["Academic Year","Community","Demand","Concession","Paid","Overdue","Student Type","Status","Total"];

// ─── overall tab content ───────────────────────────────────────────────────────

const OverallContent = ({ feeSummary, overall }) => {
  if (!feeSummary?.length && !overall)
    return (
      <div className="p-8 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
        No overall fee data available.
      </div>
    );

  // Compute totals dynamically from feeSummary rows; fall back to overall object
  const rows = feeSummary || [];
  const totals = {
    demand:     overall?.demand     ?? rows.reduce((s, r) => s + (r.demand     || 0), 0),
    concession: overall?.concession ?? rows.reduce((s, r) => s + (r.concession || 0), 0),
    paid:       overall?.paid       ?? rows.reduce((s, r) => s + (r.paid       || 0), 0),
    overdue:    overall?.overdue    ?? rows.reduce((s, r) => s + (r.overdue    || 0), 0),
    total:      overall?.total      ?? rows.reduce((s, r) => s + (r.total      || 0), 0),
    status:     overall?.status,
  };

  return (
    <div className="bg-white rounded-[14px] border border-gray-200 overflow-hidden shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr>{OVERALL_COLS.map((h) => <TH key={h}>{h}</TH>)}</tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
              <TD className="font-semibold">{s.academicYear}</TD>
              <TD>{s.community || "—"}</TD>
              <TD>{fmt(s.demand)}</TD>
              <TD>{fmt(s.concession)}</TD>
              <TD className="text-green-600 font-semibold">{fmt(s.paid)}</TD>
              <TD className="text-red-600 font-semibold">{fmt(s.overdue)}</TD>
              <TD><StudentTypeIcons record={s} /></TD>
              <TD><StatusBadge status={s.status} /></TD>
              <TD className="font-semibold">{fmt(s.total)}</TD>
            </tr>
          ))}

          {/* Totals row — dynamically computed, aligned to each column */}
          <tr className=" border-t-2 border-[#0B56A4]/20">
            <TD></TD>
            <TD></TD>
            <TD className="font-bold text-[#0B56A4]">{fmt(totals.demand)}</TD>
            <TD className="font-bold text-[#0B56A4]">{fmt(totals.concession)}</TD>
            <TD className="font-bold text-green-700">{fmt(totals.paid)}</TD>
            <TD className="font-bold text-red-600">{fmt(totals.overdue)}</TD>
            <TD></TD>
            <TD>{totals.status ? <StatusBadge status={totals.status} /> : null}</TD>
            <TD className="font-bold text-[#0B56A4]">{fmt(totals.total)}</TD>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ─── fee-head breakdown ────────────────────────────────────────────────────────

const FeeHeadTable = ({ feeHeads }) => (
  <table className="w-full border-collapse">
    <thead>
      <tr>
        {FEEHEADS_COLS.map((h) => (
          <TH key={h} className="bg-gray-100 text-xs">{h}</TH>
        ))}
      </tr>
    </thead>
    <tbody>
      {(feeHeads || []).map((f, i) => (
        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
          <TD>{f.name}</TD>
          <TD>{fmt(f.total)}</TD>
          <TD>{fmt(f.concession)}</TD>
          <TD className="text-green-600 font-semibold">{fmt(f.paid)}</TD>
          <TD className="text-red-600 font-semibold">{fmt(f.overdue)}</TD>
          <TD><StatusBadge status={f.status} /></TD>
        </tr>
      ))}
    </tbody>
  </table>
);

// ─── semester card ─────────────────────────────────────────────────────────────

const SemesterCard = ({ semData, label, academicYear }) => {
  const [open, setOpen] = useState(false);
  if (!semData) return null;
  const ov = semData.overall || {};

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr>{SEM_COLS.map((h) => <TH key={h}>{h}</TH>)}</tr>
        </thead>
        <tbody>
          <tr
            onClick={() => setOpen((p) => !p)}
            className="cursor-pointer transition-colors duration-150"
          >
            <TD>
              <div className="flex items-center gap-2.5">
                <button className="w-7 h-7 rounded-full border-none bg-blue-700 text-white cursor-pointer flex items-center justify-center shrink-0">
                  <ChevronRight
                    size={14}
                    className={`transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`}
                  />
                </button>
                <span className="font-medium text-gray-900">{label}</span>
              </div>
            </TD>
            <TD>{academicYear}</TD>
            <TD>{fmt(ov.demand)}</TD>
            <TD>{fmt(ov.concession)}</TD>
            <TD className="text-green-600 font-semibold">{fmt(ov.paid)}</TD>
            <TD className="text-red-600 font-semibold">{fmt(ov.overdue)}</TD>
            <TD><StudentTypeIcons record={ov} /></TD>
            <TD><StatusBadge status={ov.status} /></TD>
            <TD className="font-semibold">{fmt(ov.total)}</TD>
          </tr>
        </tbody>
      </table>
      {open && (
        <div className="border-t border-gray-200">
          <FeeHeadTable feeHeads={semData.feeHeads} />
        </div>
      )}
    </div>
  );
};

// ─── year content ──────────────────────────────────────────────────────────────

const YearContent = ({ yearData, feeSummary }) => {
  if (!yearData)
    return (
      <div className="p-8 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
        No fee data available for this year.
      </div>
    );

  const summary      = feeSummary?.find((s) => s.academicYear === yearData.academicYear);
  const hasSemesters = yearData.odd || yearData.even;

  return (
    <div className="flex flex-col gap-0 bg-white rounded-[14px] border border-gray-200 overflow-hidden shadow-sm">
      {/* Year summary */}
      <table className="w-full border-collapse">
        <thead>
          <tr>{YEAR_COLS.map((h) => <TH key={h}>{h}</TH>)}</tr>
        </thead>
        <tbody>
          {summary ? (
            <tr>
              <TD className="font-semibold">{summary.academicYear}</TD>
              <TD>{summary.community || "—"}</TD>
              <TD>{fmt(summary.demand)}</TD>
              <TD>{fmt(summary.concession)}</TD>
              <TD className="text-green-600 font-semibold">{fmt(summary.paid)}</TD>
              <TD className="text-red-600 font-semibold">{fmt(summary.overdue)}</TD>
              <TD><StudentTypeIcons record={summary} /></TD>
              <TD><StatusBadge status={summary.status} /></TD>
              <TD className="font-semibold">{fmt(summary.total)}</TD>
            </tr>
          ) : (
            <tr>
              <td colSpan={9} className="p-3.5 text-gray-400 text-center text-[13px]">
                No summary data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Semester cards */}
      {hasSemesters && (
        <div className="p-4 flex flex-col gap-3 bg-white">
          {yearData.odd  && <SemesterCard semData={yearData.odd}  label="Odd Semester"  academicYear={yearData.academicYear} />}
          {yearData.even && <SemesterCard semData={yearData.even} label="Even Semester" academicYear={yearData.academicYear} />}
        </div>
      )}
    </div>
  );
};

// ─── profile item row ──────────────────────────────────────────────────────────

const Item = ({ icon, label, value }) => (
  <div className="px-4 py-2 border-b border-[#d9d9d9]">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-[#d9d9d9] flex items-center justify-center shrink-0">
        <img src={icon} alt={label} className="w-5 h-5 object-contain" />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-gray-500 text-xs">{label}</span>
        <span
          title={value}
          className="text-sm font-semibold text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {value || "Not Provided"}
        </span>
      </div>
    </div>
  </div>
);

// ─── profile card ──────────────────────────────────────────────────────────────

const ProfileCard = ({ student, contact }) => (
  <div
    className="rounded-3xl border border-[#d9d9d9] bg-white flex flex-col overflow-hidden"
    style={{ maxHeight: "calc(100vh - 190px)" }}
  >
    {/* Photo */}
    <div className="p-4 pb-0 shrink-0">
      <div className="rounded-[20px] overflow-hidden mb-1">
        <img
          src={student.photo || Favlogo}
          alt="student"
          className="w-full h-36 object-cover block"
          onError={(e) => { e.target.src = Favlogo; }}
        />
      </div>
    </div>

    {/* Info rows */}
    <div className="flex-1 overflow-y-auto overflow-x-hidden pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <Item icon={UserImg}       label="Student Name"   value={student.name} />
      <Item icon={RollnoImg}     label="Roll Number"    value={student.rollNo} />
      <Item icon={DepartmentImg} label="Department"     value={student.department} />
      <Item icon={MobileImg}     label="Mobile Number"  value={contact?.student?.mobile} />
      <Item icon={EmailImg}      label="Mail Id"        value={contact?.student?.email} />
      <Item icon={BatchImg}      label="Batch"          value={student.batch} />
      <Item icon={UserImg}       label="Father Name"    value={contact?.father?.name} />
      <Item icon={MobileImg}     label="Father Contact" value={contact?.father?.phoneNumber} />
      <Item icon={UserImg}       label="Mother Name"    value={contact?.mother?.name} />
      <Item icon={MobileImg}     label="Mother Contact" value={contact?.mother?.phoneNumber} />
    </div>
  </div>
);

// ─── main ─────────────────────────────────────────────────────────────────────

const OVERALL_TAB = "__overall__";

const StudentFeeDetails = () => {
  const { rollNo }                = useParams();
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [activeTab, setActiveTab] = useState(OVERALL_TAB);

  useEffect(() => { if (rollNo) fetchDetails(); }, [rollNo]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await ApiRequest(`/api/studentFeeTracking/v2/?rollNo=${rollNo}`);
      if (res.success && res.data) {
        const arr     = Array.isArray(res.data) ? res.data : [res.data];
        const matched = arr.find((item) => item.student.rollNo === rollNo);
        if (matched) {
          setData(matched);
          // Default to current academic year tab, fall back to first year, then Overall
          const defaultTab =
            matched.student.currentAcademicYear ||
            matched.feeAcademicYears?.[0] ||
            OVERALL_TAB;
          setActiveTab(defaultTab);
        }
      }
    } catch (err) {
      console.error("API ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        Loading fee details…
      </div>
    );

  if (!data)
    return <div className="p-8 text-gray-500 text-sm">No Data — Check API response</div>;

  const { student, contact, academicYears, feeSummary, overall } = data;
  const yearTabs       = data.feeAcademicYears || [];
  const activeYearData = academicYears?.find((y) => y.academicYear === activeTab);

  return (
    <div className="font-[Segoe_UI,system-ui,sans-serif] bg-slate-50 min-h-full flex flex-col">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5   pb-2 text-sm shrink-0">
        <Link
          to="/admin/fees_management"
          className="text-black no-underline font-medium text-xl"
        >
          Fees Details
        </Link>
        <ChevronRight size={24} className="text-black" />
        <span className="text-[#0b56a4] font-medium text-xl">{student.name}</span>
      </div>

      {/* Body row */}
      <div className="flex gap-[14px]  pb-2 items-start">

        {/* LEFT — profile card (sticky so it stays visible while fee panel scrolls) */}
        <div className="sticky top-4 shrink-0" style={{ width: "16%", minWidth: 200 }}>
          <ProfileCard student={student} contact={contact} />
        </div>

        {/* RIGHT — fee panel: grows naturally, no fixed height, no overflow clip */}
        <div className="flex-1 min-w-0 flex flex-col gap-0">
          {/* Year tabs */}
          <div className="flex gap-2.5 mb-[18px] flex-wrap">
            <button
              onClick={() => setActiveTab(OVERALL_TAB)}
              className={`px-[22px] py-[9px] rounded-[10px] text-[13px] font-semibold cursor-pointer flex items-center gap-2 transition-all duration-150
                ${activeTab === OVERALL_TAB
                  ? "border-none bg-[#0B56A4] text-white shadow-[0_2px_10px_rgba(29,78,216,0.22)]"
                  : "border border-[1.5px] border-gray-200 bg-white text-gray-700 shadow-none"
                }`}
            >
              Overall
            </button>

            {yearTabs.map((yr) => {
              const isActive = yr === activeTab;
              const isCurrent    = yr === student.currentAcademicYear;
              return (
                <button
                  key={yr}
                  onClick={() => setActiveTab(yr)}
                  className={`px-[22px] py-[9px] rounded-[10px] text-[13px] font-semibold cursor-pointer flex items-center gap-2 transition-all duration-150
                    ${isActive
                      ? "border-none bg-[#0B56A4] text-white shadow-[0_2px_10px_rgba(29,78,216,0.22)]"
                      : "border border-[1.5px] border-gray-200 bg-white text-gray-700 shadow-none"
                    }`}
                >
                  {yr}
                  {isCurrent && (
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${isActive ? "bg-white/20 text-white" : "bg-[#EBF2FF] text-[#0B56A4]"}`}>
                      Current Year
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Fee content */}
          {activeTab === OVERALL_TAB ? (
            <OverallContent feeSummary={feeSummary} overall={overall} />
          ) : (
            <YearContent yearData={activeYearData} feeSummary={feeSummary} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFeeDetails;