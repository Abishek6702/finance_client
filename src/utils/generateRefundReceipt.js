// ─── generateRefundReceipt ────────────────────────────────────────────────────
// Opens the receipt in a new tab and auto-triggers the print/save-as-PDF dialog.
// No library needed — works purely in the browser.
//
// Usage:
//   import { generateRefundReceipt } from "../utils/generateRefundReceipt";
//
//   generateRefundReceipt({
//     receiptNo   : "17332",
//     studentName : "AASTHA GUPTA",
//     rollNo      : "24CS002",
//     year        : "II B.E. CSE - A",
//     semPeriod   : "Odd Sem - 2025-2026",
//     rows        : [
//       { sl: 1, particular: "Paid Amount",       amount: 12000 },
//       { sl: 2, particular: "Conception Amount", amount: 2000  },
//       { sl: 3, particular: "Refund Amount",     amount: 10000 },
//     ],
//     paymentMode : "Bank",   // "Cash" | "Bank"
//     totalAmount : 10000,
//     remarks     : "Union Bank - Direct Remittance",
//   });

const toWords = (num) => {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n) => {
    if (n === 0)        return "";
    if (n < 20)         return a[n] + " ";
    if (n < 100)        return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "") + " ";
    if (n < 1000)       return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
    if (n < 100000)     return inWords(Math.floor(n / 1000)) + "Thousand " + inWords(n % 1000);
    if (n < 10000000)   return inWords(Math.floor(n / 100000)) + "Lakh " + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + "Crore " + inWords(n % 10000000);
  };

  return (inWords(Math.abs(Math.round(num))) + "only").trim();
};

const fmtAmt = (val) =>
  isNaN(parseFloat(val))
    ? "0.00"
    : parseFloat(val).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const todayStr = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

