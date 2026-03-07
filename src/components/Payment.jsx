import React, { useState, useEffect, useCallback, useRef } from "react";
import NewPaymentFilter from "./NewPaymentFilter.jsx";
import NewpaymnetTable from "./NewpaymnetTable.jsx";
import { ApiRequest } from "../utils/ApiRequest";

const Payment = ({ selectedStudent }) => {
  const [filters, setFilters] = useState({
    academicYear: "",
    semester: "Odd",
    feeHead: "All",
  });

  const [transactions, setTransactions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Track initialization per student to prevent infinite loops
  const initializedId = useRef(null);

  const fetchPayments = useCallback(async () => {
    if (!selectedStudent?.id) return;
    
    setLoading(true);
    try {
      const res = await ApiRequest(`/api/studentFeeTracking?rollNo=${selectedStudent.id}`);
      if (!res?.data?.length) return;

      const responseData = res.data[0];
      const { student, feeTracking } = responseData;
      const feeRecords = feeTracking.academicYearWiseRecord || [];

      // 1. Calculate Academic Years
      const startYear = Number(student.academic.batch.split("-")[0]);
      const years = Array.from({ length: 4 }, (_, i) => `${startYear + i}-${startYear + i + 1}`);

      // 2. Process Rows (Existing logic preserved)
      let rows = [];
      feeRecords.forEach((record) => {
        const processSemester = (semData, type) => {
          if (!semData) return;
          const feeHeads = ["tuition", "exam", "erp", "book", "lab"];
          feeHeads.forEach((key) => {
            const data = semData[key];
            if (!data) return;
            rows.push({
              academicYear: record.academicYear,
              semester: type === "odd" ? "Odd" : "Even",
              feeHead: "Academic",
              subHead: key.charAt(0).toUpperCase() + key.slice(1) + " Fee",
              totalAmount: data.subTotal || 0,
              concession: data.concession || 0,
              lastDate: "20-06-2026", // Placeholder
              paid: data.paid || 0,
              pending: (data.total || 0) - (data.paid || 0),
              status: data.status === "Unpaid" ? "Overdue" : data.status,
            });
          });
        };
        processSemester(record.academic.odd, "odd");
        processSemester(record.academic.even, "even");
      });

      setAcademicYearOptions(years);
      setTransactions(rows);

      // 3. Sync Filters ONLY if the student has changed
      if (initializedId.current !== selectedStudent.id) {
        setFilters({
          academicYear: student.academic.currentAcademicYear,
          semester: student.academic.currentSemesterNumber % 2 === 0 ? "Even" : "Odd",
          feeHead: "All",
        });
        initializedId.current = selectedStudent.id;
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedStudent?.id]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="w-full h-full space-y-4">
      <NewPaymentFilter
        filters={filters}
        setFilters={setFilters}
        transactions={transactions}
        academicYearOptions={academicYearOptions}
      />
      {loading ? (
        <div className="p-10 text-center">Loading...</div>
      ) : (
        <NewpaymnetTable
        selectedStudent={selectedStudent}
        transactions={transactions}
        filters={filters}
        onRefresh={fetchPayments}
      />
      )}
    </div>
  );
};

export default Payment;