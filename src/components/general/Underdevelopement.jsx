import React from "react";
import underdev from "../../assets/underdev.svg";
import { Clock } from "lucide-react";

const Underdevelopement = ({head}) => {
  return (
      <div className="text-center ">
        <img
          src={underdev}
          alt="Under Development"
          className="w-[50%] mb-4 m-auto"
        />
        <h1 className="text-2xl font-bold text-gray-700">{head} Under Development</h1>
        <p className="text-gray-500 max-w-md mx-auto mt-1">
          We're currently working on this feature to provide you with the best
          experience. Please check back soon.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-1">
        <Clock size={16} />
        <span>Expected to launch soon</span>
      </div>
      </div>
  );
};

export default Underdevelopement;
