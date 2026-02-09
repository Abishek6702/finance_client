import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import NotificationPage from "../pages/NotificationPage.jsx";

const NotificationBell = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        className="w-10 h-10 flex items-center justify-center bg-white rounded-full cursor-pointer "
        onClick={() => setModalOpen(true)}
      >
        <Bell className="cursor-pointer text-gray-600 bg-white" />
      </button>
      <NotificationPage open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default NotificationBell;
