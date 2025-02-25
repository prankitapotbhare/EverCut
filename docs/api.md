# EverCut API Documentation

## Authentication Endpoints

### 1. Sign Up
**POST** `/api/auth/signup`

Request Body:
```json
{
  "name": "string",
  "location": "string",
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "location": "string"
  }
}
```

### 2. Login
**POST** `/api/auth/login`

Request Body:
```json
{
  "email": "string",
  "password": "string",
  "remember": "boolean"
}
```

Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "location": "string"
  }
}
```

### 3. Google OAuth
**POST** `/api/auth/google`

Request Body:
```json
{
  "token": "string" // Google OAuth token
}
```

Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "location": "string"
  }
}
```

### 4. Forgot Password
**POST** `/api/auth/forgot-password`

Request Body:
```json
{
  "email": "string"
}
```

Response:
```json
{
  "message": "Password reset email sent"
}
```

### Error Responses
All endpoints may return the following error responses:

```json
{
  "error": "string",
  "message": "string"
}
```
