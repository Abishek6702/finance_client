// import React, { useState } from "react";
import PaymentTable from "../../components/PaymentTable";


function Payment() {
  const AcademicYear = "2025 - 2026"; // Updated to match image exactly
  
  return (
    <>
      {/* 2. Main Content Area */}
      <main className="max-w-[1600px]">
        {/* Breadcrumb / Title */}
        <div className="mb-3  text-xl">
          <span className="font-inter font-semibold text-xl mb-4 ">Recent Payment Details / Academic Year {" "}<span className="text-[#0B56A4] font-bold">(2025 - 2026)</span></span>
        </div>
        {/* 3. The Functional Table Component */}
        <PaymentTable />
      </main>
    </>
  );
}

export default Payment;