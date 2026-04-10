import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Hostel", value: 112, color: "#62b2fd" },
  { name: "Dayscholar", value: 72, color: "#9f97f7" },
  { name: "Transport", value: 72, color: "#ffb447" },
];
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

const DepartmentCount = () => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  const [selectedDept, setSelectedDept] = useState("ECE");
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <div className="flex items-center justify-between px-4 pt-2">
        <h2 className="font-medium ">Overall Department count</h2>
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
          {item.name} - <span className="font-semibold">{item.value} </span>Members
        </div>
      ))}
    </div>
  </div>

</div>
    </div>
  );
};

export default DepartmentCount;
