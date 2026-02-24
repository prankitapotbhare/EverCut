# 🚀 Postman Setup Guide - EverCut API Testing

## Quick Start (3 Steps)

### 1️⃣ Generate Token
```bash
node scripts/firebase-token-gen.js
```

### 2️⃣ Copy Token
Open `scripts/test-tokens.json` and copy the `idToken` for your role:
- **CUSTOMER** → `test-customer-001.idToken`
- **BARBER** → `test-barber-001.idToken`

### 3️⃣ Set in Postman
1. Open your collection
2. Go to **Variables** tab
3. Set `firebase_token` = `<paste-token-here>`
4. Click **Save**

✅ Done! Start testing your APIs.

---

## 📖 Detailed Setup Instructions

### Method 1: Collection Variable (Recommended) ⭐

This method sets the token for all requests in a specific collection.

**Steps:**

1. **Open Postman** and select your collection (e.g., "01-authentication")

2. **Click on the collection name** (not a request, the collection itself)

3. **Go to the Variables tab**

4. **Find or add the variable:**
   - Variable name: `firebase_token`
   - Type: `default`
   - Initial Value: (leave empty)
   - Current Value: `<paste-your-token-here>`

5. **Click Save** (top right)

**Example:**
```
Variable Name: firebase_token
Current Value: eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjMjdhZmY1YzlkNGU1MzVkNWRjMmMwNWM1YTE2N2FlMmY1NjgxYzIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVGVzdCBDdXN0b21lciIsInJvbGUiOiJDVVNUT01FUiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ldmVyY3V0LWF1dGgiLCJhdWQiOiJldmVyY3V0LWF1dGgiLCJhdXRoX3RpbWUiOjE3NzE5Mzc0NjcsInVzZXJfaWQiOiJ0ZXN0LWN1c3RvbWVyLTAwMSIsInN1YiI6InRlc3QtY3VzdG9tZXItMDAxIiwiaWF0IjoxNzcxOTM3NDY3LCJleHAiOjE3NzE5NDEwNjcsImVtYWlsIjoidGVzdC5jdXN0b21lckBleGFtcGxlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXIiOiIrMTU1NTAwMDAwMDEiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInRlc3QuY3VzdG9tZXJAZXhhbXBsZS5jb20iXSwicGhvbmUiOlsiKzE1NTUwMDAwMDAxIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19.TUgqlo3VCI0tsOBxhKPqLwbaggd12iyVEOLJVruNEMLWH8GX7os4uMaPtSAnAYGY0XVc9TGl8CxYEffpV5OGbADJ2yBQs-Tz3MYtbO9phDcJff6kKEC7II6K-BP1YKIzELFqPca_mzACzs0VSXkLtFULw5R2hxvTNh1kIbLBkTPSvNgd5P6V9iPabenV8V3v6Yi7dU20ruA4QLg2DPkId3EI5x30yJFbRYumWRBbzBZGz6zLNVf3kE7NalsZNFGXYTze5nq6OChyTiZQMKfesTRz-R9xJIx8eoCH8gFhMlVlvG4-9ua_Ob1mtQRpX6ZjR8_DYxNu6MMHEF_h8qgmeg
```

**Usage in Requests:**
Your requests should have this in the Authorization header:
```
Authorization: Bearer {{firebase_token}}
```

---

### Method 2: Environment Variable

This method sets the token for all collections using the same environment.

**Steps:**

1. **Click the environment dropdown** (top right corner)

2. **Select your environment** or click "+" to create a new one

3. **Add or edit the variable:**
   - Variable: `firebase_token`
   - Type: `default`
   - Initial Value: (leave empty)
   - Current Value: `<paste-your-token-here>`

4. **Save the environment**

5. **Make sure the environment is selected** in the dropdown

**When to use:**
- When testing across multiple collections
- When sharing environment with team members

---

### Method 3: Direct Header (Not Recommended)

Only use this for one-off testing.

**Steps:**

1. Open your request
2. Go to **Headers** tab
3. Add a new header:
   - Key: `Authorization`
   - Value: `Bearer <paste-token-here>`

**Drawback:** You have to update every request manually when the token expires.

---

## 🎯 Testing Different Roles

### Customer Endpoints
```bash
# Generate token
node scripts/firebase-token-gen.js

# Use token from: test-customer-001.idToken
# Test endpoints like:
# - GET /api/customer/profile
# - POST /api/customer/bookings
# - GET /api/customer/shops
```

### Barber Endpoints
```bash
# Generate token
node scripts/firebase-token-gen.js

# Use token from: test-barber-001.idToken
# Test endpoints like:
# - GET /api/barber/profile
# - POST /api/barber/services
# - GET /api/barber/bookings
```

---

## 🔄 Token Refresh Workflow

Firebase ID tokens expire after **1 hour**.

**When you see authentication errors:**

1. **Re-generate tokens:**
   ```bash
   node scripts/firebase-token-gen.js
   ```

2. **Copy the new token** from `test-tokens.json`

