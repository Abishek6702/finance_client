import React from 'react'
import RecallReceipttable from "../../components/RecallReceipttable"

const Recall_Receipts = () => {
  const AcademicYear = "2025 - 2026"; // Updated to match image exactly
  
  return (
    <>
      {/* 2. Main Content Area */}
      <main className="max-w-400">
        {/* Breadcrumb / Title */}
        <div className="mb-3  text-xl">
          <span className="font-inter font-semibold text-xl mb-4 ">Recall Receipt Details {" "}<span className="text-[#0B56A4] font-bold">(2025 - 2026)</span></span>
        </div>
        {/* 3. The Functional Table Component */}
        <RecallReceipttable />
      </main>
    </>
  )
}

export default Recall_Receipts
