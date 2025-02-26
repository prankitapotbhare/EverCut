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
    'auth/unauthorized-domain': 'This domain is not authorized to use this service',
    'auth/invalid-email': 'Invalid email format',
    'auth/invalid-credential': 'Invalid credential',
    'auth/operation-not-allowed': 'Email/password sign up is not enabled',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Invalid password',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method',
    'auth/invalid-action-code': 'The verification link has expired or already been used',
    'auth/invalid-verification-code': 'Invalid verification code',
    'auth/invalid-verification-id': 'Invalid verification ID',
    'auth/expired-action-code': 'The verification link has expired',
    'auth/invalid-phone-number': 'Invalid phone number format',
    'auth/missing-phone-number': 'Phone number is required',
    'auth/quota-exceeded': 'Quota exceeded. Please try again later',
    'auth/rejected-credential': 'The request was rejected. Please try again',
    'auth/timeout': 'The operation has timed out. Please try again',
    'auth/user-cancelled': 'The operation was cancelled by the user',
    'auth/user-token-expired': 'Your session has expired. Please sign in again',
    'auth/web-storage-unsupported': 'Web storage is not supported by your browser',
    'auth/invalid-continue-uri': 'The continue URL provided is invalid',
    'auth/unauthorized-continue-uri': 'The domain of the continue URL is not allowed',
    'auth/missing-continue-uri': 'A continue URL must be provided',
    'auth/missing-iframe-start': 'An internal error has occurred',
    'auth/missing-ios-bundle-id': 'iOS bundle ID is missing',
    'auth/missing-or-invalid-nonce': 'Invalid request. Please try again',
    'auth/missing-android-pkg-name': 'Android package name is missing',
    'auth/auth-domain-config-required': 'Authentication domain configuration is required',
    'auth/cancelled-popup-request': 'Only one popup request is allowed at a time',
    'auth/popup-blocked': 'Popup was blocked by the browser',
    'auth/popup-closed-by-user': 'Popup was closed before authentication was completed',
    'auth/provider-already-linked': 'Account is already linked with another provider',
    'auth/credential-already-in-use': 'This credential is already associated with another account',
    'auth/email-already-in-use': 'This email address is already in use',
    'auth/code-expired': 'The verification code has expired',
    'auth/expired-popup-request': 'The popup request has expired',
    'auth/invalid-api-key': 'Invalid API key',
    'auth/invalid-app-credential': 'Invalid app credential',
    'auth/invalid-user-token': 'User credentials have expired. Please sign in again',
    'auth/invalid-tenant-id': 'Invalid tenant ID',
    'auth/multi-factor-auth-required': 'Multi-factor authentication is required',
    'auth/second-factor-already-in-use': 'This second factor is already enrolled',
    'auth/maximum-second-factor-count-exceeded': 'Maximum number of second factors already enrolled',
    'auth/unsupported-first-factor': 'Unsupported first factor',
    'auth/unsupported-persistence-type': 'Unsupported persistence type',
    'auth/unsupported-tenant-operation': 'Operation is not supported for this tenant',
    'auth/unverified-email': 'Email is not verified',
    'auth/user-mismatch': 'The supplied credentials do not match the previously signed in user',
    'auth/requires-recent-login': 'This operation requires recent authentication. Please sign in again',
    'auth/phone-number-already-exists': 'This phone number is already in use',
    'auth/project-not-found': 'Project not found',
    'auth/insufficient-permission': 'Insufficient permission to access the requested resource',
    'auth/internal-error': 'An internal error has occurred. Please try again'
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
    console.error('Error decoding token:', error);
    return true;
  }
};