import React from 'react';

const LegendItem = ({ color, label, value }) => (
  <div className="flex justify-between items-center text-xs">
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full ${color} mr-2`}></div>
      <span className="text-gray-500">{label}</span>
    </div>
    {value && <span className="font-bold text-gray-900">{value}</span>}
  </div>
);

const ChartsSection = () => {
  const projectTeamPath = "M0,60 Q50,70 100,40 T200,50 T300,20 T400,30";
  const productTeamPath = "M0,80 Q50,50 100,70 T200,30 T300,60 T400,50";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Employee Doughnut */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Total Employee</h3>
          <select className="text-[10px] text-gray-400 bg-transparent outline-none cursor-pointer border border-gray-100 rounded px-1">
            <option>All Time</option>
          </select>
        </div>
        <div className="flex flex-col items-center py-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[12px] border-gray-50"></div>
            <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-emerald-500 border-r-emerald-500 rotate-45"></div>
            <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-b-amber-400 -rotate-12"></div>
            <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-l-blue-500 rotate-12"></div>
            <div className="text-center z-10">
              <div className="text-xl font-bold">121</div>
              <div className="text-[10px] text-gray-400">Total Emp.</div>
            </div>
          </div>
          <div className="w-full mt-6 space-y-2">
            <LegendItem color="bg-emerald-500" label="Others" value="71" />
            <LegendItem color="bg-amber-400" label="Onboarding" value="27" />
            <LegendItem color="bg-blue-500" label="Ofboarding" value="23" />
          </div>
        </div>
      </div>

      {/* Job Summary Doughnut */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Job Summary</h3>
          <select className="text-[10px] text-gray-400 bg-transparent outline-none cursor-pointer border border-gray-100 rounded px-1">
            <option>All Time</option>
          </select>
        </div>
        <div className="flex flex-col items-center py-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[12px] border-gray-50"></div>
            <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-purple-600 border-r-purple-600 rotate-[30deg]"></div>
            <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-l-cyan-400 rotate-[160deg]"></div>
            <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-b-orange-400 rotate-[10deg]"></div>
            <div className="text-center z-10">
              <div className="text-xl font-bold">55</div>
              <div className="text-[10px] text-gray-400">Total Jobs</div>
            </div>
          </div>
          <div className="w-full mt-6 space-y-2">
            <LegendItem color="bg-purple-600" label="Active Job" value="36" />
            <LegendItem color="bg-cyan-400" label="Unactive" value="13" />
            <LegendItem color="bg-orange-400" label="Closed" value="6" />
          </div>
        </div>
      </div>

      {/* Team Performance Line Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900">Team Performance</h3>
          <div className="flex items-center space-x-2 border border-gray-100 px-2 py-1 rounded-lg">
            <span className="text-[10px] text-gray-500">Last 7 month</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <LegendItem color="bg-emerald-500" label="Project Team" />
          <LegendItem color="bg-amber-400" label="Product Team" />
        </div>

        <div className="relative h-40 w-full">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
            <line x1="0" y1="0" x2="400" y2="0" stroke="#f3f4f6" strokeWidth="1" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="#f3f4f6" strokeWidth="1" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="#f3f4f6" strokeWidth="1" />
            <path d={projectTeamPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            <path d={productTeamPath} fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="280" cy="38" r="4" fill="#111827" stroke="white" strokeWidth="2" />
          </svg>
          <div className="absolute -left-2 inset-y-0 flex flex-col justify-between text-[10px] text-gray-300 transform -translate-x-full pr-2">
            <span>60k</span><span>45k</span><span>30k</span>
          </div>
        </div>

        <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-medium px-1">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;