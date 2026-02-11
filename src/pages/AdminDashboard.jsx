import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import Dashboard from "../pages/admin/Dashboard";
import Fees from "./admin/Fees.jsx";
import FeeDemand from "./admin/FeeDemand.jsx"
import StudentDetails from "./admin/StudentDetails.jsx";

const AdminDashboard = () => {
  return (
    <div className="w-full h-screen bg-[#FBFBFB] p-4 flex flex-col gap-4">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="mt-2">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/fees_management" element={<Fees />} />
            <Route path="/fees_management/:id" element={<StudentDetails />} />
            <Route path="Fee_demand" element={<FeeDemand />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
