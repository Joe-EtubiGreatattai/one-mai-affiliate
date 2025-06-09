import { create } from "zustand";
import axios from "../Api/axios";
import { toast } from "react-hot-toast";

// useNotificationStore.js
const useNotificationStore = create((set, get) => ({
  notifications: [], // Ensure this is initialized as an array
  loading: false,
  error: null,
  
  sendNotification: async (notificationData) => {
    try {
      const { socket } = get();
      if (socket) {
        socket.emit('sendNotification', notificationData);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },

  fetchNotifications: async (accessToken) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(`api/notification/fetch`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Ensure we always set an array, even if response.data is null/undefined
      set({ notifications: response.data.data || response.data, loading: false });
      return response.data;

    } catch (error) {
      console.error("Error fetching notifications:", error);
      set({ loading: false, error, notifications: [] }); // Reset to empty array on error
      throw error;
    }
  },

  markAsRead: async (notificationId, accessToken) => {
    try {
      const response = await axios.put(
        `api/notification/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update the notification in the local state
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification =>
        notification._id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );
      
      set({ notifications: updatedNotifications });
      return response.data;

    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  markAllAsRead: async (accessToken) => {
    try {
      const response = await axios.put(
        `api/notification/mark-all-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update all notifications in the local state
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true
      }));
      
      set({ notifications: updatedNotifications });
      return response.data;

    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  deleteNotification: async (notificationId, accessToken) => {
    try {
      const response = await axios.delete(
        `api/notification/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Remove the notification from local state
      const { notifications } = get();
      const updatedNotifications = notifications.filter(
        notification => notification._id !== notificationId
      );
      
      set({ notifications: updatedNotifications });
      return response.data;

    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
}));

export default useNotificationStore;