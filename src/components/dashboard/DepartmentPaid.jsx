import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import axios from "axios";

// 🔹 Sample Data (replace with API later)
const allData = [
  { department: "CSE", year: "2024-2025", paid: 120, unpaid: 30 },
  { department: "ECE", year: "2024-2025", paid: 90, unpaid: 20 },
  { department: "MECH", year: "2024-2025", paid: 70, unpaid: 40 },

  { department: "IT", year: "2024-2025", paid: 150, unpaid: 25 },
  { department: "CCE", year: "2024-2025", paid: 110, unpaid: 35 },
  { department: "EEE", year: "2024-2025", paid: 80, unpaid: 50 },

  { department: "AIDS", year: "2024-2025", paid: 150, unpaid: 25 },
  { department: "AIML", year: "2024-2025", paid: 110, unpaid: 35 },
  { department: "Cyber Security", year: "2024-2025", paid: 80, unpaid: 50 },
  { department: "CSBS", year: "2024-2025", paid: 80, unpaid: 50 },
];
const years = ["2024-2025", "2023-2024", "2022-2023", "2021-2022" ,"2025-2026"];
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
const DepartmentPaid = () => {
  const [selectedYear, setSelectedYear] = useState(getCurrentAcademicYear());
  const [open, setOpen] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const formatYearForAPI = (year) => year.replace("–", "-");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
  
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/dashboard/fees-status?year=${formatYearForAPI(selectedYear)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setStatsData(res.data.data.departments);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  }, [selectedYear]);

  const chartData = statsData.map((item) => ({
    department: item.dept,
    paid: item.paid,
    unpaid: item.unpaid,
  }));

  if (!statsData.length) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <div className="flex items-center justify-between mb-3">
        <h1 className="font-medium">Department-wise Paid / Unpaid Students</h1>

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

      {/* 🔹 Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={chartData}
          barCategoryGap="30%" // space between groups
          barGap={1}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar
            dataKey="paid"
            fill="#9bdfc4"
            radius={[6, 6, 0, 0]}
            maxBarSize={15}
          />
          <Bar
            dataKey="unpaid"
            fill="#f99bab"
            radius={[6, 6, 0, 0]}
            maxBarSize={15}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentPaid;
