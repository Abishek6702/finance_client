import React from "react";

const NewpaymentStatecard = () => {
  return (
    <div className="w-full ">
      <div className="state grid grid-cols-4 gap-4 border">
        <div className="border">
          <div className="head flex items-center justify-between">
            <p className=" font-semibold">Total Amount</p>
            <p className="bg-[#0b56a4] rounded-xl p-0.5 px-4 text-white">
              2025 - 2026
            </p>
          </div>
          <p className="font-semibold text-xs">₹50,000</p>
          <div className="amount flex items-center justify-between">
            <div className="paid">
                <p>Paid : <span className="text-[#2db26e]">₹25,000</span></p>
            </div>
            <div className="pending">
                <p>Pending : <span className="text-[#e81a46]">₹25,000</span></p>
            </div>
          </div>
        </div>
        <div className="border"></div>

        <div className="border"></div>
        <div className="border"></div>
      </div>
    </div>
  );
};

export default NewpaymentStatecard;
