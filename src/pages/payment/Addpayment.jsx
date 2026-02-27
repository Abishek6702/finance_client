import React, { useState, useMemo } from "react";
import { ChevronRight, Search } from "lucide-react";
import StudentCard from "../../components/StudentCard";
import PaymentFilter from "../../components/PaymentFilter"; // Import the new component
import StudentProfile from "../../assets/student.jpg";
import EmptyImage from "../../assets/StudentWithMobile.jpeg";
import Payment from '../../components/Payment'
import { Link } from "react-router-dom";

const AddPayment = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  console.log("selectedStudent", selectedStudent);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    academicYear: "2025-2026",
    year: "Year",
    dept: "Department",
  });

  const students = [
    {
      id: "21CS001",
      name: "Anbu dinesh",
      year: "1st Year",
      dept: "CSE",
      img: StudentProfile,
    },
    {
      id: "21CS002",
      name: "kahar",
      year: "1st Year",
      dept: "EEE",
      img: StudentProfile,
    },
    {
      id: "21CS003",
      name: "Surya chandran",
      year: "1st Year",
      dept: "ECE",
      img: StudentProfile,
    },
    {
      id: "21CS004",
      name: "Saravanan",
      year: "1st Year",
      dept: "CCE",
      img: StudentProfile,
    },
  ];

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear =
        filters.year === "Year" || student.year === filters.year;
      const matchesDept =
        filters.dept === "Department" || student.dept === filters.dept;
      return matchesSearch && matchesYear && matchesDept;
    });
  }, [searchTerm, filters]);

  return (
    <main className="max-w-[1600px]">
      <nav className="flex items-center  space-x-1.5  text-xl mb-3">
        <Link
          to="/admin/payment"
          className="text-black  hover:text-gray-700 transition"
        >
          Payment Details
        </Link>

       <ChevronRight size={24} className="" />

        <span className="text-[#0b56a4] font-semibold">New Payment</span>
      </nav>

      {/* Reusable Filter Component */}
      <PaymentFilter
        filters={filters}
        setFilters={setFilters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="flex gap-6 h-[calc(100vh-250px)]">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-white border border-gray-100 rounded-2xl p-4 overflow-y-auto shadow-sm">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                isSelected={selectedStudent?.id === student.id}
                onClick={() => setSelectedStudent(student)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full  text-gray-400 space-y-2">
              <Search size={32} strokeWidth={1.5} />
              <p className="text-sm">No students found matching filters.</p>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="w-3/3 bg-white border border-gray-100 rounded-2xl flex flex-col p-8 shadow-sm relative">
          {selectedStudent ? (
            <div className="w-full max-w-md">
             <Payment selectedStudent={selectedStudent}/>
            </div>
          ) : (
            <div className="max-w-sm mx-auto mt-20 text-center">
              <img
                src={EmptyImage}
                alt="Select student"
                className="w-52 mb-8 mx-auto opacity-80"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Select Student to proceed the Payment
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Choose a student from the list to view balance.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AddPayment;
