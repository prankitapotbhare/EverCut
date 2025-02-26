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
import { auth, verifyEmailSettings, resetPasswordSettings } from '../firebase/config';
import { storage } from '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Refresh the user object to get the latest data
        user.reload().then(() => {
          setCurrentUser(user);
          setLoading(false);
        }).catch((error) => {
          console.error('Error reloading user:', error);
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName, location) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await Promise.all([
        updateProfile(user, {
          displayName,
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`
        }),
        sendEmailVerification(user, verifyEmailSettings)
      ]);

      storage.set('userLocation', location);
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email, resetPasswordSettings);
  };

  const resendVerificationEmail = async () => {
    if (currentUser && !currentUser.emailVerified) {
      try {
        await sendEmailVerification(currentUser, verifyEmailSettings);
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