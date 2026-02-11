import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import {
  // LayoutDashboard ,
  // CircleDollarSign,
  // BellDot,
  // User,
  Power,
  Menu,
} from "lucide-react";
import logo from "../assets/favlogo.svg";
import Dashboard from '../assets/dashboard.svg';
import Rupee from '../assets/rupee.svg';
import Setting from '../assets/setting.svg';
import Dashboardfill from '../assets/dashboardfill.svg';
import Rupeefill from '../assets/rupeefill.svg';
import Settingfill from '../assets/settingfill.svg';
import NotificationBell from "./Notification";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeTab = location.pathname.split("/")[2];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Dashboardfill, iconFill :Dashboard},
    { id: "fees_management", label: "Fees Management", icon: Rupee, iconFill :Rupeefill},
    { id: "fee_demand", label: "Manage Fee Demand", icon: Settingfill, iconFill :Setting},
  ];
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout Sucessfull");
    navigate("/login");
  };

  return (
    <header className="h-20 bg-[#25343F] p-5 px-7 rounded-xl ">
      <nav className="flex w-full items-center justify-between">
        {/* 🔵 Logo */}
        <div className="flex items-center gap-3">
          <div className=" cursor-pointer block lg:hidden" onClick={() => setMenuOpen(true)}>
            <Menu className="w-6 h-6 text-white" />
          </div>
          <img src={logo} alt="" className="w-10 h-10" />
        </div>

        {/* 🟦 Navigation */}
        <div className="lg:flex gap-2 hidden ">
          {menuItems.map(({ id, label, icon, iconFill }) => {
            const isActive = activeTab === id;

            return (
              <button
                key={id}
                onClick={() => navigate(`/admin/${id}`)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition cursor-pointer
                  ${
                    isActive
                      ? "bg-white text-[#25343F]"
                      : "text-white hover:bg-white/10"
                  }`}
              >
                <img src={isActive?icon:iconFill} alt="icons" className="h-4 w-4"/>
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          {/* logout */}
          <div
            className="w-10 h-10 hidden lg:flex items-center justify-center bg-white rounded-full cursor-pointer"
            onClick={handleLogout}
          >
            <Power className="text-[#0B56A4]" size={20} />
          </div>
        </div>
      </nav>
      {/* 🍔 Hamburger Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className="absolute left-0 top-0 h-full w-72 bg-[#0B56A4] p-6 flex flex-col gap-6
                    transform transition-transform duration-300 translate-x-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <img src={logo} alt="logo" className="w-10 h-10" />
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-2 mt-6">
              {menuItems.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;

                return (
                  <button
                    key={id}
                    onClick={() => {
                      navigate(`/admin/${id}`);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
                ${
                  isActive
                    ? "bg-white text-[#0B56A4]"
                    : "text-white hover:bg-white/10"
                }`}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10"
            >
              <Power size={20} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
