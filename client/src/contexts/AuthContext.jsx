import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { storage } from '../utils/helpers';
import { actionCodeSettings } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, displayName, location) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await Promise.all([
        updateProfile(user, {
          displayName,
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`
        }),
        sendEmailVerification(user, {
          ...actionCodeSettings,
          url: `${window.location.origin}/verify-email-confirmation`
        })
      ]);

      storage.set('userLocation', location);
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    if (currentUser && !currentUser.emailVerified) {
      try {
        await sendEmailVerification(currentUser, {
          ...actionCodeSettings,
          url: `${window.location.origin}/verify-email-confirmation`
        });
      } catch (error) {
        console.error('Verification email error:', error);
        throw error;
      }
    }
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
    storage.remove('userLocation');
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      access_type: 'offline'
    });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  const updateUserProfile = async (data) => {
    if (currentUser) {
      await updateProfile(currentUser, data);
      setCurrentUser({ ...currentUser, ...data });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    googleSignIn,
    resendVerificationEmail,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};