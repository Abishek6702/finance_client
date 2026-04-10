import { ChevronDown } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

const getCurrentAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (month >= 6) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

const years = ["2024-2025", "2023-2024", "2022-2023", "2021-2022"];
const timing = ["Weekly", "Monthly", "Yearly"];

const paymentData = {
  "2024-2025": {
    Weekly: [
      { label: "W1", amount: 12000 },
      { label: "W2", amount: 18500 },
      { label: "W3", amount: 15000 },
      { label: "W4", amount: 22000 },
      { label: "W5", amount: 17000 },
      { label: "W6", amount: 25000 },
      { label: "W7", amount: 21000 },
    ],
    Monthly: [
      { label: "Jun", amount: 45000 },
      { label: "Jul", amount: 52000 },
      { label: "Aug", amount: 61000 },
      { label: "Sep", amount: 58000 },
      { label: "Oct", amount: 69000 },
      { label: "Nov", amount: 72000 },
      { label: "Dec", amount: 76000 },
      { label: "Jan", amount: 65000 },
      { label: "Feb", amount: 70000 },
      { label: "Mar", amount: 74000 },
      { label: "Apr", amount: 79000 },
      { label: "May", amount: 83000 },
    ],
    Yearly: [
      { label: "2021-2022", amount: 540000 },
      { label: "2022-2023", amount: 610000 },
      { label: "2023-2024", amount: 720000 },
      { label: "2024-2025", amount: 804000 },
    ],
  },
  "2023-2024": {
    Weekly: [
      { label: "W1", amount: 10000 },
      { label: "W2", amount: 13500 },
      { label: "W3", amount: 16000 },
      { label: "W4", amount: 14000 },
      { label: "W5", amount: 20000 },
      { label: "W6", amount: 19000 },
      { label: "W7", amount: 23000 },
    ],
    Monthly: [
      { label: "Jun", amount: 39000 },
      { label: "Jul", amount: 45000 },
      { label: "Aug", amount: 50000 },
      { label: "Sep", amount: 54000 },
      { label: "Oct", amount: 59000 },
      { label: "Nov", amount: 61000 },
      { label: "Dec", amount: 64000 },
      { label: "Jan", amount: 60000 },
      { label: "Feb", amount: 62000 },
      { label: "Mar", amount: 67000 },
      { label: "Apr", amount: 69000 },
      { label: "May", amount: 73000 },
    ],
    Yearly: [
      { label: "2020-2021", amount: 480000 },
      { label: "2021-2022", amount: 540000 },
      { label: "2022-2023", amount: 610000 },
      { label: "2023-2024", amount: 723000 },
    ],
  },
  "2022-2023": {
    Weekly: [
      { label: "W1", amount: 9000 },
      { label: "W2", amount: 12000 },
      { label: "W3", amount: 15000 },
      { label: "W4", amount: 13000 },
      { label: "W5", amount: 16000 },
      { label: "W6", amount: 17500 },
      { label: "W7", amount: 19000 },
    ],
    Monthly: [
      { label: "Jun", amount: 32000 },
      { label: "Jul", amount: 36000 },
      { label: "Aug", amount: 42000 },
      { label: "Sep", amount: 47000 },
      { label: "Oct", amount: 50000 },
      { label: "Nov", amount: 53000 },
      { label: "Dec", amount: 56000 },
      { label: "Jan", amount: 52000 },
      { label: "Feb", amount: 55000 },
      { label: "Mar", amount: 58000 },
      { label: "Apr", amount: 61000 },
      { label: "May", amount: 65000 },
    ],
    Yearly: [
      { label: "2019-2020", amount: 390000 },
      { label: "2020-2021", amount: 480000 },
      { label: "2021-2022", amount: 540000 },
      { label: "2022-2023", amount: 637000 },
    ],
  },
  "2021-2022": {
    Weekly: [
      { label: "W1", amount: 8000 },
      { label: "W2", amount: 11000 },
      { label: "W3", amount: 10000 },
      { label: "W4", amount: 14500 },
      { label: "W5", amount: 15500 },
      { label: "W6", amount: 17000 },
      { label: "W7", amount: 18000 },
    ],
    Monthly: [
      { label: "Jun", amount: 28000 },
      { label: "Jul", amount: 31000 },
      { label: "Aug", amount: 35000 },
      { label: "Sep", amount: 39000 },
      { label: "Oct", amount: 43000 },
      { label: "Nov", amount: 46000 },
      { label: "Dec", amount: 49000 },
      { label: "Jan", amount: 47000 },
      { label: "Feb", amount: 50000 },
      { label: "Mar", amount: 53000 },
      { label: "Apr", amount: 56000 },
      { label: "May", amount: 59000 },
    ],
    Yearly: [
      { label: "2018-2019", amount: 320000 },
      { label: "2019-2020", amount: 390000 },
      { label: "2020-2021", amount: 480000 },
      { label: "2021-2022", amount: 571000 },
    ],
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900">
          ₹ {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const Timingpaid = () => {
  const [selectedYear, setSelectedYear] = useState(getCurrentAcademicYear());
  const [selectedTiming, setSelectedTiming] = useState("Weekly");
  const [open, setOpen] = useState(false);
  const [openTiming, setOpenTiming] = useState(false);

  const chartData = useMemo(() => {
    return paymentData[selectedYear]?.[selectedTiming] || [];
  }, [selectedYear, selectedTiming]);

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-base font-semibold text-gray-900">
          Payment Report
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
            >
              {selectedYear}
              <ChevronDown
                size={14}
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <ul className="absolute right-0 z-20 mt-2 w-36 rounded-xl border border-gray-200 bg-white text-sm shadow-lg">
                {years.map((year) => (
                  <li
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setOpen(false);
                    }}
                    className={`cursor-pointer px-4 py-2 hover:bg-gray-50 ${
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
              onClick={() => setOpenTiming(!openTiming)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
            >
              {selectedTiming}
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  openTiming ? "rotate-180" : ""
                }`}
              />
            </button>

            {openTiming && (
              <ul className="absolute right-0 z-20 mt-2 w-36 rounded-xl border border-gray-200 bg-white text-sm shadow-lg">
                {timing.map((time) => (
                  <li
                    key={time}
                    onClick={() => {
                      setSelectedTiming(time);
                      setOpenTiming(false);
                    }}
                    className={`cursor-pointer px-4 py-2 hover:bg-gray-50 ${
                      selectedTiming === time
                        ? "font-semibold text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {time}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {selectedTiming === "Yearly" ? (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="paymentFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#paymentFill)"
                dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
                barSize={selectedTiming === "Weekly" ? 38 : 28}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Timingpaid;
