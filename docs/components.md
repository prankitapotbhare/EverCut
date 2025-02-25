# EverCut Components Documentation

## Authentication Components

### 1. SignupForm
Location: `src/components/auth/SignupForm.jsx`

**Props:** None

**Features:**
- Form validation using React Hook Form
- Fields:
  - Name (required)
  - Location (required)
  - Email (required, email format)
  - Password (required, min 6 characters)
  - Confirm Password (must match)
  - Terms acceptance
- Google OAuth integration
- Error handling and display
- Responsive design

### 2. LoginForm
Location: `src/components/auth/LoginForm.jsx`

**Props:** None

**Features:**
- Form validation using React Hook Form
- Fields:
  - Email (required, email format)
  - Password (required, min 6 characters)
  - Remember me option
- Google OAuth integration
- Forgot password link
- Error handling and display
- Responsive design

### 3. GoogleAuthButton
Location: `src/components/auth/GoogleAuthButton.jsx`

**Props:**
```typescript
{
  onSuccess?: (response: GoogleResponse) => void;
  onError?: (error: Error) => void;
}
```

**Features:**
- Google OAuth integration
- Loading state
- Error handling

### 4. ForgotPasswordForm
Location: `src/components/auth/ForgotPasswordForm.jsx`

**Props:** None

**Features:**
- Email validation
- Firebase password reset integration
- Success/Error messages
- Responsive design

## Common Components

### 1. Button
Location: `src/components/common/Button.jsx`

**Props:**
```typescript
{
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

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
}
```

### 3. Modal
Location: `src/components/common/Modal.jsx`

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
```

### 4. Loading
Location: `src/components/common/Loading.jsx`

**Props:**
```typescript
{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}
```
