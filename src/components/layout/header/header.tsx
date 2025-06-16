import React, { useState } from "react";
import {  Bell, Settings, User } from "lucide-react";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Sample notifications data
  const notifications = [
    { id: 1, message: "Notification 1" },
    { id: 2, message: "Notification 2" },
    { id: 3, message: "Notification 3" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6">
        <div className="flex items-center justify-between h-16 space-x-10">
          {/* Search bar moved to the right end */}
          <div className="flex-1 flex justify-end">
            <div className="relative">
              
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                title="Notifications"
                onClick={toggleNotifications}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="py-1">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {notification.message}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                title="User Profile"
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <User className="w-5 h-5" />
              </button>
            </div>

            {/* Settings */}
            <button
              title="Settings"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="w-5 h-5" />
              <span className="sr-only">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
