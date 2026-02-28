import React, { useState, useMemo } from "react";
import { RotateCcw, Plus, Search, MoveUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecallFilter from "./RecallFilter.jsx";
import RecallDetail from "./RecallDetail.jsx";
import nodata from "../assets/nodata.svg";

const RecallReceipttable = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const defaultFilters = {
    academicYear: "",
    year: "",
    dept: "",
    status: "",
    fromDate: "",
    toDate: "",
  };

  const [filters, setFilters] = useState(defaultFilters);

  const [payments] = useState([
    {
      id: 1,
      name: "Aarav Sharma",
      sub: "1st Year / CSE",
      roll: "21CS001",
      semPeriod: "Even Sem",
      head: "Exam Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "Cash",
      bank: "Cash",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=1",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Status: "Approved",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Rejectreason:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",

    },
    {
      id: 2,
      name: "Surya Chandran",
      sub: "1st Year / IT",
      roll: "21ECE011",
      semPeriod: "Odd Sem",
      head: "Software Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "UPI",
      bank: "ICICI",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=2",
      isrecallrequested: true,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Pending",
      Rejectreason:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",

    },
    {
      id: 3,
      name: "Surya Chandran",
      sub: "2nd Year / ECE",
      roll: "21IT009",
      semPeriod: "Even Sem",
      head: "Software Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "UPI",
      bank: "CUB",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=3",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Rejected",
      Rejectreason:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",

    },
    {
      id: 4,
      name: "Surya Chandran",
      sub: "3rd Year / EEE",
      roll: "21CS011",
      semPeriod: "Odd Sem",
      head: "Exam Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "DD",
      bank: "IOB",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=4",
      isrecallrequested: true,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Pending",
      Rejectreason:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",

    },
    {
      id: 5,
      name: "Surya Chandran",
      sub: "4th Year / MECH",
      roll: "21MEC061",
      semPeriod: "Odd Sem",
      head: "Tution Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "NEFT",
      bank: "ICICI",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=5",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Pending",
      Rejectreason:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",

    },
    {
      id: 6,
      name: "Surya Chandran",
      sub: "2nd Year / ECE",
      roll: "21IT009",
      semPeriod: "Even Sem",
      head: "Software Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "UPI",
      bank: "CUB",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=3",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Approved",
      Rejectreason:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
    },
    {
      id: 7,
      name: "Surya Chandran",
      sub: "3rd Year / EEE",
      roll: "21CS011",
      semPeriod: "Odd Sem",
      head: "Exam Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "DD",
      bank: "IOB",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=4",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Rejected",
      Rejectreason:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
    },
    {
      id: 8,
      name: "Surya Chandran",
      sub: "4th Year / MECH",
      roll: "21MEC061",
      semPeriod: "Odd Sem",
      head: "Tution Fees",
      amount: "₹4000",
      date: "10/12/2026",
      mode: "NEFT",
      bank: "ICICI",
      receipt: "10123255",
      avatar: "https://i.pravatar.cc/150?u=5",
      isrecallrequested: false,
      raisedOn: "2026-02-10",
      Reasonforrecall:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      ApprovedOn: "2026-02-15",
      RejectedOn: "2026-02-15",
      Status: "Pending",
      Rejectreason:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout",
    },
  ]);

  const filteredData = useMemo(() => {
    return payments.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roll.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesYear = !filters.year || item.sub.includes(filters.year);

      const matchesDept = !filters.dept || item.sub.includes(filters.dept);

      const matchesStatus = !filters.status || item.Status === filters.status;
      const matchesDate = (() => {
        if (!filters.fromDate && !filters.toDate) return true;

        const itemDate = new Date(item.raisedOn);

        if (filters.fromDate && itemDate < new Date(filters.fromDate))
          return false;

        if (filters.toDate && itemDate > new Date(filters.toDate)) return false;

        return true;
      })();
      return (
        matchesSearch &&
        matchesYear &&
        matchesDept &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [searchTerm, filters, payments]);

  const RecallOpen = (item) => {
    setIsModalOpen(true);
    setSelectedPayment(item);
  };

  const getStatusStyles = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";

    const normalized = status.toLowerCase();

    if (normalized === "approved") return "bg-[#F3FCF7] text-[#44CF7D]";

    if (normalized === "rejected") return "bg-[#FCEAEE] text-[#ED6C83]";

    if (normalized === "pending") return "bg-[#FFF6EA] text-[#FFA02D]";

    return "bg-gray-100 text-gray-600";
  };
  return (
    <div className="flex flex-col gap-5">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4">
        <RecallFilter
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* Table Wrapper */}
      <div className="w-full bg-white rounded-2xl shadow  ">
        {/* Horizontal Scroll */}
        <div className="overflow-x-auto ">
          {/* Vertical Scroll */}
          <div className="max-h-[calc(100vh-230px)] overflow-y-auto custom-scrollbar relative  rounded-xl">
            <table className="border-collapse w-full table-fixed">
              <colgroup>
                <col className="w-45" />
                <col className="w-30" />
                <col className="w-30" />
                <col className="w-40" />
                <col className="w-30" />
                <col className="w-30" />
                <col className="w-40" />
                <col className="w-30" />
                <col className="w-45" />
                <col className="w-20" />
              </colgroup>
              <thead className="sticky top-0 z-30 bg-[#F0F0F0]">
                <tr>
                  <th className="p-3 text-center font-semibold sticky left-0 bg-[#F0F0F0] z-40">
                    Student Details
                  </th>

                  {[
                    "Roll Number",
                    "Fee Head",
                    "Amount",
                    "Raised On",
                    "Payment Mode",
                    "Bank",
                    "Receipt Number",
                    "Status",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-3 text-center font-semibold whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}

                  <th className="sticky right-0 bg-[#F0F0F0] p-3 font-semibold text-right z-40 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.1)]"></th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3 sticky left-0 bg-white z-20">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          alt=""
                        />
                        <div>
                          <div className="font-medium whitespace-nowrap">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.sub}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-center">{item.roll}</td>
                    <td className="p-3 text-center">{item.head}</td>
                    <td className="p-3 text-center">{item.amount}</td>
                    <td className="p-3 text-center">{item.raisedOn}</td>
                    <td className="p-3 text-center">{item.mode}</td>
                    <td className="p-3 text-center">{item.bank}</td>
                    <td className="p-3 text-center">{item.receipt}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-md text-sm font-medium ${getStatusStyles(
                          item.Status,
                        )}`}
                      >
                        {item.Status}
                      </span>
                    </td>

                    <td className="sticky right-0 bg-white p-3 text-right z-20 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.1)]">
                      <button
                        onClick={() => RecallOpen(item)}
                        className={`p-2 rounded-full transition-all ${"bg-[#0B56A4] text-white hover:bg-[#084482] cursor-pointer"}`}
                      >
                        <MoveUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                 <img src={nodata} alt="No data" className="w-50 " />
                <p className="text-gray-500">No results found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <>
          <RecallDetail
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            payment={selectedPayment}
          />
        </>
      )}
    </div>
  );
};

export default RecallReceipttable;
