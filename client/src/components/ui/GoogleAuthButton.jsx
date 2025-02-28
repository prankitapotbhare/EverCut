import React from 'react';
import { FcGoogle } from 'react-icons/fc';

export const GoogleAuthButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-2 flex items-center justify-center w-auto p-4 mx-auto border border-gray-300 py-1.5 rounded-lg hover:bg-gray-100 transition duration-200 text-sm"
      type="button"
    >
      <FcGoogle className="w-5 h-5" />
      <span className="text-gray-700">Continue with Google</span>
    </button>
  );
};