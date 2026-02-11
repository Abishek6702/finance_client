import { useLocation } from "react-router-dom";
import StudentProfileCard from "../../components/StudentProfileCard.jsx";
import {StudentFinancePanel} from "../../components/StudentFinancePanel.jsx";

export default function StudentDetails() {
  const location = useLocation();
  const student = location.state?.student;
    console.log(student)


  if (!student) {
    return <div className="p-10">No student data found</div>;
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex gap-6  ">
      <StudentProfileCard student={student} />
      <StudentFinancePanel student={student} />
    </div>
  );
}