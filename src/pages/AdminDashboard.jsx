// import { Routes, Route, Navigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

// import Dashboard from "../pages/admin/Dashboard";
// import Fees from "./admin/Fees.jsx";

// const AdminDashboard = () => {
//   return (
//     <div className="w-full h-screen p-9 md:p-4">  
//       {/* INNER LAYOUT */}
//       <div className="w-full h-full flex gap-4 md:gap-6 rounded-2xl border border-gray-200 shadow-lg">  {/* Outer gap via flex gap, rounded */}
//         <Sidebar />

//         <main className="flex-1 h-full overflow-y-auto rounded-xl p-0">  {/* No inner p on main */}
//           <div className="p-6 md:p-8 h-full">  {/* Content padding inside */}
//             <Routes>
//               <Route path="dashboard" element={<Dashboard />} />
//               <Route path="fees" element={<Fees />} />
//               <Route path="*" element={<Navigate to="dashboard" replace />} />
//             </Routes>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };


// export default AdminDashboard;




import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import Dashboard from "../pages/admin/Dashboard";
import Fees from "./admin/Fees.jsx";
import FeeDemand from "./admin/FeeDemand.jsx"

const AdminDashboard = () => {
  return (
    <div className="w-full h-screen bg-gray-200 p-4 flex flex-col gap-4">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="mt-10">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="fees_management" element={<Fees />} />
            <Route path="Fee_demand" element={<FeeDemand />} />

            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
