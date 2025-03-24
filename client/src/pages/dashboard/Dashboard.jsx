import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AppointmentsList from '@/components/dashboard/AppointmentsList';
import UserProfile from '@/components/dashboard/UserProfile';
import FavoriteSalons from '@/components/dashboard/FavoriteSalons';
import Settings from '@/components/dashboard/Settings';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');
  const location = useLocation();
  
  // Handle tab selection from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam && ['appointments', 'profile', 'favorites', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile user={currentUser} />;
      case 'appointments':
        return <AppointmentsList />;
      case 'favorites':
        return <FavoriteSalons />;
      case 'settings':
        return <Settings />;
      default:
        return <AppointmentsList />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;