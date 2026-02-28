import { useState, useMemo } from "react";
import FeeManagementTable from "../../components/FeeManagementTable";
import FeeManagementFilters from "../../components/FeeManagementFilters";

const studentNames = [
  "Aarav Sharma", "Ananya Verma", "Rohan Patel", "Kavya Iyer", "Aditya Singh",
  "Priya Nair", "Arjun Mehta", "Sneha Gupta", "Vikram Rao", "Pooja Malhotra",
  "Rahul Khanna", "Neha Joshi", "Siddharth Jain", "Aishwarya Kulkarni", "Kunal Aggarwal",
  "Meera Menon", "Aman Bansal", "Ritika Choudhary", "Nikhil Saxena", "Shreya Banerjee",
  "Varun Kapoor", "Isha Arora", "Mohit Tandon", "Divya Mishra", "Yash Oberoi",
];

const yearMap = {
  1: "1st Year",
  2: "2nd Year",
  3: "3rd Year",
  4: "4th Year",
};

const classes = [
  "CSE-A", "CSE-B", "CSE-C", "CCE", "IT", "AIDS-A", "AIDS-B", "AIDS-C",
  "AIML", "EEE", "MECH", "ECE-A", "ECE-B", "ECE-C", "CSBS"
];

const communities = ["OC", "BC", "BCM", "MBC", "SCA", "SC", "ST"];  
const studentTypes = ["Hostel", "Dayscholar", "Transport"];

const BASE_YEAR = 2025;

const generateMobile = (index) => {
  return `9${String(800000000 + index).padStart(9, "1")}`;
};

const generateEmail = (name) => {
  return `${name.toLowerCase().replace(/\s+/g, "")}@gmail.com`;
};

const feeData = Array.from({ length: 25 }, (_, index) => {
  const totalFees = 25000;
  const paidOptions = [25000, 15000, 10000, 5000, 0];
  const paid = paidOptions[index % paidOptions.length];
  const overdue = totalFees - paid;

  let status = "Partial";
  if (paid === totalFees) status = "Paid";
  if (paid === 0) status = "Overdue";

  const typeIndex = index % 3;

  let type = "";
  let ishostler = false;
  let isdayscholer = false;
  let iscollegetransport = false;
  
  if (typeIndex === 0) {
    type = "Hostel";
    ishostler = true;
  }
  
  if (typeIndex === 1) {
    type = "Dayscholar";
    isdayscholer = true;
  }
  
  if (typeIndex === 2) {
    type = "Transport";
    isdayscholer=true
    iscollegetransport = true;
  }
  const yearNumber = (index % 4) + 1;

  const startYear = BASE_YEAR - (yearNumber - 1);
  const endYear = startYear + 4;

  return {
    id: index + 1,
    name: studentNames[index],
    year: yearMap[yearNumber],
    rollNo: `7228201150${100 + index}`,
    class: classes[index % classes.length],
    community: communities[index % communities.length],
    department: index % 2 === 0 ? "CSE" : "ECE",
    totalFees,
    concession: index % 3 === 0 ? 5000 : 0,
    paid,
    overdue,
    status,
  
    type, // ✅ keep this
    ishostler, // ✅ new
    isdayscholer, // ✅ new
    iscollegetransport, // ✅ new
  
    profileImage:
      index % 2 === 0
        ? `https://randomuser.me/api/portraits/men/${index}.jpg`
        : `https://randomuser.me/api/portraits/women/${index}.jpg`,
    mobile: generateMobile(index),
    email: generateEmail(studentNames[index]),
    batch: `${startYear} - ${endYear}`,
  };
});

const Fees = () => {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState([]);

  // State for managing selected checkboxes
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredData = useMemo(() => {
    return feeData.filter((s) => {
      return (
        (!search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.rollNo.includes(search)) &&
        (!year || s.year === year) &&
        (!department || s.department === department) &&
        (!status || s.status === status) &&
        (type.length === 0 || type.includes(s.type)) 
      );
    });
  }, [search, year, department, status, type]);

  const handleClearFilters = () => {
    setSearch("");
    setYear("");
    setDepartment("");
    setStatus("");
    setType([]);
    setSelectedIds([]); 
  };

  const exportCSV = () => {
    // Determine the source of data: selected students first, otherwise all filtered data
    const exportItems = selectedIds.length > 0 
      ? filteredData.filter(student => selectedIds.includes(student.id))
      : filteredData;

    if (!exportItems.length) {
      alert("No data available to export.");
      return;
    }

    // CSV Column Headers
    const headers = [
      "Roll No",
      "Student Name",
      "Year",
      "Department",
      "Class",
      "Total Fees",
      "Concession",
      "Paid",
      "Overdue",
      "Status",
      "Type",
      "Batch",
      "Mobile",
      "Email"
    ];

    // Format data rows (wrapping text fields in quotes to handle commas)
    const csvRows = exportItems.map(s => [
      s.rollNo,
      `"${s.name}"`,
      `"${s.year}"`,
      s.department,
      s.class,
      s.totalFees,
      s.concession,
      s.paid,
      s.overdue,
      s.status,
      s.type,
      `"${s.batch}"`,
      s.mobile,
      s.email
    ].join(","));

    // Combine headers and rows
    const csvString = [headers.join(","), ...csvRows].join("\n");

    // Download Logic
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Create a filename based on whether it's a "Selected" or "Full" report
    const fileName = selectedIds.length > 0 
      ? `Selected_Students_Fee_Report_${new Date().toLocaleDateString()}.csv`
      : `Full_Fee_Report_${new Date().toLocaleDateString()}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col max-h-[calc(100vh-140px)]">
      <h1 className="font-inter font-semibold text-xl mb-4">
        Fees Management / Academic Year{" "}
        <span className="text-[#0B56A4] font-bold">(2025 - 2026)</span>
      </h1>

      <FeeManagementFilters
        search={search}
        onSearchChange={setSearch}
        year={year}
        onYearChange={setYear}
        department={department}
        onDepartmentChange={setDepartment}
        status={status}
        onStatusChange={setStatus}
        type={type}
        onTypeChange={setType}
        onExport={exportCSV}
        onClearFilters={handleClearFilters}
        selectedCount={selectedIds.length} 
      />

      <FeeManagementTable 
        data={filteredData} 
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
    </div>
  );
};

export default Fees;