export const generateRefundReceipt = (receiptData) => {
  const {
    receiptNo   = "—",
    date        = todayStr(),
    studentName = "—",
    rollNo      = "—",
    year        = "—",
    semPeriod   = "—",
    rows        = [],
    paymentMode = "Bank",
    totalAmount = 0,
    remarks     = "",
  } = receiptData;

  const cash           = paymentMode === "Cash" ? fmtAmt(totalAmount) : "0";
  const bank           = paymentMode === "Bank" ? fmtAmt(totalAmount) : "0";
  const amountInWords  = toWords(totalAmount);

  const rowsHTML = rows.map((r, i) => `
    <tr>
      <td>${r.sl ?? i + 1}</td>
      <td>${r.particular}</td>
      <td>${fmtAmt(r.amount)}</td>
    </tr>`
  ).join("");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Fee Receipt - Sri Eshwar College of Engineering</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;600;700&display=swap");

    * { margin:0; padding:0; box-sizing:border-box; }

    body {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      font-family: "Source Sans 3", Arial, sans-serif;
      background: #fff;
    }

    .page { width:720px; padding:24px 32px 32px; }

    /* Header */
    .header { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
    .college-info  { text-align:center; flex:1; padding:0 12px; }
    .college-name  { font-family:"Libre Baskerville", Georgia, serif; font-size:22px; font-weight:700; color:#1a1a1a; line-height:1.2; }
    .college-sub   { font-size:12px; color:#333; margin-top:2px; }
    .college-affil { font-size:11.5px; color:#333; margin-top:2px; }
    .college-address { font-size:13px; font-weight:700; color:#1a1a1a; margin-top:3px; }

    /* Receipt box */
    .receipt-box { border:1.5px solid #333; margin-top:10px; }

    /* Meta cells */
    .meta-cell  { padding:5px 10px; font-size:13px; display:flex; gap:6px; }
    .meta-label { font-weight:600; white-space:nowrap; }

    /* Table */
    table { width:100%; border-collapse:collapse; font-size:13px; }
    thead tr { background:#f4f4f4; }
    th { border:1px solid #bbb; padding:6px 10px; text-align:left; font-weight:700; }
    th:first-child { width:38px; text-align:center; }
    th:last-child  { text-align:right; width:90px; }
    td { border:1px dashed #ccc; padding:5px 10px; }
    td:first-child { text-align:center; }
    td:last-child  { text-align:right; }

    /* Payment row */
    .payment-row { border-top:1px solid #aaa; padding:6px 10px; font-size:12.5px; display:flex; gap:20px; align-items:center; }
    .payment-row span { font-weight:600; }

    /* Footer */
    .footer { display:grid; grid-template-columns:1fr 1fr; padding:10px 10px 4px; font-size:12px; border-top:1px solid #ccc; gap:8px; }
    .footer-left  { color:#333; line-height:1.5; }
    .footer-right { text-align:right; font-style:italic; font-family:"Libre Baskerville", Georgia, serif; font-size:12.5px; display:flex; flex-direction:column; justify-content:space-between; align-items:flex-end; }
    .authorized   { font-size:12px; font-style:normal; margin-top:24px; }
    .divider-dotted { border:none; border-top:2px dashed #999; margin:18px 0 0; }

    /* Print styles */
    @media print {
      body { background:#fff; }
      .page { padding:12px 20px; }
      .no-print { display:none !important; }
      .divider-dotted { display:none; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Print / Download button (hidden on print) -->
  <div class="no-print" style="display:flex;justify-content:flex-end;margin-bottom:12px;gap:8px;">
    <button onclick="window.print()"
      style="padding:8px 20px;background:#0b56a4;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">
      Save as PDF / Print
    </button>
    <button onclick="window.close()"
      style="padding:8px 16px;background:#f3f4f6;color:#374151;border:1px solid #d1d5db;border-radius:8px;font-size:13px;cursor:pointer;">
      Close
    </button>
  </div>

  <!-- Header -->
  <div class="header">
    <div style="width:68px;"></div>
    <div class="college-info">
      <div class="college-name">Sri Eshwar College of Engineering</div>
      <div class="college-sub">(An Autonomous Institution)</div>
      <div class="college-affil">Approved by AICTE, New Delhi and Affiliated to Anna University, Chennai</div>
      <div class="college-address">Kondampatti (Post), Kinathukadavu (Tk), Coimbatore – 641 202</div>
    </div>
    <div style="width:68px;"></div>
  </div>

  <!-- Receipt Box -->
  <div class="receipt-box">

    <!-- Row 1: Receipt No + Date -->
    <div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid black;">
      <div class="meta-cell"><span class="meta-label">Receipt No:</span> ${receiptNo}</div>
      <div class="meta-cell"><span class="meta-label">Date :</span> ${date}</div>
    </div>

    <!-- Row 2: Name + Class -->
    <div style="display:grid;grid-template-columns:1fr 1fr;">
      <div class="meta-cell"><span class="meta-label">Name :</span> ${studentName}</div>
      <div class="meta-cell"><span class="meta-label">Class:</span> ${year}</div>
    </div>

    <!-- Row 3: Roll No + Sem Period -->
    <div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #aaa;">
      <div class="meta-cell"><span class="meta-label">Roll no:</span> ${rollNo}</div>
      <div class="meta-cell"><span class="meta-label">Sem period:</span> ${semPeriod}</div>
    </div>

    <!-- Fee Table -->
    <table>
      <thead>
        <tr>
          <th>Sl.</th>
          <th style="text-align:center;">Particulars</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>

    <!-- Payment Mode Row -->
    <div class="payment-row">
      Cheque / DD subjected to realization.
      <span>Cash</span> ${cash} &nbsp;&nbsp;
      <span>Bank</span> ${bank} &nbsp;&nbsp;
      <span>Adj.:</span> 0 &nbsp;&nbsp;
      <span>Fine</span> 0
    </div>

    <!-- Words + Total -->
    <div style="display:grid;grid-template-columns:1fr auto auto;border-top:1px solid #aaa;align-items:center;">
      <div style="padding:5px 10px;font-size:12.5px;font-style:italic;">${amountInWords}</div>
      <div style="padding:5px 20px 5px 10px;font-size:13px;font-weight:700;">Total</div>
      <div style="padding:5px 10px;font-size:13px;font-weight:700;min-width:80px;text-align:right;">${fmtAmt(totalAmount)}</div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">${remarks}</div>
      <div class="footer-right">
        <div>For Sri Eshwar College of Engineering</div>
        <div class="authorized">Authorized Signatory</div>
      </div>
    </div>

  </div>

  <hr class="divider-dotted"/>

</div>

<script>
  // Auto-trigger print dialog once fonts are loaded
  window.addEventListener("load", () => {
    setTimeout(() => window.print(), 800);
  });
</script>

</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, "_blank");
  if (win) win.focus();
};