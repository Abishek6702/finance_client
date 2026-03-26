import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ApiRequest } from "../../utils/ApiRequest";
import FeeSearchFilter from "../../components/FeeSearchFilter";
import EmptyImage from "../../assets/StudentWithMobile.jpeg";

const Fees = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    academicYear: "2025-2026",
    year: "Year",
    dept: "Department",
  });

  // 🔹 Map year number → label
  const yearLabel = (year) => {
    const map = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };
    return map[year] || `${year} Year`;
  };

  // 🔹 Debounce search
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setStudents([]);
      return;
    }

    const delay = setTimeout(() => {
      fetchStudents(searchTerm);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // 🔹 API call
  const fetchStudents = async (query) => {
    setLoading(true);
    try {
      const res = await ApiRequest(
        `/api/studentsManagement/search?q=${query}`
      );

      if (res.success && res.data) {
        const formatted = res.data.map((student) => ({
          id: student.rollNo,
          name: student.name,
          year: yearLabel(student.currentYear),
          dept: student.department,
          img: student.profile,
        }));

        setStudents(formatted);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Apply filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesYear =
        filters.year === "Year" || student.year === filters.year;

      const matchesDept =
        filters.dept === "Department" || student.dept === filters.dept;

      return matchesYear && matchesDept;
    });
  }, [students, filters]);

  return (
    <main className="max-w-400">

      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-4">
        <nav className="flex items-center space-x-1.5 text-xl">
          <Link
            to="/admin/fees_management"
            className="text-black hover:text-gray-700 transition"
          >
            Fee Details
          </Link>
        </nav>

        {/* 🔹 Updated Filter */}
        <FeeSearchFilter
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredStudents={filteredStudents}
        />
      </div>

      {/* 🔹 Empty / Instruction UI */}
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        <div className="w-full bg-white border border-gray-100 rounded-2xl flex flex-col p-4 shadow-sm">

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

        </div>
      </div>
    </main>
  );
};

export default Fees;