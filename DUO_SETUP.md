# Duo Security 2FA Setup Guide

## Overview

This application supports Duo Security two-factor authentication (2FA) for enhanced security. This guide explains how to set up Duo for your firm.

## Prerequisites

1. A Duo Security account (sign up at https://duo.com)
2. Admin access to your Duo Admin Panel
3. A Duo application created for your vendor management portal

## Step 1: Create a Duo Application

1. Log in to your Duo Admin Panel
2. Navigate to **Applications** → **Protect an Application**
3. Select **Web SDK** as the application type
4. Give your application a name (e.g., "Vendor Management Portal")
5. Click **Protect Application**
6. Note down the following credentials:
   - **Integration Key** (starts with `DI...`)
   - **Secret Key** (long random string)
   - **API Hostname** (e.g., `api-xxxxx.duosecurity.com`)

## Step 2: Enable Duo in Firm Setup

1. During firm setup, check **"Enable Duo Two-Factor Authentication"**
2. Enter the three credentials from Step 1:
   - Integration Key
   - Secret Key
   - API Hostname
3. Complete the setup process

## Step 3: Enroll Users

After Duo is enabled:

1. Users will be prompted for Duo authentication on login
2. They can enroll their devices during the first login
3. Options include:
   - **Duo Mobile App** (recommended): Push notifications
   - **SMS**: Text message passcodes
   - **Phone Call**: Voice call authentication
   - **Hardware Token**: Physical security keys

## Step 4: User Authentication Flow

When Duo is enabled:

1. User enters email and password
2. After successful password authentication, Duo widget appears
3. User authenticates with their Duo device
4. Once verified, access is granted

## Production Implementation Notes

### Current Implementation

The current implementation uses a **mock Duo service** for development. In production, you need to:

1. **Install Duo Web SDK**:
   ```bash
   npm install @duosecurity/duo_web
   ```

2. **Update `src/services/duoService.ts`**:
   - Replace mock implementation with actual Duo Web SDK calls
   - Use `duoWeb.signRequest()` for authentication initiation
   - Use `duoWeb.verifyResponse()` for response verification

3. **Security Considerations**:
   - Store Duo credentials securely (environment variables)
   - Never expose Secret Key in client-side code
   - Use backend API to handle Duo authentication server-side
   - Implement proper error handling and logging

### Recommended Architecture

```
Client → Backend API → Duo API
         ↓
    JWT Token + Duo Sig
         ↓
    Client (Authenticated)
```

**Why?**
- Secret keys should never be exposed to the client
- All Duo API calls should happen server-side
- Client only receives signed responses

## Example Backend Implementation

```javascript
// Backend API endpoint
app.post('/api/auth/duo/initiate', async (req, res) => {
  const { username } = req.body;
  
  // Generate Duo authentication request
  const sigRequest = duoWeb.signRequest(
    process.env.DUO_INTEGRATION_KEY,
    process.env.DUO_SECRET_KEY,
    process.env.DUO_API_HOSTNAME,
    username
  );
  
  res.json({ sigRequest });
});

app.post('/api/auth/duo/verify', async (req, res) => {
  const { sigResponse } = req.body;
  
  // Verify Duo response
  const authenticatedUser = duoWeb.verifyResponse(
    process.env.DUO_INTEGRATION_KEY,
    process.env.DUO_SECRET_KEY,
    sigResponse
  );
  
  if (authenticatedUser) {
    // Issue JWT token
    const token = generateJWT(authenticatedUser);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Duo verification failed' });
  }
});
```

## Troubleshooting

### Users Can't Authenticate

- Check Duo credentials are correct
- Verify users are enrolled in Duo
- Check Duo Admin Panel for blocked users
- Review application logs for errors

### Duo Widget Not Loading

- Verify API hostname is correct
- Check CORS settings in Duo Admin Panel
- Ensure HTTPS is used (required for Duo)

### Integration Key Invalid

- Verify the Integration Key format
- Check application status in Duo Admin Panel
- Ensure application is not deleted or disabled

## Security Best Practices

1. **Rotate Secret Keys**: Regularly rotate Duo secret keys
2. **Monitor Logs**: Review Duo authentication logs for suspicious activity
3. **User Training**: Educate users on Duo best practices
4. **Backup Codes**: Provide backup authentication methods
5. **Device Management**: Regularly review enrolled devices in Duo Admin Panel

## Support

- Duo Documentation: https://duo.com/docs
- Duo Support: https://help.duo.com
- Application Issues: Contact your system administrator

## Additional Resources

- [Duo Web SDK Documentation](https://duo.com/docs/duoweb)
- [Duo Authentication API](https://duo.com/docs/authapi)
- [Duo Admin Panel Guide](https://duo.com/docs/admin)

