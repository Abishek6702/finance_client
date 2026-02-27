import React from "react";
import { Search, ListFilter } from "lucide-react";
import CustomSelect from "./CustomSelect";

const PaymentFilter = ({
  filters,
  setFilters,
  searchTerm,
  setSearchTerm,
  students,
  setSelectedStudent
}) => {
  const defaultFilters = {
    academicYear: "2025-2026",
    year: "Year",
    dept: "Department",
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters(defaultFilters);
  };

  // Dropdown Options
  const academicYearOptions = ["2024-2025", "2025-2026", "2026-2027"];
  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const deptOptions = [
    "CSE",
    "MECH",
    "ECE",
    "CCE",
    "EEE",
    "IT",
    "AIDS",
    "AIML",
    "CSE(CYB)",
  ];
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
  
    const foundStudent = students.find(
      (student) =>
        student.name.toLowerCase() === searchTerm.toLowerCase() ||
        student.id.toLowerCase() === searchTerm.toLowerCase()
    );
  
    if (foundStudent) {
      setSelectedStudent(foundStudent);
    } else {
      alert("Student not found");
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
     <div className="relative w-110 bg-white">
  <input 
    type="text" 
    placeholder="Search Student by Name or Roll No"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    }}
    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-[#d9d9d9] bg-white text-sm focus:border-gray-400 outline-none transition-all placeholder:text-gray-400"
  />

  {/* Click Search Icon */}
  <div
    onClick={handleSearch}
    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white pl-1 cursor-pointer"
  >
    <Search className="w-4 h-4 text-gray-400" />
  </div>
</div>

      {/* Academic Year */}
      <CustomSelect
        placeholder="Academic Year"
        value={filters.academicYear}
        options={academicYearOptions}
        onChange={(v) => setFilters({ ...filters, academicYear: v })}
        className="w-48"
      />

      {/* Year */}
      <CustomSelect
        placeholder="Year"
        value={filters.year !== "Year" ? filters.year : ""}
        options={yearOptions}
        onChange={(v) => setFilters({ ...filters, year: v })}
        className="w-36"
      />

      {/* Department */}
      <CustomSelect
        placeholder="Department"
        value={filters.dept !== "Department" ? filters.dept : ""}
        options={deptOptions}
        onChange={(v) => setFilters({ ...filters, dept: v })}
        className="w-52"
      />

      {/* Clear Button */}
      <button
        onClick={handleClearFilters}
        className="h-10 px-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50  text-gray-700 transition-colors"
      >
        Clear <ListFilter size={15} />
      </button>
    </div>
  );
};

export default PaymentFilter;



// add payment code for this 
// import React, { useState, useMemo } from "react";
// import { ChevronRight, Search } from "lucide-react";
// import PaymentFilter from "../../components/PaymentFilter";
// import StudentProfile from "../../assets/student.jpg";
// import EmptyImage from "../../assets/StudentWithMobile.jpeg";
// import Payment from "../../components/Payment";
// import { Link } from "react-router-dom";

// const AddPayment = () => {
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   console.log("selectedStudent", selectedStudent);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     academicYear: "2025-2026",
//     year: "Year",
//     dept: "Department",
//   });

//   const students = [
//     {
//       id: "21CS001",
//       name: "Anbu dinesh",
//       year: "1st Year",
//       dept: "CSE",
//       img: StudentProfile,
//     },
//     {
//       id: "21CS002",
//       name: "kahar",
//       year: "1st Year",
//       dept: "EEE",
//       img: StudentProfile,
//     },
//     {
//       id: "22CS003",
//       name: "Surya chandran",
//       year: "1st Year",
//       dept: "ECE",
//       img: StudentProfile,
//     },
//     {
//       id: "21CS004",
//       name: "Saravanan",
//       year: "1st Year",
//       dept: "CCE",
//       img: StudentProfile,
//     },
//   ];

//   const filteredStudents = useMemo(() => {
//     return students.filter((student) => {
//       const matchesSearch =
//         student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         student.id.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesYear =
//         filters.year === "Year" || student.year === filters.year;
//       const matchesDept =
//         filters.dept === "Department" || student.dept === filters.dept;
//       return matchesSearch && matchesYear && matchesDept;
//     });
//   }, [searchTerm, filters]);

//   return (
//     <main className="max-w-[1600px]">
//       <nav className="flex items-center  space-x-1.5  text-xl mb-3">
//         <Link
//           to="/admin/payment"
//           className="text-black  hover:text-gray-700 transition"
//         >
//           Payment Details
//         </Link>

//         <ChevronRight size={24} className="" />

//         <span className="text-[#0b56a4] font-semibold">New Payment</span>
//       </nav>

//       {/* Reusable Filter Component */}
//       <PaymentFilter
//   filters={filters}
//   setFilters={setFilters}
//   searchTerm={searchTerm}
//   setSearchTerm={setSearchTerm}
//   students={students}
//   setSelectedStudent={setSelectedStudent}
// />

//       <div className="flex gap-6 h-[calc(100vh-230px)]">
//         {/* Right Section */}
//         <div className="w-full bg-white border border-gray-100 rounded-2xl flex flex-col p-4 shadow-sm relative">
//           {selectedStudent ? (
//             <div className="w-full ">
//               <Payment selectedStudent={selectedStudent} />
//             </div>
//           ) : (
//             <div className="max-w-sm mx-auto mt-20 text-center">
//               <img
//                 src={EmptyImage}
//                 alt="Select student"
//                 className="w-52 mb-8 mx-auto opacity-80"
//               />
//               <h2 className="text-xl font-semibold text-gray-800 mb-3">
//                 Select Student to proceed the Payment
//               </h2>
//               <p className="text-gray-500 text-sm leading-relaxed">
//                 Choose a student from the list to view balance.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// };

// export default AddPayment;
