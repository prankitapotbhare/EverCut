import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';

export const createUser = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await Promise.all([
    sendEmailVerification(userCredential.user),
    updateProfile(userCredential.user, { displayName })
  ]);
  return userCredential.user;
};

export const updateUserProfile = async (user, data) => {
  await updateProfile(user, data);
  return user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const resetUserPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const resendVerificationEmail = async (user) => {
  await sendEmailVerification(user);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};