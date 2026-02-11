import Favlogo from "../assets/favlogo.svg";
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  FileText,
} from "lucide-react";

export default function StudentProfileCard({ student }) {
  const Item = ({ icon: Icon, label, value }) => (
    <div className="py-4 border-b last:border-b-0 border-[#d9d9d9]">
      <div className="flex items-start gap-4">
        {/* Icon Box */}
        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-[#d9d9d9] flex items-center justify-center">
          <Icon size={20} className="text-gray-700" />
        </div>

        {/* Text */}
        <div>
          <p className="text-gray-500 text-[12px]">{label}</p>
          <p className="text-[14px] font-semibold text-gray-700">
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-[22%]  rounded-3xl p-6 border border-[#d9d9d9] bg-white ">
      {/* Student Image */}
      <div className="w-[50%] m-auto rounded-3xl overflow-hidden mb-4 border border-[#d9d9d9]">
        <img
          src={student.profileImage || Favlogo}
          alt="student"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Info Section */}
      <Item
        icon={User}
        label="Student Name"
        value={student.name}
      />

      <Item
        icon={FileText}
        label="Roll Number"
        value={student.rollNo}
      />

      <Item
        icon={GraduationCap}
        label="Department"
        value={student.department}
      />

      <Item
        icon={Phone}
        label="Mobile Number"
        value={student.mobile || "Not Provided"}
      />

      <Item
        icon={Mail}
        label="Mail Id"
        value={student.email || "Not Provided"}
      />

      <Item
        icon={User}
        label="Batch"
        value={student.batch || "NIL"}
      />
    </div>
  );
}