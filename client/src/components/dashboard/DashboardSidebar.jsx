import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, User, Heart, Settings, LogOut } from 'lucide-react';

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout } = useAuth();
  
  const navItems = [
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'favorites', label: 'Favorite Salons', icon: <Heart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Logo and branding */}
      {/* <div className="p-4 border-b border-gray-200">
        <img src="/logo/evercut.png" alt="EverCut" className="h-10 mx-auto" />
      </div> */}
      
      {/* User info */}
      <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          {currentUser?.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt={currentUser.displayName || 'User'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600 font-bold">
              {currentUser?.displayName?.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {currentUser?.displayName || 'User'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {currentUser?.email || ''}
          </p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      
      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="mr-3"><LogOut size={20} /></span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;