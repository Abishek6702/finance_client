import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { Home, CircleDollarSign, BellDot, User, Power } from "lucide-react";
import logo from "../assets/favlogo.svg";
import NotificationBell from "./Notification";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname.split("/")[2];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "fees_management", label: "Fees Management", icon: CircleDollarSign },
    { id: "fee_demand", label: "Manage Fee Demand", icon: CircleDollarSign },
  ];
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout Sucessfull");
    navigate("/login");
  };

  return (
    <header className="h-20 bg-[#0B56A4] p-5 px-7 rounded-xl ">
      <nav className="flex w-full items-center justify-between">
        {/* 🔵 Logo */}
        <div className="">
          <img src={logo} alt="" className="w-10 h-10" />
        </div>

        {/* 🟦 Navigation */}
        <div className="flex gap-2">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;

            return (
              <button
                key={id}
                onClick={() => navigate(`/admin/${id}`)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition cursor-pointer
                  ${
                    isActive
                      ? "bg-white text-[#0B56A4]"
                      : "text-white hover:bg-white/10"
                  }`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          {/* logout */}
          <div
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full cursor-pointer"
            onClick={handleLogout}
          >
            <Power className="text-[#0B56A4]" size={20} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
