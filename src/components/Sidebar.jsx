import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, CircleDollarSign } from "lucide-react";
import "./side.css";
import logo from "../assets/logo.svg";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: Home },
    { id: "fees", title: "Fees Management", icon: CircleDollarSign },
  ];

  // ✅ active tab from URL (same as old project)
  const activeTab = location.pathname.split("/")[2];

  return (
    <div className={`navigation ${collapsed ? "responsive" : ""}`}>
      <ul>
        {menuItems.map(({ id, title, icon: Icon }) => (
          <li
            key={id}
            className={`list ${activeTab === id ? "active" : ""}`}
            onClick={() => navigate(`/admin/${id}`)}
          >
            <b></b>
            <b></b>

            {/* ⛔ no <a href="#"> */}
            <div
              className={`title flex font-bold ${
                activeTab === id ? "text-[#0B56A4]" : "text-white"
              }`}
            >
              <span className="icon ">
                <Icon size={20} />
              </span>
              <span className="title ">{title}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
