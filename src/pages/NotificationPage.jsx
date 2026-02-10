import React, { useEffect, useState } from "react";
import { BriefcaseBusiness, Users, Check, X } from "lucide-react";
import nodata from "../assets/nodata.svg"

const NotificationModal = ({ userId, open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30 ">
      <div className="absolute right-28 mt-22.5 w-4 h-4 bg-white rotate-45 shadow-sm "></div>

      <div className="lg:w-[25%] w-[80%] m-auto h-[80vh] mt-24 md:mr-20 rounded-lg shadow-2xl bg-white overflow-hidden animate-fade-in z-10 ">
        <div className="flex items-center justify-between p-4  border-b-2 border-gray-300 w-[90%] m-auto">
          <h2 className="text-xl font-semibold">Notification</h2>
          <button
            onClick={onClose}
            className="text-gray-600 cursor-pointer rounded-full p-1 bg-gray-300"
          >
            <X />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-90 text-center">
  <img src={nodata} alt="No data" className="w-44 mb-4" />
  <p className="text-gray-500 font-medium">No Data Found</p>
</div>

      </div>
    </div>
  );
};

export default NotificationModal;
