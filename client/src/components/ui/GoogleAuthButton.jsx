import React from 'react';
import { FcGoogle } from 'react-icons/fc';

export const GoogleAuthButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 mt-4 hover:bg-gray-50 transition-colors"
      type="button"
    >
      <FcGoogle className="w-5 h-5" />
      <span className="text-gray-700">Continue with Google</span>
    </button>
  );
};