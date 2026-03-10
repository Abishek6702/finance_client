// import { Link, useLocation } from "react-router-dom";
// import StudentProfileCard from "../../components/StudentProfileCard.jsx";
// import { StudentFinancePanel } from "../../components/StudentFinancePanel.jsx";
// import { ChevronRight } from "lucide-react";
// import nodata from "../../assets/nodata.svg";


// export default function StudentDetails() {
//   const location = useLocation();
//   const student = location.state?.student;
//   console.log("jju",student);

//   if (!student) {
//     return <div className="p-10">  <img src={nodata} alt="No data" className="w-50 " />
//     <p className="text-gray-500">No results found.</p></div>;
//   }

//   return (
//     <>
//     <nav className="flex items-center  space-x-1.5  text-xl mb-3 ">
//         <Link
//           to="/admin/fees_management"
//           className="text-black  hover:text-gray-700 transition"
//         >
//           Fees Details
//         </Link>

//        <ChevronRight size={24} className="" />

//         <span className="text-[#0b56a4] font-semibold">{student.name}</span>
//       </nav>
//       <div className="min-h-[calc(100vh-200px)] flex gap-6  ">
//         <StudentProfileCard student={student} />
//         <StudentFinancePanel student={student} />
//       </div>
//     </>
//   );
// }


import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight } from "lucide-react";

import StudentProfileCard from "../../components/StudentProfileCard.jsx";
import { StudentFinancePanel } from "../../components/StudentFinancePanel.jsx";
import nodata from "../../assets/nodata.svg";

export default function StudentDetails() {

  const { rollNo } = useParams();
  console.log("rollNo param:", rollNo);

  const [student, setStudent] = useState(null);

  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/feedetails/${rollNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data.data;

      const formattedStudent = {
        rollNo: data.student.rollNo,
        name: data.student.name,
        profileImage: data.student.photo,
        department: data.student.department,
        batch: data.student.batch,

        mobile: data.contact.student.mobile,
        email: data.contact.student.email,

        iscollegetransport: data.feeSummary[0]?.studentType?.transport,
        ishostler: data.feeSummary[0]?.studentType?.hostel,
        isdayscholer: !data.feeSummary[0]?.studentType?.hostel,

        feeSummary: data.feeSummary,
      };

      setStudent(formattedStudent);
    } catch (error) {
      console.error("Student API error", error);
    }
  };

  useEffect(() => {
    if (!rollNo) return;
    fetchStudent();
  }, [rollNo]);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4">
        <img src={nodata} className="w-52" alt="No data" />
        <p className="text-gray-500 text-lg">Loading student...</p>
      </div>
    );
  }

  return (
    <>
      <nav className="flex items-center space-x-1.5 text-xl mb-3">

        <Link
          to="/admin/fees_management"
          className="text-black hover:text-gray-700 transition"
        >
          Fees Details
        </Link>

        <ChevronRight size={24} />

        <span className="text-[#0b56a4] font-semibold">
          {student.name}
        </span>

      </nav>

      <div className="min-h-[calc(100vh-200px)] flex gap-6">

        <StudentProfileCard student={student} />

        <StudentFinancePanel student={student} />

      </div>
    </>
  );
}