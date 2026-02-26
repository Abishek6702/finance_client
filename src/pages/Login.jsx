import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import toast from "react-hot-toast";

import AutoCarousel from "../components/AutoCarousel";
import logo from "../assets/logo.svg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [view, setView] = useState("login");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        { email, password },
      );

      const { token, role } = res.data;
      localStorage.setItem("token", token);
      toast.success("Login successful!");

      if (role.toLowerCase() === "admin") {
        navigate("/admin");
      } else if (role.toLowerCase() === "superadmin") {
        navigate("/Superadmin");
      } else {
        navigate("/notfound");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Forgot Password ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
        { email },
      );
      toast.success("OTP sent to your email!");
      setView("reset");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  // --- Reset Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`,
        { email, otp, newPassword },
      );
      toast.success("Password reset successfully! Please login.");
      setView("login");
      setOtp("");
      setNewPassword("");
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-gray-50">
      {/* Left Column */}
      <div className=" md:w-1/2 flex items-center justify-center px-6 z-500 ">
        <div className=" max-w-md w-full space-y-6">
          <img src={logo} alt="Logo" className="w-40 mx-auto mb-6" />

          {/* Titles */}
          {view === "login" && (
            <>
              <div className="flex gap-2 ">
                <h1 className="text-3xl font-bold text-[#0B56A4] text-center inter">
                  Login
                </h1>
                <h1 className="text-3xl font-bold text-center inter">
                  to your Account
                </h1>
              </div>
            </>
          )}
          {view === "forgot" && (
            <h1 className="text-2xl font-bold text-gray-900 text-center inter">
              Forgot Password
            </h1>
          )}
          {view === "reset" && (
            <h1 className="text-2xl font-bold text-gray-900 text-center inter">
              Reset Password
            </h1>
          )}

          {/* Login Form */}
          {view === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 ">
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-[#0B56A4]"
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-[#0B56A4]"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                  <input type="checkbox" className="w-4 h-4" />
                  <p className="inter">Remember Me</p>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-sm text-[#0B56A4] cursor-pointer inter"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white font-semibold ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0b56a4]"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {view === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-gray-600 text-center text-sm inter">
                Enter your email to receive an OTP.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-[#0B56A4]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-1/2 py-2 rounded-lg bg-gray-300 inter"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className={`w-1/2 py-2 rounded-lg text-white inter ${
                    forgotLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#0b56a4]"
                  }`}
                >
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Reset Password Form */}
          {view === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-[#0B56A4]"
              />

              {/* New Password with toggle */}
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-[#0B56A4]"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff /> : <Eye />}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-1/2 py-2 rounded-lg bg-gray-300 inter"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className={`w-1/2 py-2 rounded-lg text-white inter ${
                    resetLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#0b56a4]"
                  }`}
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden md:flex w-[60%] items-center justify-center z-500">
        <AutoCarousel />
      </div>
    </div>
  );
};

export default Login;
