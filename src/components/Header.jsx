import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FileBarChart, 
  RotateCcw, 
  Bell 
} from 'lucide-react';
import { FaFileAlt } from "react-icons/fa";

import { TbLayoutDashboardFilled } from "react-icons/tb";
import { RiMoneyRupeeCircleFill  } from "react-icons/ri";
import { IoMdSettings  } from "react-icons/io";
import { FaFileArrowDown } from "react-icons/fa6";



import Logo from '../assets/Logo.jpeg';   
const Header = () => {
  return (
    <div className="w-full px-4 py-3">
      <nav className="bg-[#1e293b] font-['Lato'] rounded-2xl h-16 flex items-center justify-between px-6 shadow-lg">
         <div className="flex items-center">
          <div className="">
            <img src={Logo} alt="Sri Eshwar" className="w-8 h-8 object-" />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <NavLink icon={<TbLayoutDashboardFilled className='text-white ' size={18} />} label="Dashboard" />
          
         <NavLink 
            icon={<RiMoneyRupeeCircleFill className='' />} 
            label="Payment" 
            isActive={true} 
          />
          
          <NavLink icon={<FaFileAlt className='text-white'/>} className="text-white" label="fees Details" />
          <NavLink icon={<IoMdSettings  className='text-white'/>} label="Manage Fee demands" />
          <NavLink icon={<FaFileArrowDown  className='text-white' size={18} />} label="Reports" />
          <NavLink icon={<RotateCcw className='text-white' size={18} />} label="Recall Receipts" />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
            <div className="bg-white p-2 rounded-full">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full"></span>
            </div>
          </div>

          <div className="cursor-pointer hover:ring-2 ring-blue-400 rounded-full transition-all">
            <img 
              src="https://i.pravatar.cc/150?u=user" 
              alt="User profile" 
              className="w-10 h-10 rounded-full border border-gray-400"
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

const NavLink = ({ icon, label, isActive = false }) => {
  return (
    <div className={`
      flex items-center space-x-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-200
      ${isActive 
        ? 'bg-white text-gray-800 font-semibold' 
        : 'text-gray-300 hover:text-white hover:bg-white/10'}
    `}>
      <span className={isActive ? 'text-gray-800' : 'text-gray-400'}>
        {icon}
      </span>
      <span className="text-sm whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};

export default Header;