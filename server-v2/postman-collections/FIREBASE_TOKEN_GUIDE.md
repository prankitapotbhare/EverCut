# 🔐 Firebase Token Guide - Complete Setup

## 📋 Overview

The EverCut API uses **Firebase Authentication** with phone number OTP verification. To test the API in Postman, you need a **Firebase ID Token**.

---

## 🎯 What is a Firebase ID Token?

A Firebase ID Token is a **JWT (JSON Web Token)** that:
- Proves the user's identity
- Contains user information (UID, phone number, etc.)
- Expires after **1 hour**
- Is verified by the backend using Firebase Admin SDK

---

## 🔑 How to Get a Firebase ID Token

### Method 1: Using Your Mobile/Web App (Recommended)

If you already have a mobile or web app with Firebase authentication:

#### For Web App (JavaScript):

```javascript
// After user completes phone OTP verification
firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
  .then(confirmationResult => {
    // User enters OTP code
    const otpCode = prompt('Enter OTP:');
    return confirmationResult.confirm(otpCode);
  })
  .then(result => {
    // Get the ID token
    return result.user.getIdToken();
  })
  .then(idToken => {
    console.log('Firebase ID Token:', idToken);
    // Copy this token to Postman
    navigator.clipboard.writeText(idToken);
    alert('Token copied to clipboard!');
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

#### For Mobile App (React Native / Flutter):

**React Native:**
```javascript
import auth from '@react-native-firebase/auth';

// After OTP verification
const user = auth().currentUser;
const idToken = await user.getIdToken();
console.log('Firebase ID Token:', idToken);
```

**Flutter:**
```dart
import 'package:firebase_auth/firebase_auth.dart';

// After OTP verification
final user = FirebaseAuth.instance.currentUser;
final idToken = await user?.getIdToken();
print('Firebase ID Token: $idToken');
```

---

### Method 2: Using Firebase REST API (For Testing)

You can get a token using Firebase's REST API:

#### Step 1: Send OTP

```bash
curl -X POST 'https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=YOUR_FIREBASE_API_KEY' \
-H 'Content-Type: application/json' \
-d '{
  "phoneNumber": "+1234567890",
  "recaptchaToken": "YOUR_RECAPTCHA_TOKEN"
}'
```

#### Step 2: Verify OTP and Get Token

```bash
curl -X POST 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=YOUR_FIREBASE_API_KEY' \
-H 'Content-Type: application/json' \
-d '{
  "sessionInfo": "SESSION_INFO_FROM_STEP_1",
  "code": "123456"
}'
```

Response will contain `idToken`.

---

### Method 3: Using Firebase Admin SDK (Backend Testing)

Create a custom token for testing:

```javascript
// backend-test-token.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin-sdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Create custom token for testing
const uid = 'test-user-uid';
const customToken = await admin.auth().createCustomToken(uid, {
  phoneNumber: '+1234567890',
  role: 'CUSTOMER'
});

console.log('Custom Token:', customToken);

// Exchange custom token for ID token (client-side)
// Use this in your web app:
// firebase.auth().signInWithCustomToken(customToken)
//   .then(result => result.user.getIdToken())
//   .then(idToken => console.log('ID Token:', idToken));
```

---

### Method 4: Using Postman Pre-request Script (Advanced)

Create a helper collection that gets the token automatically:

```javascript
// Postman Pre-request Script
const firebaseApiKey = pm.environment.get('FIREBASE_API_KEY');
const phoneNumber = pm.environment.get('TEST_PHONE_NUMBER');
const otpCode = pm.environment.get('TEST_OTP_CODE');

// This requires you to have already sent OTP and have sessionInfo
const sessionInfo = pm.environment.get('SESSION_INFO');

