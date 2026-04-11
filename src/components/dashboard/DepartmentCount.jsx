import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import axios from "axios";

const Department = [
  "ECE",
  "CSE",
  "IT",
  "MECH",
  "CCE",
  "EEE",
  "AIDS",
  "AIML",
  "Cyber Security",
  "CSBS",
];
const years = ["2024–2025", "2023–2024", "2022–2023", "2021–2022", "2025-2026"];
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
const DepartmentCount = () => {
  const [selectedYear, setSelectedYear] = useState(getCurrentAcademicYear());
  const [openYear, setOpenYear] = useState(false);

  const [selectedDept, setSelectedDept] = useState("CSE");
  const [open, setOpen] = useState(false);

  const [statsData, setStatsData] = useState(null);

  const formatYearForAPI = (year) => year.replace("–", "-");
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/dashboard/department-distribution?year=${formatYearForAPI(selectedYear)}&dept=${selectedDept}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setStatsData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [selectedYear, selectedDept]);

  const data = statsData
    ? [
        { name: "Hostel", value: statsData.Hostel, color: "#62b2fd" },
        { name: "Dayscholar", value: statsData.Dayscholar, color: "#9f97f7" },
        { name: "Transport", value: statsData.Transport, color: "#ffb447" },
      ]
    : [];
  const total = statsData?.totalMembers || 0;

  if (!statsData) {
    return (
      <div className="p-4 flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-between px-4 pt-2">
        <h2 className="font-medium ">Overall Department count</h2>
        <div className="flex items-center gap-4">
          {/* Year Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenYear(!openYear)}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 bg-white "
            >
              {selectedYear}
              <ChevronDown
                size={14}
                className={`transition-transform ${openYear ? "rotate-180" : ""}`}
              />
            </button>

            {openYear && (
              <ul className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10 w-36 text-sm">
                {years.map((year) => (
                  <li
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setOpenYear(false);
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
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 bg-white "
            >
              {selectedDept}
              <ChevronDown
                size={14}
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <ul className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10 w-36 text-sm">
                {Department.map((dept) => (
                  <li
                    key={dept}
                    onClick={() => {
                      setSelectedDept(dept);
                      setOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                      selectedDept === dept
                        ? "font-semibold text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {dept}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2">
        {/* LEFT: CHART */}
        <div className="w-[45%] h-[180px] relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-xl font-bold">{total}</h1>
            <p className="text-gray-500 text-sm">Members</p>
          </div>
        </div>

        {/* RIGHT: LEGEND */}
        <div className="w-[50%] pl-4">
          <div className="space-y-3">
            {data.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name} -{" "}
                <span className="font-semibold">{item.value} </span>Members
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCount;
