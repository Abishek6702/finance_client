
import React from "react";

import CardComponent from "../../components/dashboard/CardComponent.jsx";
import DepartmentPaid from "../../components/dashboard/DepartmentPaid.jsx";
import DepartmentCount from "../../components/dashboard/DepartmentCount.jsx";
import Timingpaid from "../../components/dashboard/Timingpaid.jsx";

const SuperDashboard = () => {
  return (
    <>
      <div className="flex flex-col  items-center h-[calc(100vh-120px)] space-y-4">
        <div className="flex justify-center gap-4 w-full h-auto">
          <div className="card-container border border-gray-200  w-[60%] bg-[#fafbfc] rounded-xl">
            <CardComponent />
          </div>
          <div className="card-container border border-gray-200  w-[40%] bg-[#fafbfc] rounded-xl">
            <DepartmentCount />
          </div>
        </div>
        <div className="departmnt-paid w-full border border-gray-200 rounded-xl h-auto">
          <DepartmentPaid />
        </div>
        {/* <div className="departmnt-paid w-full border border-gray-200 rounded-xl h-auto">
          <Timingpaid />
        </div> */}
      </div>
    </>
  );
};

export default SuperDashboard;
