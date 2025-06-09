import React, { useState, useEffect, useCallback } from "react";
import {
  FiBell,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiDownload,
  FiFilter,
  FiTrash2,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiUserPlus,
  FiUserMinus,
  FiCheck,
  FiXCircle,
  FiRefreshCw,
  FiArchive,
  FiSettings,
} from "react-icons/fi";
import useAuthStore from "../Store/Auth";
import useNotificationStore from "../Store/getUserNotifications";
import { toast } from "react-hot-toast";
import {
  getNotificationColor,
  getNotificationIcon,
} from "../Components/GetNotificationIcon";
import { format } from "date-fns";
import axios from "../Api/axios";

const NotificationPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const { accessToken, user } = useAuthStore();
  const { notifications, loading, fetchNotifications, markAsRead } =
    useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotificationsWithRetry = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await fetchNotifications(accessToken);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  }, [accessToken, fetchNotifications]);

  // Add this useEffect to fetch notifications on component mount
  useEffect(() => {
    fetchNotificationsWithRetry();
  }, [fetchNotificationsWithRetry]);

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    
    // Mark as read if not already read
    if (!notification.isRead) {
      try {
        await markAsRead(notification._id, accessToken);
        await fetchNotificationsWithRetry();
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
  };

  const handleMemberAction = async (notificationId, action) => {
    const notification = notifications.find((n) => n._id === notificationId);
    if (!notification?.group) return;

    try {
      const endpoint =
        action === "accept"
          ? `/api/group/${notification.group._id}/members`
          : `/api/group/${notification.group._id}/decline-invite`;

      await axios.put(
        endpoint,
        {
          memberId: notification.sender._id,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      toast.success(
        action === "accept"
          ? `Joined ${notification.group.name}`
          : `Declined invitation to ${notification.group.name}`
      );

      await fetchNotificationsWithRetry();
      closeModal(); // Close modal after action
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || `Failed to ${action} invitation`
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(notification => 
          markAsRead(notification._id, accessToken)
        )
      );
      toast.success("All notifications marked as read");
      await fetchNotificationsWithRetry();
    } catch (error) {
      toast.error("Failed to mark notifications as read");
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.abs(now - date) / 36e5;
      
      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInHours < 48) {
        return "Yesterday";
      } else {
        return format(date, "MMM d, yyyy");
      }
    } catch {
      return "Just now";
    }
  };

  const getNotificationTypeLabel = (type) => {
    const typeLabels = {
      payment_reminder: "Payment Due",
      payment_confirmation: "Payment Confirmed",
      group_update: "Group Update",
      member_change: "Group Invitation",
      added_to_group: "Added to Group",
      removed_from_group: "Removed from Group",
      settings_change: "Settings Changed",
      payout_scheduled: "Payout Scheduled",
      other: "Notification"
    };
    return typeLabels[type] || "Notification";
  };

  const renderNotificationActions = (notification, isModal = false) => {
    const actions = {
      member_change: (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => handleMemberAction(notification._id, "accept")}
            className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <FiCheck className="mr-2" size={16} /> Accept Invitation
          </button>
          <button
            onClick={() => handleMemberAction(notification._id, "decline")}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <FiXCircle className="mr-2" size={16} /> Decline
          </button>
        </div>
      ),
      payment_reminder: (
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105">
          <FiDollarSign className="inline mr-2" size={16} />
          Pay Now
        </button>
      ),
    };

    return (!notification.isRead || isModal) && actions[notification.type];
  };

  const NotificationModal = () => {
    if (!selectedNotification) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    selectedNotification.isRead
                      ? "bg-gray-100 text-gray-500"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {getNotificationIcon(selectedNotification.type, {
                    className: "w-6 h-6",
                  })}
                </div>
                <div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    selectedNotification.isRead
                      ? "bg-gray-100 text-gray-600"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {getNotificationTypeLabel(selectedNotification.type)}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedNotification.message}
            </h2>

            {/* Notification Details */}
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <FiClock className="mr-2 w-4 h-4" />
                <span>{formatDate(selectedNotification.createdAt)}</span>
              </div>

              {selectedNotification.group && (
                <div className="flex items-center text-sm text-gray-600">
                  <FiUsers className="mr-2 w-4 h-4" />
                  <span className="font-medium">
                    Group: {selectedNotification.group.name}
                  </span>
                </div>
              )}

              {selectedNotification.sender && (
                <div className="flex items-center text-sm text-gray-600">
                  <FiUserPlus className="mr-2 w-4 h-4" />
                  <span>
                    From: {selectedNotification.sender.firstName} {selectedNotification.sender.lastName}
                  </span>
                </div>
              )}

              {/* Additional notification data */}
              {selectedNotification.data && (
                <div className="bg-gray-50 rounded-xl p-4 mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Additional Details:</h4>
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(selectedNotification.data, null, 2)}
                  </pre>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedNotification.isRead
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}>
                  {selectedNotification.isRead ? "Read" : "Unread"}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            {renderNotificationActions(selectedNotification, true)}
          </div>
        </div>
      </div>
    );
  };

  const LoadingState = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-white border border-gray-100 animate-pulse shadow-sm"
        >
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg">
                <FiBell size={24} />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {unreadCount > 0
                  ? `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`
                  : "You're all caught up! 🎉"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-200 transition-all duration-200"
              >
                <FiCheckCircle className="mr-2" size={16} />
                Mark all read
              </button>
            )}
            
            <button
              onClick={fetchNotificationsWithRetry}
              disabled={isRefreshing}
              className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 shadow-sm"
              aria-label="Refresh notifications"
            >
              <FiRefreshCw
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Stats Cards
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiBell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{notifications.length}</p>
                <p className="text-sm text-blue-600">Total</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FiCheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-900">{notifications.length - unreadCount}</p>
                <p className="text-sm text-emerald-600">Read</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiClock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-900">{unreadCount}</p>
                <p className="text-sm text-orange-600">Unread</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Notifications List */}
      {loading && !isRefreshing ? (
        <LoadingState />
      ) : (
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`group p-6 rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-lg transform hover:-translate-y-1 ${
                  notification.isRead
                    ? "bg-white border border-gray-100 hover:border-gray-200"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md"
                }`}
              >
                <div className="flex gap-4 items-start">
                  <div className="relative">
                    <div
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        notification.isRead
                          ? "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                          : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                      }`}
                    >
                      {getNotificationIcon(notification.type, {
                        className: "w-5 h-5",
                      })}
                    </div>
                    {!notification.isRead && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            notification.isRead
                              ? "bg-gray-100 text-gray-600"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {getNotificationTypeLabel(notification.type)}
                          </span>
                        </div>
                        <h3
                          className={`text-base font-semibold leading-relaxed ${
                            notification.isRead
                              ? "text-gray-700"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.message}
                        </h3>
                      </div>
                      <time className="text-sm text-gray-500 whitespace-nowrap font-medium">
                        {formatDate(notification.createdAt)}
                      </time>
                    </div>

                    {notification.group && (
                      <div className="flex items-center mt-2 mb-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-2 w-fit">
                        <FiUsers className="mr-2 w-4 h-4" />
                        <span className="font-medium">
                          {notification.group.name}
                        </span>
                      </div>
                    )}

                    {renderNotificationActions(notification)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <FiBell className="text-blue-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto px-4 leading-relaxed">
                When you receive notifications about payments, group updates, and other activities, they'll appear here.
              </p>
              <button
                onClick={fetchNotificationsWithRetry}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiRefreshCw className="inline mr-2" size={16} />
                Check for notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notification Modal */}
      {showModal && <NotificationModal />}
    </div>
  );
};

export default NotificationPage;