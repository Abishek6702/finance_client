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
    Paid:    { bg: "#F3FCF7", color: "#44CF7D" },
    Unpaid:  { bg: "#FCEAEE", color: "#ED6C83" },
    Partial: { bg: "#FFF6EA", color: "#FFA02D" },
  };
  const s = map[status] || map.Unpaid;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "4px 12px", borderRadius: 6,
      fontSize: 12, fontWeight: 600,
      whiteSpace: "nowrap", display: "inline-block",
    }}>
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
  if (!images.length) return <span style={{ color: "#9ca3af" }}>—</span>;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {images.map((img, i) => (
        <img key={i} src={img} alt="type"
          style={{ width: 22, height: 22, objectFit: "contain" }} />
      ))}
    </div>
  );
};

// ─── table primitives ─────────────────────────────────────────────────────────

const TH = ({ children, style = {} }) => (
  <th style={{
    padding: "11px 16px", fontSize: 12.5, fontWeight: 600,
    color: "#6b7280", textAlign: "left", background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap",
    ...style,
  }}>
    {children}
  </th>
);

const TD = ({ children, style = {} }) => (
  <td style={{
    padding: "13px 16px", fontSize: 13, color: "#374151",
    borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap",
    ...style,
  }}>
    {children}
  </td>
);

const YEAR_COLS     = ["Academic Year","Community","Demand","Concession","Paid","Fine","Overdue","Student Type","Status","Total"];
const SEM_COLS      = ["Semester Type","Academic Year","Demand","Concession","Paid","Fine","Overdue","Student Type","Status","Total"];
const FEEHEADS_COLS = ["Fees Head","Total","Concession","Paid","Overdue","Status"];

// ─── fee-head breakdown ────────────────────────────────────────────────────────

