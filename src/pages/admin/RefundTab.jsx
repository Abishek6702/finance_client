import React from "react";
// import RefundFilter from '../../components/RefundFilter'
import StudentRefund from "../../components/StudentRefund";

const RefundTab = () => {
  return (
    <div className="border h-[calc(100vh-180px)] overflow-auto">
      {/* <RefundFilter/> */}
      <StudentRefund />
    </div>
  );
};

export default RefundTab;
