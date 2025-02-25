import { auth } from '../firebase/config';

export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }
  return user.getIdToken();
};

export const parseAuthError = (error) => {
  const errorMessages = {
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Invalid password',
    'auth/email-already-in-use': 'Email is already registered',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/invalid-email': 'Invalid email format',
    'auth/popup-closed-by-user': 'Sign in was cancelled',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/requires-recent-login': 'Please log in again to continue'
  };

  return errorMessages[error.code] || 'An unexpected error occurred';
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    const expirationTime = decodedPayload.exp * 1000;
    
    return Date.now() >= expirationTime;
  } catch (error) {
    return true;
  }
};

export const handleAuthRedirect = (user, navigate) => {
  if (!user) {
    navigate('/login');
    return;
  }

  if (!user.emailVerified && user.providerData[0].providerId !== 'google.com') {
    navigate('/verify-email', { state: { email: user.email } });
    return;
  }

  navigate('/');
};