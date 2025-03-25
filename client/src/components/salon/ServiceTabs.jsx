import React from 'react';

const ServiceTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-2 mb-6">
      <button
        className={`px-4 py-2 rounded-full cursor-pointer ${
          activeTab === 'single' 
            ? 'bg-gray-900 text-white' 
            : 'bg-white text-gray-800 hover:bg-gray-100'
        }`}
        onClick={() => setActiveTab('single')}
      >
        Single Services
      </button>
      <button
        className={`px-4 py-2 rounded-full cursor-pointer ${
          activeTab === 'packages' 
            ? 'bg-gray-900 text-white' 
            : 'bg-white text-gray-800 hover:bg-gray-100'
        }`}
        onClick={() => setActiveTab('packages')}
      >
        Packages
      </button>
    </div>
  );
};

export default ServiceTabs;