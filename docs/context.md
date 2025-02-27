### 1. Project Breakdown
**App Name:** EverCut
**Platform:** Web Application
**Summary:** Modern authentication system with secure login, signup, and password reset functionality
**Primary Use Case:** User authentication and account management
**Authentication Requirements:**
- Email/Password authentication
- Google OAuth integration
- Secure password reset mechanism
- Email verification system
- User profile management

---

### 2. Tech Stack Overview
**Frontend Framework:**
- React + Vite
- Tailwind CSS
- Firebase Authentication
- Firestore Database

**Backend:**
- Node.js
- Express.js
- Firebase Admin (Token verification only)

**Deployment:**
- Vercel (Frontend)
- Vercel (Backend)

---

### 3. Core Features
1. **User Signup:**
   - Email/password registration
   - Name and location information
   - Password confirmation with validation
   - Terms acceptance
   - Google OAuth signup option
   - Email verification requirement
   - User data storage in Firestore

2. **User Login:**
   - Email/password authentication
   - Google OAuth login
   - Error handling with user-friendly messages

3. **Password Reset:**
   - Firebase password reset flow
   - Custom reset password confirmation page
   - Password strength validation

4. **Email Verification:**
   - Automatic verification email sent after signup
   - Custom verification confirmation page
   - Resend verification option

5. **User Profile:**
   - Profile information display
   - Last seen tracking
   - Provider information

---

### 4. User Flow
1. **Signup Flow:**
   - Required field collection:
     * Full name
     * Location
     * Email address
     * Password (with confirmation and validation)
     * Terms & policy acceptance
   - Form validation with detailed error messages
   - Google OAuth popup option
   - Email verification process:
     * Automatic verification email sent after signup
     * User must verify email before accessing protected routes
     * Resend verification option available
     * User data stored in Firestore

2. **Login Flow:**
   - Credential validation
   - OAuth authentication
   - Email verification check:
     * Block access if email not verified
     * Redirect to verification page
     * User data updated in Firestore

3. **Forgot Password Flow:**
   - Email submission
   - Reset link generation
   - New password setup with validation
   - Confirmation page after successful reset

4. **Email Verification Flow:**
   - Verification link sent to user email
   - Custom verification confirmation page
   - Success/error handling
   - Redirect to appropriate page based on verification status

---

### 5. Design and UI/UX Guidelines
**Color Palette:**
- Primary: Blue (#3B82F6)
- Secondary: Green (#10B981)
- Error: Red (#EF4444)
- Background: Light gray (#F9FAFB)
- Text: Dark slate (#1F2937)

**Typography:**
- System fonts with fallbacks
- Font Sizes: 
  - Headings: 1.5rem - 2.5rem
  - Body: 1rem
  - Small: 0.875rem

**UI Components:**
- Buttons: Gradient backgrounds with hover effects
- Forms: Labeled inputs with validation states
- Modals: Overlay with focus trap
- Loading indicators: Spinner and dots animations
- Error messages: Inline and toast notifications

**Animations:**
- Loading spinners
- Form transitions
- Error message animations

**Accessibility:**
- ARIA labels
- Form validation messages
- Screen reader support
- Focus management

---

### 6. Technical Implementation Approach
**Frontend Architecture:**
- React Context API for state management (AuthContext)
- React Router for navigation with protected routes
- React Hook Form for form management and validation
- Error boundary for application-wide error handling
- Portal-based modals and notifications

**Firebase Integration:**
- Firebase Authentication for user management
- Firestore for user data storage
- Custom email templates for verification and password reset
- Action code handler for email verification and password reset

**Form Validation:**
- Email: Required, valid format
- Password: Required, minimum 8 characters, uppercase, lowercase, number
- Name: Required, minimum 2 characters
- Location: Required
- Terms: Must be accepted
- Password confirmation: Must match password

**Error Handling:**
- Global error boundary for React errors
- Toast notifications for auth errors
- Form validation errors
- Network error handling
- Firebase error parsing and user-friendly messages

**Security Features:**
- Email verification requirement
- Secure password requirements
- Protected routes
- Authentication state management
- Token handling

**Utility Functions:**
- Debounce for performance optimization
- Local storage helpers
- Date formatting
- Error formatting
- Clipboard functionality
