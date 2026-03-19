# JWT Authentication & Role-Based Authorization Integration

## Summary of Changes

This document outlines all the changes made to the frontend application to integrate JWT-based authentication and role-based authorization based on the backend middleware specifications.

---

## New Files Created

### 1. **[src/api/auth.ts](src/api/auth.ts)** - Authentication API

Handles login requests and token management:

- `login(username: string, password: string)` - Sends login request to `/api/auth/signin`
- `getAuthHeader()` - Returns Authorization header with Bearer token from localStorage
- Interfaces for `LoginResponse` and `User`

### 2. **[src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)** - Auth Context

Global state management for authentication:

- Provides `AuthContext` with user, token, and auth methods
- `AuthProvider` component that wraps the app
- Methods: `login()`, `logout()`, token/user persistence in localStorage

### 3. **[src/hooks/useAuth.ts](src/hooks/useAuth.ts)** - useAuth Hook

Custom hook to access auth context anywhere in the app:

- Returns `AuthContextType` with user, token, isAuthenticated, etc.
- Used throughout components for role-based logic

### 4. **[src/hooks/useLogin.ts](src/hooks/useLogin.ts)** - useLogin Hook

React Query mutation for login:

- Handles login API call and error handling
- Stores token and user in context
- Redirects to home page on success

### 5. **[src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)** - Route Protection

Route guard component:

- Redirects unauthenticated users to `/login`
- Checks role-based access and shows "Access Denied" if insufficient permissions
- Shows loading state while checking authentication

---

## Modified Files

### 1. **[src/App.tsx](src/App.tsx)** - App Entry Point

Changes:

- Wrapped entire app with `<AuthProvider>`
- Protected `/` route with `<ProtectedRoute>`
- All routes now check authentication

### 2. **[src/api/slip.ts](src/api/slip.ts)** - API Functions

Changes:

- Added auth headers to all API calls:
  - `createSlip()` - POST (uses `getAuthHeader()`)
  - `getPurchaseSlips()` - GET (uses `getAuthHeader()`)
  - `updatePurchaseSlip()` - PUT (uses `getAuthHeader()`)

### 3. **[src/hooks/useDeletePurchaseSlip.ts](src/hooks/useDeletePurchaseSlip.ts)** - Delete Hook

Changes:

- Added auth headers to DELETE request
- Token automatically included in all delete operations

### 4. **[src/pages/LoginPage.tsx](src/pages/LoginPage.tsx)** - Login Page

Changes:

- Integrated `useLogin()` hook for actual login functionality
- Changed field name from "userId" to "username" (matches backend)
- Added error handling and display
- Added loading state ("LOGGING IN..." button text)

### 5. **[src/components/common/Header.tsx](src/components/common/Header.tsx)** - Header Component

Changes:

- Added `useAuth()` hook to access current user
- Displays actual user name and role from context
- Implemented logout functionality
- Logout button clears token and redirects to login

### 6. **[src/pages/InventoryRegister.tsx](src/pages/InventoryRegister.tsx)** - Inventory Page

Changes:

- Added role-based access: Only PURCHASER and ADMIN can create slips
- Create slip button (floating button) only shows for authorized roles
- Prevents unauthorized users from creating slips

### 7. **[src/components/inventoryTable/InventoryDetailsDialog.tsx](src/components/inventoryTable/InventoryDetailsDialog.tsx)** - Details Panel

Changes:

- Added `useAuth()` hook
- Delete button only visible to ADMIN users
- Only ADMIN can delete purchase slips

### 8. **[src/components/inventoryTable/tableColumn.tsx](src/components/inventoryTable/tableColumn.tsx)** - Table Columns

Changes:

- Status dropdown now role-aware:
  - **SUPERVISOR**: Can change status to PENDING, CONFIRMED, PAYMENT_PENDING
  - **ADMIN**: Can change to any status
  - **PURCHASER/FINANCER**: Cannot change status (button disabled)
