import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { Camera, Save, X } from 'lucide-react';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const { userProfile, loading, error, updateProfile, refreshUserData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    location: ''
  });

  // Initialize form data when user profile is loaded
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        location: userProfile.location || ''
      });
    }
  }, [userProfile]);

  // Refresh user data when component mounts
  useEffect(() => {
    refreshUserData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form data when canceling edit
      if (userProfile) {
        setFormData({
          displayName: userProfile.displayName || '',
          email: userProfile.email || '',
          phoneNumber: userProfile.phoneNumber || '',
          location: userProfile.location || ''
        });
      }
    }
    setIsEditing(!isEditing);
    setSuccess('');
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    try {
      // Only update fields that have changed
      const updates = {};
      if (formData.displayName !== userProfile.displayName) {
        updates.displayName = formData.displayName;
      }
      if (formData.phoneNumber !== userProfile.phoneNumber) {
        updates.phoneNumber = formData.phoneNumber;
      }
      if (formData.location !== userProfile.location) {
        updates.location = formData.location;
      }
      
      // Add other fields that might be updatable
      // Note: Email change requires re-authentication and is not implemented here

      if (Object.keys(updates).length > 0) {
        await updateProfile(updates);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setSuccess('No changes were made.');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="animate-pulse">
          <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
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
          <p>Error loading profile: {error}</p>
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
        <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
        <p className="text-gray-600 mt-1">View and manage your personal information</p>
      </div>

      <div className="p-6">
        {/* Profile picture section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              {userProfile?.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt={userProfile.displayName || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600 text-4xl font-bold">
                  {userProfile?.displayName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">{userProfile?.displayName}</h3>
          <p className="text-gray-500">{userProfile?.email}</p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Profile form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} shadow-sm focus:border-emerald-500 focus:ring-emerald-500`}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled={true} // Email changes require re-authentication
                className="mt-1 block w-full rounded-md border-transparent bg-gray-50 shadow-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Email address cannot be changed directly.</p>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} shadow-sm focus:border-emerald-500 focus:ring-emerald-500`}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full rounded-md ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} shadow-sm focus:border-emerald-500 focus:ring-emerald-500`}
              />
            </div>

            <div className="flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={toggleEditMode}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <X className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <Save className="-ml-1 mr-2 h-5 w-5" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={toggleEditMode}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;