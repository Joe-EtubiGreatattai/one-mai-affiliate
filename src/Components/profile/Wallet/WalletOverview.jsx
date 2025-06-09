import React from "react";
import {
  FiEye,
  FiEyeOff,
  FiArrowDown,
  FiArrowUp,
  FiPlus,
  FiCreditCard,
  FiTrendingUp,
  FiRefreshCw,
} from "react-icons/fi";

const WalletOverview = ({
  darkMode,
  balance,
  balanceVisible,
  setBalanceVisible,
  formatCurrency,
  setActiveTab,
  transactions,
  getTransactions,
  cards,
  setShowCardModal,
}) => {
  return (
    <div className="space-y-4 md:space-y-8 -mx-8 md:mx-0">
      {/* Premium Bank Card */}
      <div className="relative">
        <div
          className={`relative p-4 md:p-8 md:rounded-2xl overflow-hidden ${
            darkMode
              ? "bg-slate-900 md:bg-gradient-to-br md:from-slate-800 md:via-slate-900 md:to-black"
              : "bg-blue-700 md:bg-gradient-to-br md:from-blue-600 md:via-indigo-700 md:to-purple-800"
          } shadow-xl md:shadow-2xl`}
        >
          {/* Card Background Pattern - Only on desktop */}
          <div className="absolute inset-0 opacity-10 hidden md:block">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20 blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white/10 blur-lg"></div>
          </div>
          
          {/* Card Content */}
          <div className="relative z-10">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4 md:mb-8">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FiCreditCard className="h-4 w-4 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs md:text-sm font-medium">Digital Wallet</p>
                  <p className="text-white text-sm md:text-lg font-bold">Premium Account</p>
                </div>
              </div>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={balanceVisible ? "Hide balance" : "Show balance"}
              >
                {balanceVisible ? (
                  <FiEyeOff className="h-4 w-4 md:h-5 md:w-5 text-white" />
                ) : (
                  <FiEye className="h-4 w-4 md:h-5 md:w-5 text-white" />
                )}
              </button>
            </div>

            {/* Balance Display */}
            <div className="mb-6 md:mb-8">
              <p className="text-white/70 text-xs md:text-base mb-1 md:mb-2">Available Balance</p>
              <p className="text-white text-2xl md:text-5xl font-bold tracking-tight">
                {balanceVisible ? formatCurrency(balance) : "••••••"}
              </p>
            </div>

            {/* Card Number Style Decoration */}
            <div className="flex justify-between items-end">
              <div className="flex space-x-1 md:space-x-2">
                <div className="w-6 h-4 md:w-8 md:h-6 rounded bg-white/20"></div>
                <div className="w-6 h-4 md:w-8 md:h-6 rounded bg-white/30"></div>
              </div>
              <div className="flex space-x-1 md:space-x-2">
                <div className="w-6 h-4 md:w-8 md:h-6 rounded bg-white/20"></div>
                <div className="w-6 h-4 md:w-8 md:h-6 rounded bg-white/30"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 md:mt-6 px-4 md:px-0">
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`group relative w-full py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
              darkMode
                ? "bg-slate-800 md:bg-gradient-to-r md:from-slate-800 md:to-slate-700 hover:bg-slate-700 md:hover:from-slate-700 md:hover:to-slate-600 text-white shadow-lg"
                : "bg-white md:bg-gradient-to-r md:from-white md:to-gray-50 hover:bg-gray-50 md:hover:from-gray-50 md:hover:to-gray-100 text-gray-800 shadow-lg border border-gray-200"
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl ${darkMode ? "bg-blue-600" : "bg-blue-100"}`}>
                <FiArrowUp className={`h-4 w-4 md:h-5 md:w-5 ${darkMode ? "text-white" : "text-blue-600"}`} />
              </div>
              <div className="text-center md:text-left">
                <p className="font-semibold text-base md:text-lg">Request Payout</p>
                <p className={`text-xs md:text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Withdraw your funds
                </p>
              </div>
            </div>
            <div className={`absolute inset-0 rounded-xl md:rounded-2xl ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all duration-300`}></div>
          </button>
        </div>
      </div>

      {/* Enhanced Transactions Card */}
      <div
        className={`p-4 md:p-8 md:rounded-2xl shadow-lg md:shadow-xl border-0 md:border ${
          darkMode 
            ? "bg-slate-800 md:bg-slate-800/50 md:backdrop-blur-sm md:border-slate-700" 
            : "bg-white md:bg-white/80 md:backdrop-blur-sm md:border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl ${darkMode ? "bg-emerald-900/50" : "bg-emerald-100"}`}>
              <FiTrendingUp className={`h-4 w-4 md:h-5 md:w-5 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`} />
            </div>
            <h3
              className={`text-lg md:text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Recent Activity
            </h3>
          </div>
          <button
            className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm transition-all duration-200 ${
              darkMode
                ? "bg-slate-700 hover:bg-slate-600 text-blue-400"
                : "bg-blue-50 hover:bg-blue-100 text-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onClick={() => getTransactions()}
          >
            <FiRefreshCw className="h-3 w-3 md:h-4 md:w-4" />
            <span className="font-medium">Refresh</span>
          </button>
        </div>

        {transactions.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {transactions.slice(0, 5).map((tx, index) => (
              <div
                key={tx.id}
                className={`group p-3 md:p-5 rounded-lg md:rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.01] ${
                  darkMode
                    ? "bg-slate-700/50 hover:bg-slate-700 border border-slate-600"
                    : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                } hover:shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div
                      className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        tx.type === "deposit"
                          ? darkMode
                            ? "bg-emerald-900/50 text-emerald-400 group-hover:bg-emerald-900"
                            : "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200"
                          : darkMode
                          ? "bg-red-900/50 text-red-400 group-hover:bg-red-900"
                          : "bg-red-100 text-red-600 group-hover:bg-red-200"
                      }`}
                    >
                      {tx.type === "deposit" ? (
                        <FiArrowDown className="h-3 w-3 md:h-5 md:w-5" />
                      ) : (
                        <FiArrowUp className="h-3 w-3 md:h-5 md:w-5" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm md:text-lg font-semibold ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {tx.description ||
                          tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </p>
                      <div className="flex items-center space-x-2 mt-0.5 md:mt-1">
                        <p
                          className={`text-xs md:text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                        <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>•</span>
                        <span
                          className={`text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full font-medium ${
                            tx.status === 'completed'
                              ? darkMode
                                ? "bg-emerald-900/50 text-emerald-400"
                                : "bg-emerald-100 text-emerald-700"
                              : tx.status === 'pending'
                              ? darkMode
                                ? "bg-yellow-900/50 text-yellow-400"
                                : "bg-yellow-100 text-yellow-700"
                              : darkMode
                              ? "bg-red-900/50 text-red-400"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm md:text-xl font-bold ${
                        tx.type === "deposit"
                          ? darkMode
                            ? "text-emerald-400"
                            : "text-emerald-600"
                          : darkMode
                          ? "text-red-400"
                          : "text-red-600"
                      }`}
                    >
                      {tx.type === "deposit" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl mx-auto mb-3 md:mb-4 flex items-center justify-center ${
              darkMode ? "bg-slate-700" : "bg-gray-100"
            }`}>
              <FiTrendingUp className={`h-6 w-6 md:h-8 md:w-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            </div>
            <p
              className={`text-base md:text-lg font-medium ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No transactions yet
            </p>
            <p
              className={`text-xs md:text-sm mt-1 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Your transaction history will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletOverview;