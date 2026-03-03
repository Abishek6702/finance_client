import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PaymentTable from "../../components/PaymentTable";
import PaymentMFilter from "../../components/PaymentMFilter"; // Adjust path as needed

function Payment() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    year: "Year",
    dept: "Department",
    mode: "Mode",
    feeHead: "Fee Head",
  });
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
      },
    ]);

  const filteredData = useMemo(() => {
    return payments.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roll.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesYear = filters.year === "Year" || item.sub.includes(filters.year);
      const matchesDept = filters.dept === "Department" || item.sub.includes(filters.dept);
      const matchesMode = filters.mode === "Mode" || item.mode === filters.mode;
      const matchesHead = filters.feeHead === "Fee Head" || item.head === filters.feeHead;

      return matchesSearch && matchesYear && matchesDept && matchesMode && matchesHead;
    });
  }, [searchTerm, filters, payments]);

  return (
    <>
    <main className="max-w-400  flex flex-col gap-4">
      {/* Header Section */}
      <div className="text-xl">
        <span className="font-inter font-semibold">
          Recent Payment Details / Academic Year{" "}
          <span className="text-[#0B56A4] font-bold">(2025 - 2026)</span>
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <PaymentMFilter
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0B56A4] text-white rounded-lg font-semibold hover:bg-[#084482] transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          onClick={() => navigate("/admin/payment/newpayment")}
        >
          <Plus className="w-5 h-5" /> New Payment
        </button>
      </div>

      {/* The Table Component receiving filtered data */}
      <PaymentTable data={filteredData} />
    </main>
    </>   
  );
}

export default Payment;