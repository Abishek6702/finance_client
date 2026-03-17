import React, { useState, useMemo, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import PaymentFilter from "../../components/PaymentFilter";
import EmptyImage from "../../assets/StudentWithMobile.jpeg";
import Payment from "../../components/Payment";
import { Link } from "react-router-dom";
import { ApiRequest } from "../../utils/ApiRequest";

const AddPayment = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    academicYear: "2025-2026",
    year: "Year",
    dept: "Department",
  });

  // Helper to map year numbers to labels
  const yearLabel = (year) => {
    const map = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };
    return map[year] || `${year} Year`;
  };

  // 1. DEBOUNCING LOGIC
  // We use an effect to wait 300ms after the last keystroke before fetching
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setStudents([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchStudents(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // 2. API CALL LOGIC
  const fetchStudents = async (query) => {
    setLoading(true);
    try {
      // Using the specific search endpoint from your documentation
      const res = await ApiRequest(`/api/studentsManagement/search?q=${query}`);
      console.log("jk",res);
      if (res.success && res.data) {
        const formatted = res.data.map((student) => ({
          id: student.rollNo, // Mapping from search API structure
          name: student.name,
          year: yearLabel(student.currentYear),
          dept: student.department,
          img: student.profile,
          isExcessAmountTrue: student.isExcessAmountTrue,
          excessAmount: student.excessAmount,
        }));
        setStudents(formatted);

      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesYear = filters.year === "Year" || student.year === filters.year;
      const matchesDept = filters.dept === "Department" || student.dept === filters.dept;
      return matchesYear && matchesDept;
    });
  }, [students, filters]);

  return (
    <main className="max-w-400">
      <div className="flex items-center justify-between mb-4">
        <nav className="flex items-center space-x-1.5 text-xl">
          <Link to="/admin/payment" className="text-black hover:text-gray-700 transition">
            Payment Details
          </Link>
          <ChevronRight size={24} />
          <span
            onClick={() => {
              setSelectedStudent(null);
              setSearchTerm("");
              setStudents([]);
            }}
            className="text-[#0b56a4] font-semibold cursor-pointer"
          >
            New Payment
          </span>

          {selectedStudent && (
            <>
              <ChevronRight size={24} />
              <span className="text-[#0b56a4] font-medium">
                {selectedStudent.name} ({selectedStudent.id}) -{" "}
                {selectedStudent.year} / {selectedStudent.dept}
              </span>
            </>
          )}
        </nav>

        <PaymentFilter
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredStudents={filteredStudents}
          setSelectedStudent={setSelectedStudent}
          isLoading={loading} // Pass loading state to UI if needed
        />
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        <div className="w-full bg-white border border-gray-100 rounded-2xl flex flex-col p-4 shadow-sm">
          {selectedStudent ? (
            <Payment selectedStudent={selectedStudent} />
          ) : (
            <div className="max-w-sm mx-auto mt-20 text-center">
              <img
                src={EmptyImage}
                alt="Select student"
                className="w-52 mb-8 mx-auto opacity-80"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {loading ? "Searching..." : "Search & Select Student to proceed"}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {searchTerm.length > 0 
                  ? "Looking for matches..." 
                  : "Start typing a Roll Number (e.g., 23CS) to begin."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AddPayment;