 const ReportData=[{
  "class": "III B.Sc Computer Science",
  "academicYear": "2025-2026",
  "department": "Computer Science",
  "section": "A",

  pdfConfig: {
    fileName: "Class_Fee_Report_III_BSC_CS.pdf",
    columns: [
      { key: "rollNo", label: "Roll No" },
      { key: "name", label: "Student Name" },
      { key: "oddSemTotalFee", label: "Odd Sem Fee" },
      { key: "evenSemTotalFee", label: "Even Sem Fee" },
      { key: "yearTotalFee", label: "Year Total" },
      { key: "paidAmount", label: "Paid" },
      { key: "pendingAmount", label: "Current Pending" },
      { key: "previousYearPendingFee", label: "Previous Due", includeInTotal: false },
      { key: "status", label: "Status" }
    ]
  },

  "students": [
    {
      "studentDetails": {
        "photo": "https://example.com/photos/student1.jpg",
        "name": "Arun Kumar",
        "year": "3rd Year",
        "department": "CSE",
        "section": "A"
      },
      "rollNo": "CS301",
      "oddSemTotalFee": 25000,
      "evenSemTotalFee": 25000,
      "yearTotalFee": 50000,
      "paidAmount": 45000,
      "pendingAmount": 5000,
      "status": "unpaid",
      "previousYearPendingFee": 2000
    },
    {
      "studentDetails": {
        "photo": "https://example.com/photos/student2.jpg",
        "name": "Priya S",
        "year": "3rd Year",
        "department": "CSE",
        "section": "A"
      },
      "rollNo": "CS302",
      "oddSemTotalFee": 25000,
      "evenSemTotalFee": 25000,
      "yearTotalFee": 50000,
      "paidAmount": 50000,
      "pendingAmount": 0,
      "status": "paid"
    },
    {
      "studentDetails": {
        "photo": "https://example.com/photos/student3.jpg",
        "name": "Vignesh R",
        "year": "3rd Year",
        "department": "CSE",
        "section": "A"
      },
      "rollNo": "CS303",
      "oddSemTotalFee": 24000,
      "evenSemTotalFee": 24000,
      "yearTotalFee": 48000,
      "paidAmount": 30000,
      "pendingAmount": 18000,
      "status": "unpaid"
    },
    {
      "studentDetails": {
        "photo": "https://example.com/photos/student4.jpg",
        "name": "Divya K",
        "year": "3rd Year",
        "department": "CSE",
        "section": "A"
      },
      "rollNo": "CS304",
      "oddSemTotalFee": 26000,
      "evenSemTotalFee": 26000,
      "yearTotalFee": 52000,
      "paidAmount": 52000,
      "pendingAmount": 0,
      "status": "paid",
      "previousYearPendingFee": 10000,
    },
    {
      "studentDetails": {
        "photo": "https://example.com/photos/student5.jpg",
        "name": "Rahul M",
        "year": "3rd Year",
        "department": "CSE",
        "section": "A"
      },
      "rollNo": "CS305",
      "oddSemTotalFee": 25000,
      "evenSemTotalFee": 25000,
      "yearTotalFee": 50000,
      "paidAmount": 20000,
      "pendingAmount": 30000,
      "status": "unpaid"
    },
    {
      "studentDetails": {
        "photo": "https://example.com/photos/student6.jpg",
        "name": "Sneha P",
        "year": "3rd Year",
        "department": "CSE",
        "section": "A"
      },
      "rollNo": "CS306",
      "oddSemTotalFee": 24000,
      "evenSemTotalFee": 24000,
      "yearTotalFee": 48000,
      "paidAmount": 48000,
      "pendingAmount": 0,
      "status": "paid",
      "previousYearPendingFee": 5000
    },
    {
      "studentDetails": {
        "photo": "https://example.com/photos/student7.jpg",
        "name": "Karthik L",
        "year": "3rd Year",
        "department": "CSE",
        "section": "A"
      },
      "rollNo": "CS307",
      "oddSemTotalFee": 25000,
      "evenSemTotalFee": 25000,
      "yearTotalFee": 50000,
      "paidAmount": 35000,
      "pendingAmount": 15000,
      "status": "unpaid"
    },
    {
      "studentDetails": {
        "photo": "https://example.com/photos/student8.jpg",
        "name": "Meena D",
        "year": "3rd Year",
        "department": "CSE",
        "section": "A"
      },
      "rollNo": "CS308",
      "oddSemTotalFee": 26000,
      "evenSemTotalFee": 26000,
      "yearTotalFee": 52000,
      "paidAmount": 40000,
      "pendingAmount": 12000,
      "status": "unpaid"
    },
    {
      "studentDetails": {
        "photo": "https://example.com/photos/student9.jpg",
        "name": "Suresh B",
        "year": "3rd Year",
        "department": "CSE",
        "section": "A"
      },
      "rollNo": "CS309",
      "oddSemTotalFee": 25000,
      "evenSemTotalFee": 25000,
      "yearTotalFee": 50000,
      "paidAmount": 50000,
      "pendingAmount": 0,
      "status": "paid"
    },
    {
      "studentDetails": {
        "photo": "https://example.com/photos/student10.jpg",
        "name": "Anitha R",
        "year": "3rd Year",
        "department": "CSE",
        "section": "A"
      },
      "rollNo": "CS310",
      "oddSemTotalFee": 24000,
      "evenSemTotalFee": 24000,
      "yearTotalFee": 48000,
      "paidAmount": 30000,
      "pendingAmount": 18000,
      "status": "unpaid"
    }
  ],

  "total": {
    "oddSemTotal": 250000,
    "evenSemTotal": 250000,
    "yearTotalFee": 500000,
    "paidTotal": 390000,
    "pendingTotal": 110000
  }
}]

export default ReportData;