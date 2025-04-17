import { useState } from 'react';
import { Bell, BellOff, Settings, AlertTriangle, ArrowLeft, Check, X } from 'lucide-react';

type NotificationType = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

export default function NotificationSettings() {
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([
    {
      id: 'predictive-alerts',
      name: 'Predictive Alerts',
      description: 'Get notified about potential issues before they occur',
      enabled: true
    },
    {
      id: 'smart-alerts',
      name: 'Smart Alerts',
      description: 'Personalized notifications based on your activity patterns',
      enabled: false
    },
    {
      id: 'system-updates',
      name: 'System Updates',
      description: 'Important updates about the platform and new features',
      enabled: true
    },
    {
      id: 'security-alerts',
      name: 'Security Alerts',
      description: 'Critical security-related notifications',
      enabled: true
    },
    {
      id: 'activity-summaries',
      name: 'Activity Summaries',
      description: 'Weekly summary of important activities and events',
      enabled: false
    }
  ]);

  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleToggle = (id: string) => {
    setNotificationTypes(prev =>
      prev.map(type =>
        type.id === id ? { ...type, enabled: !type.enabled } : type
      )
    );
  };

  const saveSettings = () => {
    console.log('Saving notification settings:', notificationTypes);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const enableAll = () => {
    setNotificationTypes(prev => prev.map(type => ({ ...type, enabled: true })));
  };

  const disableAll = () => {
    setNotificationTypes(prev => prev.map(type => ({ ...type, enabled: false })));
  };

  const filteredNotifications = activeTab === 'all'
    ? notificationTypes
    : activeTab === 'enabled'
      ? notificationTypes.filter(n => n.enabled)
      : notificationTypes.filter(n => !n.enabled);

  return (
    <div className="max-w-3xl mx-auto bg-[#F4EBDC] dark:bg-[#283953] text-[#3B4F71] dark:text-[#B0BEC5] shadow-xl rounded-2xl overflow-hidden font-['Open_Sans']">
      {/* Header */}
      <div className="bg-[#D4A373] dark:bg-[#F77F00] p-4 flex items-center justify-between font-['Space_Grotesk']">
        <div className="flex items-center space-x-3">
          <ArrowLeft className="h-5 w-5 text-white cursor-pointer" />
          <h1 className="text-xl font-extrabold text-white">Notification Settings</h1>
        </div>
        <Settings className="h-5 w-5 text-white" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D8C3A5] dark:border-[#3B4F71]">
        {['all', 'enabled', 'disabled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium font-['Poppins'] transition ${
              activeTab === tab
                ? 'border-b-2 border-[#005F73] text-[#005F73] dark:border-[#F77F00] dark:text-[#F77F00]'
                : 'text-[#A9927D] dark:text-[#7289A4]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      <div className="p-4 bg-[#F4EBDC] dark:bg-[#3B4F71] flex justify-between items-center text-sm font-['Nunito']">
        <div>
          <span className="font-semibold">{notificationTypes.filter(n => n.enabled).length}</span> of {notificationTypes.length} notifications enabled
        </div>
        <div className="space-x-2">
          <button
            onClick={enableAll}
            className="px-3 py-1 text-sm bg-[#C8B6A6] dark:bg-[#7289A4] text-[#005F73] rounded-md hover:bg-[#D8C3A5]"
          >
            Enable All
          </button>
          <button
            onClick={disableAll}
            className="px-3 py-1 text-sm bg-[#D8C3A5] dark:bg-[#3B4F71] text-[#9C6644] dark:text-[#D4A373] rounded-md hover:bg-[#C8B6A6]"
          >
            Disable All
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="divide-y divide-[#D8C3A5] dark:divide-[#3B4F71]">
        {filteredNotifications.map((type) => (
          <div key={type.id} className="p-4 flex items-center justify-between hover:bg-[#E1C699] dark:hover:bg-[#3B4F71] transition">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${type.enabled ? 'bg-[#FCBF49] text-[#D62828]' : 'bg-[#C8B6A6] text-[#8E7B6D]'}`}>
                {type.id === 'predictive-alerts' && <AlertTriangle className="h-5 w-5" />}
                {type.id === 'smart-alerts' && <Bell className="h-5 w-5" />}
                {(type.id !== 'predictive-alerts' && type.id !== 'smart-alerts') && <Bell className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold">{type.name}</h3>
                <p className="text-xs text-[#8E7B6D] dark:text-[#B0BEC5]">{type.description}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={type.enabled}
                onChange={() => handleToggle(type.id)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005F73] dark:peer-checked:bg-[#F77F00]"></div>
            </label>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="p-4 bg-[#F4EBDC] dark:bg-[#283953] flex justify-end border-t border-[#D8C3A5] dark:border-[#3B4F71]">
        <button
          onClick={saveSettings}
          className="px-4 py-2 bg-[#005F73] text-white font-semibold rounded-md hover:bg-[#007A8F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E63946] font-['Poppins']"
        >
          Save Preferences
        </button>
      </div>

      {/* Success Message */}
      {showSavedMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center shadow-lg font-['Source_Sans_Pro']">
          <Check className="h-5 w-5 mr-2" />
          <span>Your notification preferences have been saved!</span>
          <button onClick={() => setShowSavedMessage(false)} className="ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
