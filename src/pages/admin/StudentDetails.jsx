import { Link, useLocation } from "react-router-dom";
import StudentProfileCard from "../../components/StudentProfileCard.jsx";
import { StudentFinancePanel } from "../../components/StudentFinancePanel.jsx";
import { ChevronRight } from "lucide-react";

export default function StudentDetails() {
  const location = useLocation();
  const student = location.state?.student;
  console.log(student);

  if (!student) {
    return <div className="p-10">No student data found</div>;
  }

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

        <span className="text-[#0b56a4] font-semibold">{student.name}</span>
      </nav>
      <div className="min-h-[calc(100vh-200px)] flex gap-6  ">
        <StudentProfileCard student={student} />
        <StudentFinancePanel student={student} />
      </div>
    </>
  );
}