- Dropdown is disabled for users without permission

---

## Authentication Flow

### Login Process

```
1. User enters username and password on LoginPage
2. useLogin() hook calls login() from auth.ts
3. Backend returns token and user info
4. Token and user stored in localStorage
5. AuthContext updated with user and token
6. User redirected to home page
```

### Protected Routes

```
1. User navigates to protected route
2. ProtectedRoute component checks isAuthenticated
3. If not authenticated → redirect to /login
4. If authenticated but role insufficient → show "Access Denied"
5. Otherwise → render component
```

### API Requests

```
1. All API calls use getAuthHeader() to attach Bearer token
2. Token from localStorage added to Authorization header
3. Backend middleware verifies token and role
4. If invalid/expired → 401 Unauthorized
5. If insufficient permissions → 403 Forbidden
```

---

## Token Structure

JWT tokens contain:

```javascript
{
  id: number,        // User ID
  role: string,      // PURCHASER | SUPERVISOR | FINANCER | ADMIN
  iat: number,       // Issued at timestamp
  exp: number        // Expires in 7 days
}
```

---

## Role-Based Access Control

### PURCHASER

- ✅ Create purchase slips (/api/purchase-slips POST)
- ✅ View own purchase slips (/api/purchase-slips GET - auto-filtered)
- ❌ Cannot delete slips
- ❌ Cannot change status

### SUPERVISOR

- ✅ View all purchase slips
- ✅ Change status (PENDING → CONFIRMED → PAYMENT_PENDING)
- ✅ Update/confirm purchase slips
- ❌ Cannot delete slips
- ❌ Cannot mark as PAYMENT_DONE

### FINANCER

- ⏳ Payment routes not yet implemented (placeholder for future)

### ADMIN

- ✅ Full access to all operations
- ✅ Delete purchase slips
- ✅ Change any status including PAYMENT_DONE
- ✅ User management (GET/POST/PUT/DELETE /api/users)

---

## LocalStorage

The app stores authentication data in localStorage:

```javascript
localStorage.getItem("token"); // JWT token
localStorage.getItem("user"); // Stringified user object
```

These are cleared on logout.

---

## Error Handling

### 401 Unauthorized

- Token missing, invalid, or expired
- Automatically handled by API calls
- Backend returns redirect to `/login`

### 403 Forbidden

- User lacks required role
- Backend explicitly denies access
- Error message shown: "Access denied. Required roles: ..."

### Network/Other Errors

- Caught in try-catch blocks
- Console logged for debugging
- User-friendly error messages shown where applicable

---

## Usage Examples

### Test Login

```bash
curl -X POST http://localhost:5001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username": "akash", "password": "password123"}'
```

Response includes `token` which is automatically stored and used for subsequent requests.

### Create Slip (Requires Token)

Token is automatically added by `getAuthHeader()`:

```javascript
const res = await fetch("http://localhost:5001/api/purchase-slips", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...getAuthHeader(), // Adds: Authorization: Bearer <token>
  },
  body: JSON.stringify(data),
});
```

---

## Next Steps (Optional Enhancements)

1. **Token Refresh** - Implement automatic token refresh before expiration
2. **Session Timeout** - Add UI notification when token is about to expire
3. **Request Interceptor** - Create a centralized request interceptor (optional, current approach works)
4. **Role-Based Routes** - Add more route-level guards for future pages
5. **Payment Routes** - Implement FINANCER endpoints when ready
6. **Persistent Login** - Consider auto-login on page refresh (already implemented via localStorage)

---

## Build Status

✅ Successfully compiles with no TypeScript errors
✅ All authentication flows working
✅ Role-based access controls implemented
✅ Route protection in place

---

## Environment Variables

Make sure backend `.env` has:

```
JWT_SECRET=your_secret_key_here
```

Frontend uses `http://localhost:5001` as the API base URL (hardcoded, can be moved to `.env` if needed).
