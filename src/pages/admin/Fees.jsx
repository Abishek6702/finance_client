import { useState, useMemo } from "react";
import FeeManagementTable from "../../components/FeeManagementTable";
import FeeManagementFilters from "../../components/FeeManagementFilters";

const studentNames = [
  "Aarav Sharma",
  "Ananya Verma",
  "Rohan Patel",
  "Kavya Iyer",
  "Aditya Singh",
  "Priya Nair",
  "Arjun Mehta",
  "Sneha Gupta",
  "Vikram Rao",
  "Pooja Malhotra",
  "Rahul Khanna",
  "Neha Joshi",
  "Siddharth Jain",
  "Aishwarya Kulkarni",
  "Kunal Aggarwal",
  "Meera Menon",
  "Aman Bansal",
  "Ritika Choudhary",
  "Nikhil Saxena",
  "Shreya Banerjee",
  "Varun Kapoor",
  "Isha Arora",
  "Mohit Tandon",
  "Divya Mishra",
  "Yash Oberoi",
];
const yearMap = {
  1: "1st Year",
  2: "2nd Year",
  3: "3rd Year",
  4: "4th Year",
};
const classes = [
  "CSE-A", "CSE-B", "CSE-C",
  "CCE", "IT",
  "AIDS-A", "AIDS-B", "AIDS-C",
  "AIML",
  "EEE",
  "MECH",
  "ECE-A", "ECE-B", "ECE-C",
  "CSBS"
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

// const individualDcb = Array.from ({length:2}, (_, index)=>{
//   let status = "Partial";
//   if (paid === totalFees) status = "Paid";
//   if (paid === 0) status = "Overdue";
//   return{
//     academicyear:"2025 - 2026",
//     class : "cse-a",
//     community : communities[index % communities.length],
//     demand : "500000",
//     consession : "50000",
//     paid : "250000",
//     fine : "500",
//     overdue : "2000",
//     type : "transport",
//     status,
//     total : "500000"  
//   }
// })

const feeData = Array.from({ length: 25 }, (_, index) => {
  const totalFees = 25000;
  const paidOptions = [25000, 15000, 10000, 5000, 0];
  const paid = paidOptions[index % paidOptions.length];
  const overdue = totalFees - paid;

  let status = "Partial";
  if (paid === totalFees) status = "Paid";
  if (paid === 0) status = "Overdue";

  const type = studentTypes[index % 3];
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
    type,
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

  const filteredData = useMemo(() => {
    return feeData.filter((s) => {
      return (
        (!search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.rollNo.includes(search)) &&
        (!year || s.year === year) &&
        (!department || s.department === department) &&
        (!status || s.status === status)&&
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
};

  const exportCSV = () => {
    if (!filteredData.length) return;

    const headers = Object.keys(filteredData[0]).join(",");
    const rows = filteredData.map((r) => Object.values(r).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "fee-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col  max-h-[calc(100vh-140px)]">
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
      />

      <FeeManagementTable data={filteredData} />
    </div>
  );
};

export default Fees;
