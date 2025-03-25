import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Bell, Moon, Sun, Globe, Lock, Shield, Save, X } from 'lucide-react';

const Settings = () => {
  const { userSettings, loading, error, updateSettings, refreshUserData } = useUser();
  const [success, setSuccess] = useState('');
  
  // Local settings state for editing
  const [localSettings, setLocalSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      reducedMotion: false
    },
    privacy: {
      profileVisibility: 'public',
      shareBookingHistory: false,
      allowLocationAccess: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30min'
    }
  });

  // Initialize local settings when user settings are loaded
  useEffect(() => {
    if (userSettings) {
      // Map the API settings structure to the component's structure
      setLocalSettings({
        notifications: {
          ...localSettings.notifications,
          email: userSettings.notifications.email,
          push: userSettings.notifications.push,
          sms: userSettings.notifications.sms
        },
        privacy: {
          ...localSettings.privacy,
          allowLocationAccess: userSettings.privacy.shareLocation,
          shareBookingHistory: userSettings.privacy.shareBookingHistory
        },
        appearance: {
          ...localSettings.appearance,
          theme: userSettings.preferences.theme
        }
      });
    }
  }, [userSettings]);

  // Refresh user data when component mounts
  useEffect(() => {
    refreshUserData();
  }, []);

  // Handle toggle changes
  const handleToggleChange = (category, setting) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  // Handle radio/select changes
  const handleValueChange = (category, setting, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  // Save settings
  const handleSaveSettings = async () => {
    try {
      // Map the component's structure back to the API structure
      const apiSettings = {
        notifications: {
          email: localSettings.notifications.email,
          push: localSettings.notifications.push,
          sms: localSettings.notifications.sms
        },
        privacy: {
          shareLocation: localSettings.privacy.allowLocationAccess,
          shareBookingHistory: localSettings.privacy.shareBookingHistory
        },
        preferences: {
          language: userSettings?.preferences?.language || 'en',
          currency: userSettings?.preferences?.currency || 'EUR',
          theme: localSettings.appearance.theme
        }
      };
      
      await updateSettings(apiSettings);
      setSuccess('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="text-red-500">
          <p>Error loading settings: {error}</p>
          <button 
            onClick={refreshUserData}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account preferences</p>
      </div>

      <div className="p-6">
        {/* Success message */}
        {success && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        {/* Notifications Settings */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          
          <div className="space-y-4 pl-7">
            <div className="flex items-center justify-between">
              <label htmlFor="email-notifications" className="text-sm text-gray-700">Email notifications</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="email-notifications" 
                  checked={localSettings.notifications.email}
                  onChange={() => handleToggleChange('notifications', 'email')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="email-notifications" 
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${localSettings.notifications.email ? 'bg-emerald-500' : 'bg-gray-300'}`}
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="push-notifications" className="text-sm text-gray-700">Push notifications</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="push-notifications" 
                  checked={localSettings.notifications.push}
                  onChange={() => handleToggleChange('notifications', 'push')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="push-notifications" 
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${localSettings.notifications.push ? 'bg-emerald-500' : 'bg-gray-300'}`}
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="sms-notifications" className="text-sm text-gray-700">SMS notifications</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="sms-notifications" 
                  checked={localSettings.notifications.sms}
                  onChange={() => handleToggleChange('notifications', 'sms')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="sms-notifications" 
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${localSettings.notifications.sms ? 'bg-emerald-500' : 'bg-gray-300'}`}
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="marketing-notifications" className="text-sm text-gray-700">Marketing emails</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="marketing-notifications" 
                  checked={localSettings.notifications.marketing}
                  onChange={() => handleToggleChange('notifications', 'marketing')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="marketing-notifications" 
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${localSettings.notifications.marketing ? 'bg-emerald-500' : 'bg-gray-300'}`}
                ></label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Appearance Settings */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {localSettings.appearance.theme === 'light' ? (
              <Sun className="h-5 w-5 text-gray-500 mr-2" />
            ) : (
              <Moon className="h-5 w-5 text-gray-500 mr-2" />
            )}
            <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
          </div>
          
          <div className="space-y-4 pl-7">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-2">Theme</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="theme" 
                    value="light" 
                    checked={localSettings.appearance.theme === 'light'}
                    onChange={() => handleValueChange('appearance', 'theme', 'light')}
                    className="form-radio h-4 w-4 text-emerald-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Light</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="theme" 
                    value="dark" 
                    checked={localSettings.appearance.theme === 'dark'}
                    onChange={() => handleValueChange('appearance', 'theme', 'dark')}
                    className="form-radio h-4 w-4 text-emerald-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Dark</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="theme" 
                    value="system" 
                    checked={localSettings.appearance.theme === 'system'}
                    onChange={() => handleValueChange('appearance', 'theme', 'system')}
                    className="form-radio h-4 w-4 text-emerald-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">System</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Privacy Settings */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Privacy</h3>
          </div>
          
          <div className="space-y-4 pl-7">
            <div className="flex items-center justify-between">
              <label htmlFor="location-access" className="text-sm text-gray-700">Allow location access</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="location-access" 
                  checked={localSettings.privacy.allowLocationAccess}
                  onChange={() => handleToggleChange('privacy', 'allowLocationAccess')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="location-access" 
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${localSettings.privacy.allowLocationAccess ? 'bg-emerald-500' : 'bg-gray-300'}`}
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="share-history" className="text-sm text-gray-700">Share booking history</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="share-history" 
                  checked={localSettings.privacy.shareBookingHistory}
                  onChange={() => handleToggleChange('privacy', 'shareBookingHistory')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="share-history" 
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${localSettings.privacy.shareBookingHistory ? 'bg-emerald-500' : 'bg-gray-300'}`}
                ></label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            onClick={handleSaveSettings}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Save className="-ml-1 mr-2 h-5 w-5" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;