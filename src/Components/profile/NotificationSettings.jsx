import React from "react";

const NotificationSettings = ({ darkMode }) => {
  return (
    <div className="px-0 py-0 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-center px-4 sm:px-0 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Notification Settings
      </h2>

      <div className="w-full max-w-md sm:max-w-lg mx-auto space-y-0 sm:space-y-6 md:space-y-8">
        {/* === Notification Cards === */}
        {[{
          title: 'Push Notifications',
          options: [
            { label: 'App Announcements', desc: 'Important updates about the app' },
            { label: 'Payment Alerts', desc: 'Instant notifications for payments' },
            { label: 'Group Notifications', desc: 'Updates from your groups' }
          ]
        }, {
          title: 'Notification Preferences',
          options: [
            { label: 'Sound Alerts', desc: 'Play sound for notifications' },
            { label: 'Vibration', desc: 'Vibrate for important notifications', checked: true }
          ]
        }].map((section, i) => (
          <div key={i} className={`p-4 sm:p-6 md:p-8 rounded-none sm:rounded-lg shadow-none sm:shadow-md ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'} sm:border-none`}>
            <h3 className={`font-semibold mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {section.title}
            </h3>

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {section.options.map((opt, j) => (
                <div key={j} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                  <div className="flex-1">
                    <span className={`block font-medium text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {opt.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center self-end sm:self-auto cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      defaultChecked={opt.checked !== false}
                      aria-label={`Toggle ${opt.label}`}
                    />
                    <div className={`w-11 h-6 sm:w-12 sm:h-7 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 sm:after:h-6 sm:after:w-6 after:transition-all ${
                      darkMode 
                        ? 'bg-gray-700 peer-checked:bg-[#3390d5] after:border-gray-600' 
                        : 'bg-gray-200 peer-checked:bg-[#3390d5] after:border-gray-300'
                    }`}></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;