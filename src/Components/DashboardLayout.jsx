import React from "react";
import DashBoard from "../Pages/DashBoard";

import RecentTransactions from "../Components/RecentTransactions";
import Referals from "../Pages/Referals";
import useAuthStore from "../Store/Auth";

const DashboardLayout = () => {
  const { user } = useAuthStore();

  return (
    <>
      <DashBoard welcomeOnly={true} />
      <div className="w-full flex flex-col bg-white dark:bg-gray-900 min-h-screen px-4">
        {/* Main dashboard content */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full mt-4">
          {/* Dashboard section - takes full width on mobile, 2/3 on desktop */}
          <div className="w-full lg:w-2/3">
            <DashBoard />
          </div>

          {/* Recent transactions - stacks below on mobile, side panel on desktop */}
          <div className="w-full lg:w-1/3">
            <RecentTransactions />
          </div>
        </div>

        {/* Conditional group section */}
        <div className="mt-6 mb-8 w-full">
          <Referals />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
