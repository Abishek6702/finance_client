import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PaymentTable from "../../components/PaymentTable";
import PaymentMFilter from "../../components/PaymentMFilter";
import { ApiRequest } from "../../utils/ApiRequest";

function Payment() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [payments, setPayments] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    year: "Year",
    dept: "Department",
    mode: "Mode",
    feeHead: "Fee Head",
  });

  const getYearNumber = (year) => {
    if (!year || year === "Year") return null;
    const match = year.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  };

  const fetchPaymentData = useCallback(async (filterParams = {}, pageNo = 1) => {
    try {
      if (pageNo === 1) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams();

      params.append("page", pageNo);
      params.append("limit", 10);

      if (filterParams.dept !== "Department")
        params.append("department", filterParams.dept);

      if (filterParams.mode !== "Mode")
        params.append("paymentMode", filterParams.mode);

      if (filterParams.feeHead !== "Fee Head") {
        const head = filterParams.feeHead.split(" ")[0].toLowerCase();
        params.append("feeHead", head);
      }

      const year = getYearNumber(filterParams.year);
      if (year) params.append("yearStudying", year);

      const url = `/api/feePayment/recent?${params.toString()}`;

      const res = await ApiRequest(url);

      const transactions = res?.data?.transactions || [];
      const pagination = res?.data?.pagination;

      const formatted = transactions.map((item) => ({
        id: item.breakdownId,
        breakdownId: item.breakdownId,
        transactionId: item.transactionId,
        receipt: item.receiptNo,
        roll: item.rollNo,
        name: item.studentName,
        dept: item.department,
        year: item.year,
        semPeriod: item.semester,
        head: item.feeHead,
        amount: item.amount,
        mode: item.paymentMode,
        bank: item.bank !== "N/A" ? item.bank : "-",
        date: item.paidOn,
        avatar: item.photo,
        section: item.section,
        isrecallrequested: false,
      }));

      if (pageNo === 1) {
        setPayments(formatted);
      } else {
        setPayments((prev) => [...prev, ...formatted]);
      }

      setHasMore(pageNo < pagination.totalPages);

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setPayments([]);
    fetchPaymentData(filters, 1);
  }, [filters]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;

    const nextPage = page + 1;
    setPage(nextPage);

    fetchPaymentData(filters, nextPage);
  };

  const filteredData = payments.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      item.name?.toLowerCase().includes(search) ||
      item.roll?.toLowerCase().includes(search) ||
      item.receipt?.toLowerCase().includes(search)
    );
  });

  return (
    <main className="max-w-full h-[calc(100vh-100px)] flex flex-col gap-4 p-4">

      <div className="flex justify-between items-center">
        <span className="text-xl font-semibold">
          Recent Payment Details /
          <span className="text-[#0B56A4]"> 2025 - 2026</span>
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
          className="flex items-center gap-2 px-4 py-2 bg-[#0B56A4] text-white rounded-lg hover:bg-[#084482]"
          onClick={() => navigate("/admin/payment/newpayment")}
        >
          <Plus size={20} /> New Payment
        </button>

      </div>

      <div className="flex-1 min-h-0">

        <PaymentTable
          data={filteredData}
          loading={loading}
          loadingMore={loadingMore}
          loadMore={loadMore}
        />

      </div>

    </main>
  );
}

export default Payment;