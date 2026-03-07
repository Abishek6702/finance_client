import React, { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PaymentTable from "../../components/PaymentTable";
import PaymentMFilter from "../../components/PaymentMFilter";
import { ApiRequest } from "../../utils/ApiRequest";

function Payment() {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    year: "Year",
    dept: "Department",
    mode: "Mode",
    feeHead: "Fee Head",
  });

  const [payments, setPayments] = useState([]);

  const yearLabel = (year) => {
    const map = {
      1: "1st Year",
      2: "2nd Year",
      3: "3rd Year",
      4: "4th Year",
    };
    return map[year] || year;
  };

  useEffect(() => {

    const fetchPaymentData = async () => {

      const response = await ApiRequest("/api/feePayment");
      const responseData = response.data;
      const formattedData = responseData.transactions.flatMap((item) => {

        const student = item.student;
        const transaction = item.transaction;
        const breakdown = transaction.breakdowns?.[0] || {};

        const semester = breakdown.academic?.semesterNumber || 1;

        const semPeriod = semester % 2 === 0 ? "Even" : "Odd";

        const year = student.academic.yearStudying;

        const base = {
          id: transaction._id,
          receipt: transaction.receiptNo,

          roll: student.personal.rollNo,
          name: student.personal.studentName,
          avatar: student.personal.studentPhoto,

          dept: student.academic.departmentName,
          year: year,

          sub: `${yearLabel(year)} / ${student.academic.departmentName}`,

          semPeriod,

          mode: transaction.paymentType,
          bank: transaction.bankName,

          date: transaction.paidOn,

          billingDate: transaction.billingDate,
          paidOn: transaction.paidOn,

          academicYear: breakdown.academicYear,
          remarks: transaction.remarks,

          isrecallrequested: false
        };

        const feeHeads = [
          { type: "Tution Fees", amount: breakdown.academic?.tuition },
          { type: "Exam Fees", amount: breakdown.academic?.exam },
          { type: "Software Fees", amount: breakdown.academic?.erp },
          { type: "Book Fees", amount: breakdown.academic?.book },
          { type: "Lab Fees", amount: breakdown.academic?.lab },
          { type: "Hostel Fees", amount: breakdown.hostel },
          { type: "Transport Fees", amount: breakdown.transport },
        ];

        return feeHeads
          .filter((f) => f.amount && f.amount > 0)
          .map((f) => ({
            ...base,
            head: f.type,
            amount: f.amount,
          }));
      });

      setPayments(formattedData);

    };

    fetchPaymentData();

  }, []);


  const filteredData = useMemo(() => {

    return payments.filter((item) => {

      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roll.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesYear =
        filters.year === "Year" ||
        yearLabel(item.year) === filters.year;

      const matchesDept =
        filters.dept === "Department" ||
        item.dept === filters.dept;

      const matchesMode =
        filters.mode === "Mode" ||
        item.mode === filters.mode;

      const matchesHead =
        filters.feeHead === "Fee Head" ||
        item.head === filters.feeHead;

      return (
        matchesSearch &&
        matchesYear &&
        matchesDept &&
        matchesMode &&
        matchesHead
      );

    });

  }, [searchTerm, filters, payments]);


  return (
    <main className="max-w-400 flex flex-col gap-4">

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

      <PaymentTable data={filteredData} />

    </main>
  );
}

export default Payment;