pm.sendRequest({
    url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=${firebaseApiKey}`,
    method: 'POST',
    header: {
        'Content-Type': 'application/json'
    },
    body: {
        mode: 'raw',
        raw: JSON.stringify({
            sessionInfo: sessionInfo,
            code: otpCode
        })
    }
}, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        const idToken = res.json().idToken;
        pm.collectionVariables.set('firebase_token', idToken);
        console.log('Token set successfully');
    }
});
```

---

## 🛠️ Setup Instructions

### Option A: Quick Setup (Using Existing App)

1. **Open your mobile/web app**
2. **Complete phone OTP verification**
3. **Get the ID token** using the code above
4. **Copy the token**
5. **Paste in Postman:**
   - Open any EverCut collection
   - Go to **Variables** tab
   - Set `firebase_token` = `YOUR_TOKEN_HERE`
   - Click **Save**

### Option B: Create Test Script

1. **Create a file:** `scripts/get-firebase-token.js`

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin-sdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function getTestToken() {
  try {
    // Create custom token
    const customToken = await admin.auth().createCustomToken('test-user-123', {
      phoneNumber: '+1234567890',
      role: 'CUSTOMER'
    });
    
    console.log('Custom Token:', customToken);
    console.log('\nNow exchange this for an ID token using:');
    console.log('firebase.auth().signInWithCustomToken(customToken)');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

getTestToken();
```

2. **Run the script:**
```bash
node scripts/get-firebase-token.js
```

3. **Exchange custom token for ID token** (in browser console):
```javascript
firebase.auth().signInWithCustomToken('CUSTOM_TOKEN_FROM_SCRIPT')
  .then(result => result.user.getIdToken())
  .then(idToken => {
    console.log('ID Token:', idToken);
    navigator.clipboard.writeText(idToken);
  });
```

---

## 🔄 Token Refresh

Firebase ID tokens expire after **1 hour**. When testing:

### Auto-Refresh (Recommended)

```javascript
// In your app
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    const idToken = await user.getIdToken(true); // Force refresh
    console.log('Refreshed Token:', idToken);
  }
});
```

### Manual Refresh

```javascript
const user = firebase.auth().currentUser;
const freshToken = await user.getIdToken(true);
console.log('Fresh Token:', freshToken);
```

---

## 📝 Variable Setup for Postman

### Configure Collection Variables

Each collection has built-in variables. To configure them:

1. **Click on a collection** (e.g., "EverCut - Authentication")
2. **Go to Variables tab**
3. **Set the Current Value** for each variable:

```
VARIABLE              CURRENT VALUE
base_url              http://localhost:5000
api_prefix            /api/v1
firebase_token        [paste your token here]
```

4. **Click Save**
5. **Repeat for other collections** (or they'll use default values)

---

## 🧪 Testing the Token

### Test 1: Verify Token is Valid

```bash
curl -X POST 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=YOUR_FIREBASE_API_KEY' \
-H 'Content-Type: application/json' \
-d '{
  "idToken": "YOUR_ID_TOKEN"
}'
```

### Test 2: Use in Postman

1. Open **01-authentication** collection
2. Run **Health Check** (no auth required)
3. Run **Check After OTP** (requires token)
4. If successful, token is valid!

---

## 🔒 Security Best Practices

### ✅ DO:
- Store tokens in Postman collection variables
- Use different tokens for dev/staging/prod
- Refresh tokens before they expire
- Never commit tokens to Git

### ❌ DON'T:
- Share tokens publicly
- Hardcode tokens in requests
- Use production tokens for testing
- Store tokens in plain text files
- Commit `firebase-admin-sdk.json` to Git

---

## 🐛 Troubleshooting

### Issue: "No token provided"
**Solution:** Set `firebase_token` variable in Postman

### Issue: "Invalid or expired token"
**Solution:** Token expired (1 hour limit). Get a new token.

### Issue: "Token verification failed"
**Solution:** 
- Check token is complete (no truncation)
- Verify Firebase project matches backend
- Ensure backend has correct `firebase-admin-sdk.json`

### Issue: "User not found"
**Solution:** 
- Run "Check After OTP" first
- Complete profile registration
- Verify phone number matches

---

## 📦 Quick Start Script

Save this as `setup-postman-token.sh`:

```bash
#!/bin/bash

echo "🔐 EverCut API - Firebase Token Setup"
echo ""
echo "Choose your method:"
echo "1. I have a mobile/web app (get token from app)"
echo "2. I want to use Firebase REST API"
echo "3. I want to create a custom token (requires Admin SDK)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "📱 Steps:"
    echo "1. Open your app and complete phone OTP"
    echo "2. Run this in browser console:"
    echo "   firebase.auth().currentUser.getIdToken().then(t => console.log(t))"
    echo "3. Copy the token"
    echo "4. Paste in Postman → Collection → Variables → firebase_token"
    ;;
  2)
    read -p "Enter Firebase API Key: " api_key
    read -p "Enter phone number (+1234567890): " phone
    echo ""
    echo "📤 Sending OTP..."
    # Add REST API call here
    ;;
  3)
    echo ""
    echo "🔧 Creating custom token..."
    node scripts/get-firebase-token.js
    ;;
esac
```

---

## 📚 Additional Resources

### Firebase Documentation
- [Phone Authentication](https://firebase.google.com/docs/auth/web/phone-auth)
- [ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [Custom Tokens](https://firebase.google.com/docs/auth/admin/create-custom-tokens)

### Postman Documentation
- [Variables](https://learning.postman.com/docs/sending-requests/variables/)
- [Environments](https://learning.postman.com/docs/sending-requests/managing-environments/)
- [Pre-request Scripts](https://learning.postman.com/docs/writing-scripts/pre-request-scripts/)

---

## ✅ Checklist

Before testing:

- [ ] Firebase project configured
- [ ] Phone authentication enabled in Firebase Console
- [ ] Backend has `firebase-admin-sdk.json`
- [ ] Backend server is running
- [ ] Firebase ID token obtained
- [ ] Token set in collection variables
- [ ] Health check endpoint works

---

## 🎯 Quick Reference

```javascript
// Get token (web)
firebase.auth().currentUser.getIdToken().then(console.log)

// Get token (Node.js with Admin SDK)
admin.auth().createCustomToken(uid).then(console.log)

// Refresh token
firebase.auth().currentUser.getIdToken(true).then(console.log)

// Set in Postman
Collection → Variables → firebase_token → Paste → Save
```

---

**Need Help?** Check the main README.md or IMPORT_GUIDE.md for more information.

**Version:** 1.0.0  
**Last Updated:** February 23, 2024
