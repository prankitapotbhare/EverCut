# Firebase Token Generator — Approach & Rationale

## Why neither original script is ideal

| Issue | Script 1 | Script 2 |
|---|---|---|
| Creates real Firebase Auth users | ✗ No | ✓ Yes |
| Sets claims on Auth record (persistent) | ✗ No | ✓ Yes |
| Avoids code duplication | ✗ Duplicated per user | ✗ Duplicated per user |
| JSON loaded safely | ✗ `createRequire` (fragile) | ✗ `createRequire` (fragile) |
| Structured output | ✗ Plain `.txt` file | ✗ Plain `.txt` file |
| Configurable user list | ✗ Hard-coded inline | ✗ Hard-coded inline |
| Clean separation of concerns | ✗ Mixed | ✗ Mixed |

**Script 1** is the weakest: it never creates users in Firebase Auth, so any backend call that looks up the user record (`getUser`, `listUsers`, etc.) will fail. The tokens are real but the users aren't.

**Script 2** is the right idea but the implementation is repetitive — the customer and barber blocks are copy-pasted with minor changes, making it error-prone and hard to extend.

---

## How the optimal script works

### The token flow (why each step is necessary)

```
Firebase Admin SDK
      │
      │  createCustomToken(uid)
      ▼
  Custom Token  ──────────────────────────────────┐
  (signed by your service account)                │
                                                  │ POST /accounts:signInWithCustomToken
                                                  ▼
                                         Firebase REST API
                                                  │
                                                  │ returns
                                                  ▼
                                            ID Token  ◄── this is what your backend verifies
```

- **Custom tokens** are created by your server (Admin SDK). They prove *your server* vouches for a UID, but they're **not** what `verifyIdToken()` accepts.
- **ID tokens** are issued by Firebase itself after it trusts the custom token. These are standard JWTs your backend can verify cryptographically.
- In production, the mobile app does this exchange automatically during login. This script replicates that exchange for testing.

### Key design decisions

#### 1. `upsertUser` — idempotent user creation
The script checks whether a user already exists before creating one. Re-running the script will not fail or create duplicates. This mirrors how you'd handle this in production.

#### 2. `setCustomUserClaims` — claims on the Auth record, not just the token
Script 1 only embedded claims in the custom token payload. Script 2 correctly also calls `setCustomUserClaims`, which attaches claims to the **Firebase Auth user record**. This means:
- Every future token the user receives automatically includes those claims
- Your backend can read them via `decodedToken.role` without relying on the client sending them

#### 3. `TEST_USERS` array — single place to manage users
All test user definitions live in one array at the top of the file. To add a new role (e.g., `ADMIN`), you add one object. No copy-pasting, no risk of forgetting to update one of three places.

#### 4. `readFileSync` + `JSON.parse` instead of `createRequire`
The `createRequire` pattern for loading JSON is a workaround that adds an unnecessary abstraction. `readFileSync` + `JSON.parse` is direct, readable, and doesn't depend on module system quirks.

#### 5. Structured JSON output (`test-tokens.json`)
Plain `.txt` files are hard to parse programmatically. The output is valid JSON, so other scripts, CI jobs, or Postman pre-request scripts can consume the tokens directly:
```js
// In a Postman pre-request script
const tokens = JSON.parse(pm.environment.get('savedTokens'));
pm.variables.set('firebase_token', tokens['test-customer-001'].idToken);
```

---

## Setup checklist

```
1. Place firebase-admin-sdk.json in the project root
   └── Firebase Console → Project Settings → Service Accounts → Generate New Private Key

2. Add to .env:
   FIREBASE_API_KEY=AIza...
   └── Firebase Console → Project Settings → General → Web API Key

3. Add to .gitignore:
   firebase-admin-sdk.json
   scripts/test-tokens.json

4. Run:
   node scripts/firebase-token-gen.js
```

---

## Extending the script

To add a new test user, add one entry to `TEST_USERS`:

```js
{
  uid: 'test-admin-001',
  email: 'test.admin@example.com',
  phoneNumber: '+15550000003',
  displayName: 'Test Admin',
  claims: { role: 'ADMIN' },
},
```

That's it. No other changes needed.
