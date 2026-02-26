import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./superadmin/SuperDashboard.jsx";

import SuperAdminNavbar from "../components/SuperAdminNavbar.jsx";
import FeesManagement from "./superadmin/FeesManagement.jsx";
import RecallReceipts from "./superadmin/RecallReceipts.jsx"

const SuperAdminDashboard = () => {
  return (
    <div className="w-full h-screen bg-[#FBFBFB] p-4 flex flex-col gap-4">
      {/* NAVBAR */}
      <SuperAdminNavbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 ">
        <div className=" ">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="feesmanagement" element={<FeesManagement />} />
            <Route path="recallreceipts" element={<RecallReceipts />} />


            

            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