const FeeHeadTable = ({ feeHeads }) => (
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead>
      <tr>
        {FEEHEADS_COLS.map((h) => (
          <TH key={h} style={{ background: "#f3f4f6", fontSize: 12 }}>{h}</TH>
        ))}
      </tr>
    </thead>
    <tbody>
      {(feeHeads || []).map((f, i) => (
        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
          <TD>{f.name}</TD>
          <TD>{fmt(f.total)}</TD>
          <TD>{fmt(f.concession)}</TD>
          <TD style={{ color: "#16a34a", fontWeight: 600 }}>{fmt(f.paid)}</TD>
          <TD style={{ color: "#dc2626", fontWeight: 600 }}>{fmt(f.overdue)}</TD>
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
    <div style={{
      background: "#fff", borderRadius: 12,
      border: "1px solid #e5e7eb", overflow: "hidden",
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{SEM_COLS.map((h) => <TH key={h}>{h}</TH>)}</tr>
        </thead>
        <tbody>
          <tr
            onClick={() => setOpen((p) => !p)}
            style={{
              cursor: "pointer",
              background: open ? "#f0f5ff" : "#fff",
              transition: "background 0.15s",
            }}
          >
            <TD>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button style={{
                  width: 28, height: 28, borderRadius: "50%",
                  border: "none", background: "#1d4ed8", color: "#fff",
                  cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <ChevronRight size={14} style={{
                    transform: open ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }} />
                </button>
                <span style={{ fontWeight: 500, color: "#111827" }}>{label}</span>
              </div>
            </TD>
            <TD>{academicYear}</TD>
            <TD>{fmt(ov.demand)}</TD>
            <TD>{fmt(ov.concession)}</TD>
            <TD style={{ color: "#16a34a", fontWeight: 600 }}>{fmt(ov.paid)}</TD>
            <TD>0</TD>
            <TD style={{ color: "#dc2626", fontWeight: 600 }}>{fmt(ov.overdue)}</TD>
            <TD><StudentTypeIcons record={ov} /></TD>
            <TD><StatusBadge status={ov.status} /></TD>
            <TD style={{ fontWeight: 600 }}>{fmt(ov.total)}</TD>
          </tr>
        </tbody>
      </table>
      {open && (
        <div style={{ borderTop: "1px solid #e5e7eb" }}>
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
      <div style={{
        padding: 32, textAlign: "center", color: "#9ca3af",
        background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
      }}>
        No fee data available for this year.
      </div>
    );

  const summary      = feeSummary?.find((s) => s.academicYear === yearData.academicYear);
  const hasSemesters = yearData.odd || yearData.even;

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 0,
      background: "#ffffff", borderRadius: 14,
      border: "1px solid #e5e7eb", overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      {/* Year summary */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{YEAR_COLS.map((h) => <TH key={h}>{h}</TH>)}</tr>
        </thead>
        <tbody>
          {summary ? (
            <tr>
              <TD style={{ fontWeight: 600 }}>{summary.academicYear}</TD>
              <TD>{summary.community || "—"}</TD>
              <TD>{fmt(summary.demand)}</TD>
              <TD>{fmt(summary.concession)}</TD>
              <TD style={{ color: "#16a34a", fontWeight: 600 }}>{fmt(summary.paid)}</TD>
              <TD>0</TD>
              <TD style={{ color: "#dc2626", fontWeight: 600 }}>{fmt(summary.overdue)}</TD>
              <TD><StudentTypeIcons record={summary} /></TD>
              <TD><StatusBadge status={summary.status} /></TD>
              <TD style={{ fontWeight: 600 }}>{fmt(summary.total)}</TD>
            </tr>
          ) : (
            <tr>
              <td colSpan={10} style={{ padding: 14, color: "#9ca3af", textAlign: "center", fontSize: 13 }}>
                No summary data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Divider */}
      {hasSemesters && <div style={{ height: 1, background: "#e5e7eb" }} />}

      {/* Semester cards */}
      {hasSemesters && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, background: "#fff" }}>
          {yearData.odd  && <SemesterCard semData={yearData.odd}  label="Odd Semester"  academicYear={yearData.academicYear} />}
          {yearData.even && <SemesterCard semData={yearData.even} label="Even Semester" academicYear={yearData.academicYear} />}
        </div>
      )}
    </div>
  );
};

// ─── profile item row ──────────────────────────────────────────────────────────

const Item = ({ icon, label, value }) => (
  <div style={{ padding: "8px 16px", borderBottom: "1px solid #d9d9d9" }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: "#f9fafb", border: "1px solid #d9d9d9",
        display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0,
      }}>
        <img src={icon} alt={label} style={{ width: 20, height: 20, objectFit: "contain" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
        <span style={{ color: "#6b7280", fontSize: 12 }}>{label}</span>
        <span title={value} style={{
          fontSize: 14, fontWeight: 600, color: "#374151",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {value || "Not Provided"}
        </span>
      </div>
    </div>
  </div>
);

// ─── profile card ──────────────────────────────────────────────────────────────
// Key fix: explicit maxHeight + overflow hidden on card so flex children
// can scroll. Photo is flexShrink:0 so it never shrinks. Info div is
// flex:1 + overflowY:auto so it scrolls within the remaining space.

const ProfileCard = ({ student, contact }) => (
  <div style={{
    width: "16%",
    minWidth: 200,
    borderRadius: 24,
    border: "1px solid #d9d9d9",
    background: "#fff",
    // ── critical: fixed height so inner scroll works ──
    height: "calc(100vh - 140px)",
    maxHeight: "calc(100vh - 140px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",   // clips card to fixed height
    flexShrink: 0,
    alignSelf: "flex-start", // don't stretch beyond its own height
  }}>

    {/* Photo — always visible, never scrolls away */}
    <div style={{ padding: "16px 16px 0", flexShrink: 0 }}>
      <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 4 }}>
        <img
          src={student.photo || Favlogo}
          alt="student"
          style={{ width: "100%", height: 144, objectFit: "cover", display: "block" }}
          onError={(e) => { e.target.src = Favlogo; }}
        />
      </div>
    </div>

    {/* Info rows — scroll independently inside the card */}
    <div style={{
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      paddingBottom: 12,
      // custom scrollbar styling
      scrollbarWidth: "thin",
      scrollbarColor: "#d1d5db transparent",
    }}>
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

const StudentFeeDetails = () => {
  const { rollNo }                = useParams();
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [activeTab, setActiveTab] = useState(null);

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
          setActiveTab(matched.student.currentAcademicYear || matched.feeAcademicYears?.[0]);
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#6b7280", fontSize: 14 }}>
        Loading fee details…
      </div>
    );

  if (!data)
    return <div style={{ padding: 32, color: "#6b7280", fontSize: 14 }}>No Data — Check API response</div>;

  const { student, contact, academicYears, feeSummary } = data;
  const tabs           = data.feeAcademicYears || [];
  const activeYearData = academicYears?.find((y) => y.academicYear === activeTab);

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: "#f8fafc",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",         // ── no page scroll ──
    }}>

      {/* Breadcrumb — never scrolls */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "14px 24px 12px", fontSize: 14, flexShrink: 0,
      }}>
        <Link
          to="/admin/fees_management"
          style={{ color: "#374151", textDecoration: "none", fontWeight: 500 }}
        >
          Fees Details
        </Link>
        <ChevronRight size={14} color="#9ca3af" />
        <span style={{ color: "#1d4ed8", fontWeight: 700 }}>{student.name}</span>
      </div>

      {/* Body row */}
      <div style={{
        display: "flex",
        gap: 18,
        padding: "0 24px 24px",
        flex: 1,
        minHeight: 0,             // ── critical: lets flex children shrink below content size ──
        alignItems: "flex-start",
      }}>

        {/* LEFT — profile with its own inner scroll */}
        <ProfileCard student={student} contact={contact} />

        {/* RIGHT — fee panel scrolls independently */}
        <div style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          height: "calc(100vh - 140px)",
          overflowY: "auto",      // ── only right panel scrolls ──
          display: "flex",
          flexDirection: "column",
          gap: 0,
          scrollbarWidth: "thin",
          scrollbarColor: "#d1d5db transparent",
        }}>
          {/* Year tabs */}
          {tabs.length > 0 && (
            <div style={{
              display: "flex", gap: 10,
              marginBottom: 18, flexWrap: "wrap", flexShrink: 0,
            }}>
              {tabs.map((yr) => {
                const isActive  = yr === activeTab;
                const isCurrent = yr === student.currentAcademicYear;
                return (
                  <button
                    key={yr}
                    onClick={() => setActiveTab(yr)}
                    style={{
                      padding: "9px 22px", borderRadius: 10,
                      border: isActive ? "none" : "1.5px solid #e5e7eb",
                      background: isActive ? "#0B56A4" : "#fff",
                      color: isActive ? "#fff" : "#374151",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 8,
                      boxShadow: isActive ? "0 2px 10px rgba(29,78,216,0.22)" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          )}

          {/* Fee content */}
          <YearContent yearData={activeYearData} feeSummary={feeSummary} />
        </div>
      </div>
    </div>
  );
};

export default StudentFeeDetails;