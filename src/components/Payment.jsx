import React, { useState } from "react";
import NewpaymentStatecard from "./NewpaymentStatecard.jsx";
import NewPaymentFilter from "./NewPaymentFilter.jsx";
import NewpaymnetTable from "./NewpaymnetTable.jsx";
import { feeData } from "../data.js";

const Payment = ({ selectedStudent }) => {
  console.log(selectedStudent);

  const getCurrentAcademicYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
  
    return month >= 5
      ? `${year}-${year + 1}`
      : `${year - 1}-${year}`;
  };
  
  const defaultFilters = {
    academicYear: getCurrentAcademicYear(),
    semester: "Odd",
    feeHead: "All",
  };
  
  const [filters, setFilters] = useState(defaultFilters);
  return (
    <div className="w-full h-full space-y-4 ">
      {/* <NewpaymentStatecard selectedStudent={selectedStudent} /> */}
      <NewPaymentFilter
  filters={filters}
  setFilters={setFilters}
  feeData={feeData}
  defaultFilters={defaultFilters}
/>

      <NewpaymnetTable selectedStudent={selectedStudent} filters={filters} />
    </div>
  );
};

export default Payment;
