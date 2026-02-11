import React from "react";
import ChartsSection from "../../components/ChartsSection";
import StatCard from "../../components/StatCard";


const Dashboard = () => {
  return (
    <>
      {/* Top Stat Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100  flex overflow-hidden mb-8 ">
        <StatCard
          title="Permanent Employees"
          value="3,540"
          trendValue="5.14"
          isIncrease={true}
        />
        <StatCard
          title="Contract employees"
          value="1,150"
          trendValue="12.2"
          isIncrease={false}
        />
        <StatCard
          title="Freelance Employees"
          value="500"
          trendValue="5.14"
          isIncrease={true}
        />
        <StatCard
          title="Internship/Training"
          value="93"
          trendValue="5.14"
          isIncrease={true}
        />
      </div>
      <ChartsSection />
    </>
  );
};

export default Dashboard;