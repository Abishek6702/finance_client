
import React, { useState } from "react";
import NewpaymentStatecard from "./NewpaymentStatecard.jsx";
import NewPaymentFilter from "./NewPaymentFilter.jsx";
import NewpaymnetTable from "./NewpaymnetTable.jsx";

const Payment = ({ selectedStudent }) => {
    console.log(selectedStudent);
    
    const getCurrentAcademicYear = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0-based (0 = Jan)
      
        if (month >= 5) {
          // June or later
          return `${year}-${year + 1}`;
        } else {
          // Before June
          return `${year - 1}-${year}`;
        }
      };
    const [filters, setFilters] = useState({
        academicYear: getCurrentAcademicYear(),
        semester: "Odd",
      });
  
  return (
    <div className="w-full h-full space-y-4">
      {/* <NewpaymentStatecard selectedStudent={selectedStudent} /> */}

      <NewPaymentFilter filters={filters} setFilters={setFilters} />

      <NewpaymnetTable
        selectedStudent={selectedStudent}
        filters={filters}
      />
    </div>
  );
};

export default Payment;