import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  linkWithCredential
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

export const createUser = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await Promise.all([
    sendEmailVerification(userCredential.user),
    updateProfile(userCredential.user, { 
      displayName,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`
    })
  ]);
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if email exists with different provider
    const methods = await fetchSignInMethodsForEmail(auth, user.email);
    
    if (methods.length > 0 && !methods.includes('google.com')) {
      // Email exists with different provider
      throw new Error('EMAIL_EXISTS_DIFFERENT_PROVIDER');
    }
    
    return user;
  } catch (error) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('EMAIL_EXISTS_DIFFERENT_PROVIDER');
    }
    throw error;
  }
};

export const linkEmailProvider = async (email, password) => {
  const credential = EmailAuthProvider.credential(email, password);
  return linkWithCredential(auth.currentUser, credential);
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