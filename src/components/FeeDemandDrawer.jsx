import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Dayscholar from "../assets/dayscholar.svg";
import Hostel from "../assets/hostel.svg";
import Transport from "../assets/transport1.svg";
import CustomSelect from "./CustomSelect";
import RequireHostelFlow from "./feedemand/RequireHostelFlow";
import TransportWithdrawalFlow from "./feedemand/Transportwithdrawalflow ";
import RouteChangeFlow from "./feedemand/RouteChangeFlow";
import RequiresHostelFlow from "./feedemand/RequiresHostelFlow";
import RequiresTransportFlow from "./feedemand/RequiresTransportFlow";
import RequireTransportFlow from "./feedemand/RequireTransportFlow";
import HostelWithdrawalFlow from "./feedemand/HostelWithdrawalFlow";
import RoomChangeFlow from "./feedemand/RoomChangeFlow";

const FeeDemandDrawer = ({ student, isOpen, onClose }) => {
  console.log("drawer student", student);

  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(""); // reset to placeholder
    }
  }, [isOpen]);

  const getStudentImages = (student) => {
    console.log("fee demand image", student);

    // Highest priority
    if (student.ishostler) {
      return [Hostel];
    }

    // Transport overrides dayscholar
    if (student.iscollegetransport) {
      return [Transport];
    }

    // Only dayscholar
    if (student.isdayscholer) {
      return [Dayscholar];
    }

    return [];
  };

  const getStatusOptions = (student) => {
    if (student?.iscollegetransport) {
      return ["Require Hostel", "Transport Withdrawal", "Route Change"];
    }

    if (student?.ishostler) {
      return ["Require Transport", "Hostel Withdrawal", "Room Change"];
    }

    if (student?.isdayscholer) {
      return ["Requires Hostel", "Requires Transport"];
    }

    return [];
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Full Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-[calc(100vh-17px)] w-[40%] m-2 rounded-xl bg-white shadow-xl  overflow-y-auto  }`}
      >
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-700">
              Change Status
            </h2>
            <div className="flex justify-center gap-2">
              {getStudentImages(student).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="w-6 h-6"
                  alt="student type"
                />
              ))}
            </div>
          </div>
          <div
            className="bg-gray-100 rounded-full cursor-pointer p-1 hover:bg-gray-200"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        <div className=" px-6 py-4">
          {/* Student Info */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img
                src={student?.profileImage}
                className="w-11 h-11 rounded-full object-cover"
                alt="Profile"
              />
              <div>
                <p className="font-semibold text-gray-800 text-lg ">
                  {student?.name}
                </p>
                <p className="text-md text-gray-500">
                  {student?.year} / {student?.department} - {student?.section}
                </p>
              </div>
            </div>
            <p className="text-gray-900 font-semibold text-md ">
              {student?.rollNo}
            </p>
          </div>
        </div>

        <div className=" px-6 ">
          <div className="status">
            <label
              htmlFor="status-select"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Change Status
            </label>
            <CustomSelect
              options={getStatusOptions(student)}
              placeholder="Select option"
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              className="w-full"
            />
          </div>

          {selectedStatus === "Require Hostel" && (
            <RequireHostelFlow student={student} onClose={onClose} />
          )}

          {selectedStatus === "Transport Withdrawal" && (
            <TransportWithdrawalFlow student={student} onClose={onClose} />
          )}
          {selectedStatus === "Route Change" && (
            <RouteChangeFlow student={student} onClose={onClose} />
          )}
          {selectedStatus === "Requires Hostel" && (
            <RequiresHostelFlow student={student} onClose={onClose} />
          )}
          {selectedStatus === "Requires Transport" && (
            <RequiresTransportFlow student={student} onClose={onClose} />
          )}

{selectedStatus === "Require Transport" && (
            <RequireTransportFlow student={student} onClose={onClose} />
          )}
          {selectedStatus === "Hostel Withdrawal" && (
            <HostelWithdrawalFlow student={student} onClose={onClose} />
          )}
          {selectedStatus === "Room Change" && (
            <RoomChangeFlow student={student} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeDemandDrawer;
