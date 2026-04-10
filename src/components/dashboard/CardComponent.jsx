import React, { useState } from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import userr from "../../assets/userr.svg";
import hostel from "../../assets/hostell.svg";
import bus from "../../assets/buss.svg";
import home from "../../assets/home.svg";


const stats = [
  {
    icon: userr,
    bg: "bg-[#FFE2E5]",
    iconbg: "bg-[#FA5A7D]",
    value: "1,240",
    label: "Total Students",
  },
  {
    icon: hostel,
    bg: "bg-[#FFF4DE]",
    iconbg: "bg-[#FF947A]",

    value: "38",
    label: "Total Hostelers",
  },
  {
    icon:home ,
    bg: "bg-[#DCFCE7]",
    iconbg: "bg-[#3CD856]",

    value: "94",
    label: "Total Dayschoolers",
  },
  {
    icon: bus,
    bg: "bg-[#F3E8FF]",
    iconbg: "bg-[#BF83FF]",

    value: "12",
    label: "Total Transporters",
  },
];

const years = ["2024–2025", "2023–2024", "2022–2023", "2021–2022"];
const getCurrentAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Jan = 1

  // Academic year usually starts around June/July
  if (month >= 6) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};
const CardComponent = () => {
  const [selectedYear, setSelectedYear] = useState(getCurrentAcademicYear());
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Student's Count</h2>

        {/* Year Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 bg-white "
          >
            {selectedYear}
            <ChevronDown
              size={14}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <ul className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10 w-36 text-sm">
              {years.map((year) => (
                <li
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                    selectedYear === year
                      ? "font-semibold text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {year}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-xl p-3 ${stat.bg} flex flex-col gap-2`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${stat.iconbg} `}
            >
              <img src={stat.icon} alt="" className="w-5 h-5" />
            </div>

            <p className="text-xl font-bold text-gray-800">{stat.value}</p>

            <p className="text-xs text-gray-500 font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardComponent;
