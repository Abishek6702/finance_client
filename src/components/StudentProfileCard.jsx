import Favlogo from "../assets/favlogo.svg";

import UserImg from "../assets/user.svg";
import RollnoImg from "../assets/rollno.svg";
import DepartmentImg from "../assets/department.svg";
import MobileImg from "../assets/mobile.svg";
import EmailImg from "../assets/email.svg";
import BatchImg from "../assets/user.svg";

export default function StudentProfileCard({ student }) {
  const Item = ({ icon, label, value }) => (
    <div className=" p-2 border-b last:border-b-0 border-[#d9d9d9] ">
      <div className="flex items-start gap-4">
        {/* Image Box */}
        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-[#d9d9d9] flex items-center justify-center">
          <img src={icon} alt={label} className="w-5 h-5 object-contain" />
        </div>

        {/* Text */}
        <div>
          <p className="text-gray-500 text-[12px]">{label}</p>
          <p
            title={value}
            className="text-[14px] font-semibold text-gray-700 w-24 truncate"
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-[16%] rounded-3xl p-4 border border-[#d9d9d9] bg-white">
      {/* Student Image */}
      <div className=" m-auto  rounded-3xl overflow-hidden mb-3 ">
        <img
          src={student.profileImage || Favlogo}
          alt="student"
          className="object-cover w-full h-38"
        />
      </div>

      <Item icon={UserImg} label="Student Name" value={student.name} />

      <Item icon={RollnoImg} label="Roll Number" value={student.rollNo} />

      {/* <Item
        icon={DepartmentImg}
        label="Department"
        value={student.department}
      /> */}

      <Item
        icon={MobileImg}
        label="Mobile Number"
        value={student.mobile || "Not Provided"}
      />

      <Item
        icon={EmailImg}
        label="Mail Id"
        value={student.email || "Not Provided"}
      />

      <Item icon={BatchImg} label="Batch" value={student.batch || "NIL"} />
    </div>
  );
}
