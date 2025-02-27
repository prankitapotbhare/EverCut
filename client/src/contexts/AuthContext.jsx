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

  // In createOrUpdateUser function, add a parameter to control initialization
  const createOrUpdateUser = async (user, additionalData = {}, isInitializing = false) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      const baseUserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.displayName,
        photoURL: user.photoURL || additionalData.photoURL,
        emailVerified: user.emailVerified,
        lastSeen: serverTimestamp(),
      };

      if (!userSnap.exists() && isInitializing) {
        const newUserData = {
          ...baseUserData,
          createdAt: serverTimestamp(),
          provider: additionalData.provider || 'email/password',
          location: additionalData.location || '',
          termsAccepted: additionalData.termsAccepted || false,
          termsAcceptedAt: additionalData.termsAccepted ? serverTimestamp() : null,
        };
        await setDoc(userRef, newUserData);
        console.log('Set UserData:', newUserData);
        return;
      }

      const existingData = userSnap.data();
      const updateData = {
        ...baseUserData,
        // Only update these fields if they are explicitly provided and different
        ...(additionalData.provider && additionalData.provider !== existingData.provider && {
          provider: additionalData.provider
        }),
        ...(additionalData.location && additionalData.location !== existingData.location && {
          location: additionalData.location
        }),
        ...(additionalData.termsAccepted && !existingData.termsAccepted && {
          termsAccepted: true,
          termsAcceptedAt: serverTimestamp()
        })
      };

      await updateDoc(userRef, updateData);
      console.log('Updated UserData:', updateData);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  // In signup function, pass isInitializing as true
  const signup = async (email, password, displayName, location) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

      await Promise.all([
        updateProfile(user, { displayName, photoURL }),
        sendEmailVerification(user, verifyEmailSettings),
        createOrUpdateUser(user, {
          displayName,
          photoURL,
          location,
          termsAccepted: true,
          provider: 'email/password'
        }, true) // Add isInitializing flag
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
      await createOrUpdateUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      throw new Error(parseAuthError(error));
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
        access_type: 'offline'
      });
      
      const result = await signInWithPopup(auth, provider);
      await createOrUpdateUser(result.user, {
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        provider: 'google',
        termsAccepted: true,
        termsAcceptedAt: serverTimestamp(),
        location: ''
      }, true); // Add isInitializing flag
      
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
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(parseAuthError(error));
    }
  };

  const updateUserProfile = async (data) => {
    if (!currentUser) return;

    try {
      await updateProfile(currentUser, data);
      await createOrUpdateUser(currentUser, data);
      setCurrentUser({ ...currentUser, ...data });
    } catch (error) {
      throw new Error(parseAuthError(error));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            await createOrUpdateUser(user, {}, false); // Add isInitializing flag
          }
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setAuthError(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
    createOrUpdateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;