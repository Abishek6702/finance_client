import { ChevronRight } from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StudentProfileCard from "../../components/StudentProfileCard.jsx";
import  StudentFinanceAcademicPanel  from "../../components/StudentFinanceAcademicPanel.jsx";


const StudentAcademicDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { row, student } = location.state || {};

  console.log("Row:", row);
  console.log("Student:", student);
  return (
    <>
      <nav className="flex items-center  space-x-1.5  text-xl mb-3 ">
        <Link
          to="/admin/fees_management"
          className="text-black  hover:text-gray-700 transition"
        >
          Fees Details
        </Link>

        <ChevronRight size={24} className="" />

        <Link
          onClick={() => {
            navigate(-1);
          }}
          className="text-[#0b56a4] font-semibold"
        >
          {student.name}
        </Link>
        <ChevronRight size={24} className="" />

        <span className="text-[#0b56a4] font-semibold">Academic Year ({row.year})</span>
      </nav>
      <div className="min-h-[calc(100vh-200px)] flex gap-6 w-full ">
        <StudentProfileCard student={student} />
        <StudentFinanceAcademicPanel 
  student={student}
  academicYear={row}
/>
      </div>
    </>
  );
};

export default StudentAcademicDetails;
