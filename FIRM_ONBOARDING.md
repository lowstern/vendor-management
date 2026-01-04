# Firm Onboarding Guide

## How to Enable Your Firm on the Vendor Management Platform

This guide helps other data firms and companies set up their own instance of the Vendor Management Portal.

## Quick Start

1. **Create an Account**
   - Visit the login page
   - Click "Set up your firm" at the bottom
   - Follow the setup wizard

2. **Complete Firm Setup**
   - Enter your firm's information
   - Configure security settings (optional Duo 2FA)
   - Create your admin account

3. **Start Using**
   - Access your firm's portal
   - Upload vendor data
   - Manage contracts

## Step-by-Step Setup

### Step 1: Firm Information

- **Firm Name**: Your company's official name
- **Subdomain**: Choose a unique subdomain (e.g., `acme` → `acme.vendormgmt.com`)
- **Industry**: Your company's primary industry

### Step 2: Enable Features

- **Vendor Cost Portal (VCP)**: Allow vendors to submit cost information
- **Duo 2FA**: Enable two-factor authentication for enhanced security

### Step 3: Duo Security (Optional)

If enabling Duo:

1. Sign up for Duo Security account
2. Create a Web SDK application
3. Get your credentials:
   - Integration Key
   - Secret Key
   - API Hostname
4. Enter these during setup

See [DUO_SETUP.md](./DUO_SETUP.md) for detailed instructions.

### Step 4: Admin Account

Create your admin account:
- Email address
- Full name
- Strong password (uppercase, lowercase, number, special character)

## After Setup

### Access Your Portal

Your firm portal will be available at:
```
https://your-subdomain.vendormgmt.com
```

### Next Steps

1. **Invite Users**: Add team members to your firm
2. **Configure Settings**: Adjust portal settings and permissions
3. **Upload Data**: Start adding vendor information
4. **Customize**: Add your logo and branding (future feature)

## Features Available

### Vendor Cost Portal (VCP)

- **Public Submission**: Vendors can submit cost data
- **Approval Workflow**: Review and approve submissions
- **Document Management**: Upload contracts and agreements

### Dashboard

- **Real-Time Analytics**: View spending metrics
- **Quick Actions**: Fast access to common tasks
- **Alerts**: Important notifications

### Contract Management

- **Upload Contracts**: SOWs, SLAs, and agreements
- **Track Spending**: Monitor vendor costs
- **Document Storage**: Secure file management

## Security Features

- **Authentication**: Secure login system
- **2FA**: Optional Duo Security integration
- **Role-Based Access**: Control who can see what
- **Data Encryption**: Sensitive data encrypted
- **Secure File Uploads**: Validated and sanitized

## Support

For setup assistance or questions:
- Review documentation in `/docs`
- Check [DUO_SETUP.md](./DUO_SETUP.md) for Duo-specific help
- Contact your platform administrator

## Production Deployment

### For Self-Hosted Firms

1. **Backend Setup**: Deploy backend API
2. **Database**: Set up PostgreSQL/MySQL database
3. **Storage**: Configure cloud storage (S3, Azure Blob)
4. **Environment Variables**: Configure all secrets
5. **SSL Certificate**: Enable HTTPS
6. **Domain**: Point your domain to the deployment

### For Managed Service

If using the managed service:
- Firm setup is handled automatically
- You'll receive portal access credentials
- Support team assists with configuration

## Best Practices

1. **Security**
   - Enable 2FA for all admin accounts
   - Use strong, unique passwords
   - Regularly review user access

2. **Data Management**
   - Regularly update vendor information
   - Review and approve submissions promptly
   - Archive old contracts

3. **User Management**
   - Assign appropriate roles
   - Remove inactive users
   - Train users on platform features

## Troubleshooting

### Can't Access Portal

- Verify subdomain is correct
- Check admin credentials
- Ensure account is active

### Duo Authentication Issues

- Verify Duo credentials are correct
- Check users are enrolled in Duo
- Review [DUO_SETUP.md](./DUO_SETUP.md)

### Submission Not Appearing

- Check approval workflow settings
- Verify user has submission permissions
- Review submission status in portal

## Additional Resources

- [Security Documentation](./SECURITY.md)
- [Duo Setup Guide](./DUO_SETUP.md)
- [API Documentation](./API.md) (if available)