3. **Update Postman variable** (same steps as setup)

4. **Continue testing**

**Pro Tip:** Keep the terminal open and re-run the script every hour during active testing.

---

## ✅ Verify Your Setup

### Test 1: Check Variable
1. Open any request in your collection
2. Hover over `{{firebase_token}}` in the Authorization header
3. You should see the token value (not "undefined")

### Test 2: Send Request
1. Send a protected endpoint request (e.g., GET /api/customer/profile)
2. ✅ Success (200): Token is working
3. ❌ 401 Unauthorized: Token is invalid or expired

### Test 3: Verify Token Programmatically
```bash
node scripts/verify-token.js
```

---

## 🐛 Troubleshooting

### Problem: "No token provided"
**Solution:** Check that your request has the Authorization header:
```
Authorization: Bearer {{firebase_token}}
```

### Problem: "Invalid or expired token"
**Solutions:**
1. Token expired (1 hour limit) → Re-generate
2. Wrong token format → Should start with "eyJ..."
3. Missing "Bearer " prefix → Check header format

### Problem: "{{firebase_token}} is not defined"
**Solutions:**
1. Variable not set → Follow setup steps above
2. Wrong variable name → Check spelling
3. Environment not selected → Select environment in dropdown

### Problem: "Forbidden" or "Insufficient permissions"
**Solutions:**
1. Using customer token on barber endpoint → Use correct role token
2. User not in database → Check MongoDB for test users
3. Custom claims not set → Re-run token generator

---

## 📋 Token Information

### Token Structure
```
eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjMjdhZmY1YzlkNGU1MzVkNWRjMmMwNWM1YTE2N2FlMmY1NjgxYzIiLCJ0eXAiOiJKV1QifQ
.
eyJuYW1lIjoiVGVzdCBDdXN0b21lciIsInJvbGUiOiJDVVNUT01FUiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ldmVyY3V0LWF1dGgiLCJhdWQiOiJldmVyY3V0LWF1dGgiLCJhdXRoX3RpbWUiOjE3NzE5Mzc0NjcsInVzZXJfaWQiOiJ0ZXN0LWN1c3RvbWVyLTAwMSIsInN1YiI6InRlc3QtY3VzdG9tZXItMDAxIiwiaWF0IjoxNzcxOTM3NDY3LCJleHAiOjE3NzE5NDEwNjcsImVtYWlsIjoidGVzdC5jdXN0b21lckBleGFtcGxlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXIiOiIrMTU1NTAwMDAwMDEiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInRlc3QuY3VzdG9tZXJAZXhhbXBsZS5jb20iXSwicGhvbmUiOlsiKzE1NTUwMDAwMDAxIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19
.
TUgqlo3VCI0tsOBxhKPqLwbaggd12iyVEOLJVruNEMLWH8GX7os4uMaPtSAnAYGY0XVc9TGl8CxYEffpV5OGbADJ2yBQs-Tz3MYtbO9phDcJff6kKEC7II6K-BP1YKIzELFqPca_mzACzs0VSXkLtFULw5R2hxvTNh1kIbLBkTPSvNgd5P6V9iPabenV8V3v6Yi7dU20ruA4QLg2DPkId3EI5x30yJFbRYumWRBbzBZGz6zLNVf3kE7NalsZNFGXYTze5nq6OChyTiZQMKfesTRz-R9xJIx8eoCH8gFhMlVlvG4-9ua_Ob1mtQRpX6ZjR8_DYxNu6MMHEF_h8qgmeg
```

**Parts:**
1. **Header** (algorithm, key ID)
2. **Payload** (user data, claims, expiration)
3. **Signature** (verification)

### Decode Token (Optional)
Visit [jwt.io](https://jwt.io) and paste your token to see the decoded content.

**You'll see:**
```json
{
  "name": "Test Customer",
  "role": "CUSTOMER",
  "user_id": "test-customer-001",
  "email": "test.customer@example.com",
  "phone_number": "+15550000001",
  "exp": 1771941067,
  "iat": 1771937467
}
```

---

## 🎓 Best Practices

1. ✅ **Use collection variables** for tokens (not environment unless shared)
2. ✅ **Regenerate tokens** when they expire (every hour)
3. ✅ **Use correct role tokens** for each endpoint
4. ✅ **Keep tokens in .gitignore** (never commit)
5. ✅ **Test token validity** with verify-token.js before debugging
6. ✅ **Document your collections** with example tokens in descriptions

---

## 📞 Need Help?

1. **Check token validity:**
   ```bash
   node scripts/verify-token.js
   ```

2. **Check authentication middleware:**
   ```
   src/middleware/authenticate.middleware.js
   ```

3. **Review token generator:**
   ```bash
   node scripts/firebase-token-gen.js
   ```

4. **Check Firebase console:**
   - Verify test users exist
   - Check custom claims are set

---

## 🎉 You're Ready!

Your Postman is now configured for EverCut API testing. Happy testing! 🚀
