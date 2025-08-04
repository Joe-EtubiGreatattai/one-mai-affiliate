import React from "react";
import DashBoard from "../Pages/DashBoard";
import RecentTransactions from "../Components/RecentTransactions";
import Referals from "../Pages/Referals";
import ContactSupport from "../Components/ContactSupport";
import LanguageOptions from "../Components/LanguageOptions";
import useAuthStore from "../Store/Auth";

const DashboardLayout = () => {
  const { user } = useAuthStore();

  return (
    <>
      <div className="w-full flex flex-col bg-white dark:bg-gray-900 min-h-screen px-4">
        {/* Welcome section */}
        <div className="mb-6">
          <DashBoard welcomeOnly={true} />
        </div>

        {/* Main dashboard content - Full width */}
        <div className="w-full mb-6">
          <DashBoard />
        </div>

        {/* Referrals and Transactions row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full">
          {/* Referrals section */}
          <div className="w-full lg:w-2/3">
            <Referals />
          </div>

          {/* Recent transactions */}
          <div className="w-full lg:w-1/3">
            <RecentTransactions />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;