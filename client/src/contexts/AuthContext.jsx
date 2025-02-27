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
import { 
  doc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  getDoc 
} from 'firebase/firestore';
import { auth, db, verifyEmailSettings, resetPasswordSettings } from '../firebase/config';
import { parseAuthError } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const createOrUpdateUser = async (user, additionalData = {}) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create new user document with all required fields
        const newUserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || additionalData.displayName,
          photoURL: user.photoURL || additionalData.photoURL,
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          lastSeen: serverTimestamp(),
          provider: additionalData.provider || 'email/password',
          location: additionalData.location || '',
          termsAccepted: additionalData.termsAccepted || false,
          termsAcceptedAt: additionalData.termsAccepted ? serverTimestamp() : null,
        };
        await setDoc(userRef, newUserData);
      } else {
        // Update only the fields that are provided or need updating
        const existingData = userSnap.data();
        const updateData = {
          lastSeen: serverTimestamp(),
          emailVerified: user.emailVerified,
          ...(user.displayName && { displayName: user.displayName }),
          ...(user.photoURL && { photoURL: user.photoURL }),
          ...(additionalData.provider && { provider: additionalData.provider }),
          ...(additionalData.location && { location: additionalData.location }),
        };
        await updateDoc(userRef, updateData);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            // Update emailVerified status in Firestore
            await createOrUpdateUser(user);
          }
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error reloading user:', error);
        setAuthError(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName, location) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

      await Promise.all([
        updateProfile(user, { displayName, photoURL, location }),
        sendEmailVerification(user, verifyEmailSettings),
        createOrUpdateUser(user, {
          displayName,
          photoURL,
          location,
          termsAccepted: true,
          provider: 'email/password'
        })
      ]);

      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(parseAuthError(error));
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await createOrUpdateUser(userCredential.user, {
        provider: 'email/password'
      });
      // Wait for auth state to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      return userCredential.user;
    } catch (error) {
      throw new Error(parseAuthError(error));
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      access_type: 'offline'
    });
    
    try {
      const result = await signInWithPopup(auth, provider);
      await createOrUpdateUser(result.user, {
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        provider: 'google',
        termsAccepted: true,
        termsAcceptedAt: serverTimestamp(),
        location: ''
      });
      return result.user;
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, resetPasswordSettings);
    } catch (error) {
      throw new Error(parseAuthError(error));
    }
  };

  const resendVerificationEmail = async () => {
    if (currentUser && !currentUser.emailVerified) {
      try {
        await sendEmailVerification(currentUser, verifyEmailSettings);
      } catch (error) {
        throw new Error(parseAuthError(error));
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (data) => {
    if (currentUser) {
      await updateProfile(currentUser, data);
      setCurrentUser({ ...currentUser, ...data });
    }
  };

  const value = {
    currentUser,
    loading,
    authError,
    signup,
    login,
    logout,
    resetPassword,
    googleSignIn,
    resendVerificationEmail,
    updateUserProfile,
    createOrUpdateUser // Add this to make it available throughout the app
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};