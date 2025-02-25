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
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email format',
    'auth/operation-not-allowed': 'Email/password sign up is not enabled',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Invalid password',
    'auth/popup-closed-by-user': 'Sign in was cancelled',
    'auth/requires-recent-login': 'Please log in again to continue'
  };

  console.error('Auth error:', error);
  return errorMessages[error.code] || error.message || 'An unexpected error occurred';
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