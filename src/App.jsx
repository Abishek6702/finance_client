import { Routes, Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./utils/ProtectedRoutes";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            fontSize: "14px",
            background: "#ffffff",
            color: "#111827",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Superadmin/*"
          element={
            <ProtectedRoute>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
