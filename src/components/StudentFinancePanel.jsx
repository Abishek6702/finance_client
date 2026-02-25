import React, { useState } from "react";

import IndividualDCB from "./IndividualDCB";
import FeesReceipt from "./FeesReceipt";

export const StudentFinancePanel = ({ student }) => {
  return (
    <div className=" w-full">
      <IndividualDCB student={student} />
    </div>
  );
};
