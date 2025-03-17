# EverCut Components Documentation

## Authentication Components

### 1. SignupForm
Location: `src/components/auth/SignupForm.jsx`

**Props:**
```typescript
{
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
```

**Features:**
- Form validation using React Hook Form
- Fields:
  - Name (required)
  - Location (required)
  - Email (required, email format)
  - Password (required, min 8 characters)
  - Confirm Password (must match)
  - Terms acceptance (required)
- Firebase Authentication integration
- Google OAuth signup option
- Automatic email verification trigger
- Error handling and display
- Loading states
- Responsive design with Tailwind CSS
- Redirect to verification page after signup

### 2. LoginForm
Location: `src/components/auth/LoginForm.jsx`

**Props:**
```typescript
{
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
```

**Features:**
- Form validation using React Hook Form
- Fields:
  - Email (required, email format)
  - Password (required)
  - Remember me option
- Firebase Authentication integration
- Google OAuth integration
- Email verification status check
- Redirect unverified users
- Forgot password link
- Error handling and display
- Loading states
- Responsive design with Tailwind CSS

### 3. GoogleAuthButton
Location: `src/components/auth/GoogleAuthButton.jsx`

**Props:**
```typescript
{
  onSuccess?: (response: GoogleResponse) => void;
  onError?: (error: Error) => void;
  mode?: 'login' | 'signup';
}
```

**Features:**
- Firebase Google OAuth integration
- Automatic email verification bypass
- Loading state
- Error handling
- Custom styling with Tailwind CSS
- Gradient background effect

### 4. ForgotPasswordForm
Location: `src/components/auth/ForgotPasswordForm.jsx`

**Props:**
```typescript
{
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
```

**Features:**
- Email validation
- Firebase password reset integration
- Success/Error messages
- Loading state
- Responsive design with Tailwind CSS
- Form validation using React Hook Form

### 5. AuthGuard
Location: `src/components/auth/AuthGuard.jsx`

**Props:**
```typescript
{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireVerified?: boolean;
}
```

**Features:**
- Protected route wrapper
- Firebase authentication state check
- Email verification status check
- Loading state handling
- Redirect to login
- Integration with Firebase AuthContext
- Automatic token refresh handling

### 6. EmailVerification
Location: `src/components/auth/EmailVerification.jsx`

**Props:**
```typescript
{
  email: string;
  onVerificationComplete?: () => void;
}
```

**Features:**
- Firebase email verification status check
- Resend verification email
- Loading states
- Success/Error messages
- Auto-refresh verification status
- Redirect on verification complete

### 7. VerificationStatus
Location: `src/components/auth/VerificationStatus.jsx`

**Props:**
```typescript
{
  email: string;
  showResend?: boolean;
}
```

**Features:**
- Display verification status
- Resend verification option
- Loading indicator
- Error handling
- Auto-refresh status
- Custom styling with Tailwind CSS

## Common Components

### 1. Button
Location: `src/components/common/Button.jsx`

**Props:**
```typescript
{
  variant?: 'primary' | 'secondary' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**Features:**
- Tailwind CSS styling
- Loading spinner integration
- Gradient background option
- Hover and focus states
- Disabled state handling
- ARIA support
- Color themes from design system

### 2. Input
Location: `src/components/common/Input.jsx`

**Props:**
```typescript
{
  type?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  name: string;
  register?: UseFormRegister;
  validation?: object;
}
```

**Features:**
- Floating label design
- Error state handling
- React Hook Form integration
- Accessibility support
- Custom styling options
- Validation state indicators
- Focus and hover effects

### 3. Modal
Location: `src/components/common/Modal.jsx`

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlayClick?: boolean;
}
```

**Features:**
- Blur backdrop effect
- Smooth transitions
- Responsive sizing
- Close on escape key
- Focus trap
- Accessibility support
- Custom styling with Tailwind CSS

### 4. Loading
Location: `src/components/common/Loading.jsx`

**Props:**
```typescript
{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  fullScreen?: boolean;
}
```

**Features:**
- Customizable spinner
- Size variants
- Color customization
- Full-screen overlay option
- Smooth animations
- Theme-based colors
- Accessibility labels