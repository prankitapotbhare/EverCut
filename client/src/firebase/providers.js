import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline'
});

export const signInWithGoogle = async (usePopup = true) => {
  try {
    if (usePopup) {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } else {
      await signInWithRedirect(auth, googleProvider);
    }
  } catch (error) {
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider);
    } else {
      throw error;
    }
  }
};

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getGoogleProvider = () => {
  return googleProvider;
};

export const providers = {
  google: googleProvider,
};