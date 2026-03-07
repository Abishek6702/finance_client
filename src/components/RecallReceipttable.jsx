import React, { useState, useMemo, useEffect } from "react";
import { RotateCcw, Plus, Search, MoveUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecallFilter from "./RecallFilter.jsx";
import RecallDetail from "./RecallDetail.jsx";
import nodata from "../assets/nodata.svg";
import axios from "axios";

const RecallReceipttable = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const defaultFilters = {
    academicYear: "",
    year: "",
    dept: "",
    fromDate: "",
    toDate: "",
  };

  const [filters, setFilters] = useState(defaultFilters);

  const [payments, setPayments] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecall = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/receiptRecall`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("recall res: ", res.data.data.records);
        const mappedData = res.data.data.records.map((item, index) => ({
          id: item._id,
          name: item.studentInfo.name || `Student ${index + 1}`,
          sem: `Sem ${item.studentInfo.currentSemesterNumber}`,
          year: item.studentInfo.yearStudying,
          departmentName: item.studentInfo.departmentName,
          roll: item.rollNo,
          head: "Fees",
          amount: `₹${item.breakdownSnapshots?.[0]?.total}`,
          receipt: item.receiptNo,
          avatar:
  item.studentInfo.avatar ||
  `https://i.pravatar.cc/150?u=${item.rollNo}`,
          raisedOn: item.createdAt?.split("T")[0],
          Reasonforrecall: item.reason,
          mode: item.paymentType,
          bank: item.bankName,
          academicYear: item.studentInfo.currentAcademicYear,
          section: item.studentInfo.section || "A",
        }));

        setPayments(mappedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecall();
  }, []);

  const filteredData = useMemo(() => {
    return payments.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roll.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesYear =
        !filters.year || String(item.year) === String(filters.year);

      const matchesDept = !filters.dept || item.departmentName === filters.dept;

      const matchesAcademicYear =
        !filters.academicYear || item.academicYear === filters.academicYear;

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
        matchesDate &&
        matchesAcademicYear
      );
    });
  }, [searchTerm, filters, payments]);

  const RecallOpen = (item) => {
    setIsModalOpen(true);
    setSelectedPayment(item);
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
            <table className=" w-full">
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
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-3 text-center font-semibold whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}

                  <th className=" bg-[#F0F0F0] p-3 font-semibold text-right z-40 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.1)]"></th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3 sticky left-0 bg-white z-20 ">
                      <div className="flex items-center gap-3 ">
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
                            {item.year} Year / {item.departmentName} - {item.section}
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

                    <td className=" p-3">
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
