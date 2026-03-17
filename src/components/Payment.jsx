import React, { useState, useEffect, useCallback, useRef } from "react";
import NewPaymentFilter from "./NewPaymentFilter.jsx";
import NewpaymnetTable from "./NewpaymnetTable.jsx";
import { ApiRequest } from "../utils/ApiRequest";

const Payment = ({ selectedStudent }) => {
  const [filters, setFilters] = useState({
    academicYear: "",
    semester: "",
    feeHead: "",
  });

  console.log("Selected Student in Payment Component:", selectedStudent);
  const [transactions, setTransactions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentAcademicYear, setCurrentAcademicYear] = useState("");

  // Track initialization per student to prevent infinite loops
  const initializedId = useRef(null);


  const fetchPayments = useCallback(async () => {
    if (!selectedStudent?.id) return;

    setLoading(true);
    try {
      const res = await ApiRequest(
        `/api/studentFeeTracking?rollNo=${selectedStudent.id}`,
      );
      if (!res?.data?.length) return;

      const responseData = res.data[0];
      console.log("API Response for Fee Tracking:", responseData);
      const { student, feeTracking } = responseData;
      const feeRecords = feeTracking.academicYearWiseRecord || [];

      // 1. Generate the 4-year span based on batch (e.g., 2023-2027)
      const startYear = Number(student.academic.batch.split("-")[0]);
      const academicYearsList = Array.from(
        { length: 4 },
        (_, i) => `${startYear + i}-${startYear + i + 1}`,
      );

      // 2. Process Rows with correct Semester Numbers (1-8)
      let rows = [];
      feeRecords.forEach((record) => {
        // Find where this record fits in the 4-year cycle (Index 0 to 3)
        const yearIndex = academicYearsList.indexOf(record.academicYear);
        if (yearIndex === -1) return;

        const processSemester = (semData, type) => {
          if (!semData) return;

          // Calculation: (YearIndex * 2) + 1 for Odd, + 2 for Even
          // Year 0: Odd=1, Even=2 | Year 1: Odd=3, Even=4...
          const semNumber = yearIndex * 2 + (type === "odd" ? 1 : 2);

          const feeHeads = ["tuition", "exam", "erp", "book", "lab"];
          feeHeads.forEach((key) => {
            const data = semData[key];
            if (!data || data.subTotal === 0) return;
            rows.push({
              academicYear: record.academicYear,
              semesterType: type === "odd" ? "Odd" : "Even", // For UI Filter
              semesterNumber: semNumber, // FOR BACKEND API
              feeHead: "Academic",
              subHead: key.charAt(0).toUpperCase() + key.slice(1),
              totalAmount: data.subTotal || 0,
              concession: data.concession || 0,
              lastDate: data.dueDate || "20-06-2026",
              paid: data.paid || 0,
              pending: (data.total || 0) - (data.paid || 0),
              status: data.status,
              rawKey: key, // e.g., 'tuition'
            });
          });
        };

        processSemester(record.academic.odd, "odd");
        processSemester(record.academic.even, "even");
      });

      setAcademicYearOptions(academicYearsList);
      setTransactions(rows);
      setCurrentAcademicYear(student.academic.currentAcademicYear);

      // set default filters once
      if (initializedId.current !== selectedStudent.id) {
        setFilters({
          academicYear: student.academic.currentAcademicYear,
          semester: "",
          feeHead: "",
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

  const handleClear = () => {
  setFilters({
    academicYear: currentAcademicYear,
    semester: "",
    feeHead: "",
  });
};

  return (
    <div className="w-full h-full flex flex-col space-y-4 pb-2">
      <NewPaymentFilter
        filters={filters}
        setFilters={setFilters}
        transactions={transactions}
        academicYearOptions={academicYearOptions}
        onClear={handleClear}
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
