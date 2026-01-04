# Vendor Management - Swipe Application

A modern vendor management software with a swiping interface similar to dating apps. Review companies and their spending on SaaS, lawyers, and consultants.

## Features

- 🔄 **Swipe Interface**: Swipe left to reject, right to accept vendors
- 💰 **Spending Analytics**: View detailed spending breakdowns for each company
- 📊 **Visual Progress**: See spending percentages and visual bars
- ✨ **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Touch & Mouse Support**: Works on both desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations and gestures

## Project Structure

```
src/
  ├── components/
  │   ├── SwipeableCard.tsx    # Swipeable card component with gesture detection
  │   └── CompanyCard.tsx       # Company information display
  ├── data/
  │   └── mockCompanies.ts      # Sample company data
  ├── types.ts                  # TypeScript type definitions
  ├── utils/
  │   └── formatCurrency.ts     # Currency formatting utilities
  ├── App.tsx                   # Main application component
  └── main.tsx                  # Application entry point
```

## Usage

1. Swipe cards left (or click ✗) to reject a vendor
2. Swipe cards right (or click ✓) to accept a vendor
3. View spending breakdowns for SaaS, Legal Services, and Consultants
4. Track your progress with the stats counter

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Hosting Options

This application can be deployed to various hosting platforms. Here are the best options:

### 🚀 Vercel (Recommended - Easiest)

**Free Tier Available** - Perfect for getting started

1. **Option A: Via GitHub (Recommended)**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" and import your GitHub repository
   - Vercel will automatically detect Vite and deploy
   - Future pushes to main branch auto-deploy

2. **Option B: Via CLI**
   ```bash
   npm i -g vercel
   vercel
   ```
   Follow the prompts to deploy

**Benefits:**
- Free SSL certificate
- Global CDN
- Automatic deployments
- Custom domain support

### 🌐 Netlify

**Free Tier Available**

1. **Via GitHub:**
   - Push code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Connect repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Via CLI:**
   ```bash
   npm i -g netlify-cli
   npm run build
   netlify deploy --prod --dir=dist
   ```

### ☁️ AWS (Advanced)

- **AWS Amplify** - Connect GitHub, automatic builds
- **AWS S3 + CloudFront** - Upload `dist` folder to S3 bucket
- **AWS EC2** - Full server control

### 📦 Other Options

- **GitHub Pages** - Free for public repos
- **Firebase Hosting** - Google's hosting platform
- **Render** - Simple static site hosting
- **Railway** - Modern deployment platform

## Security Features 🔒

This application includes comprehensive security features:

- **Authentication**: Secure login and signup with password validation
- **Authorization**: Role-based access control (Admin, User, Viewer)
- **Protected Routes**: All sensitive pages require authentication
- **Input Validation**: All user inputs are validated and sanitized
- **File Upload Security**: Secure file validation, type checking, and size limits
- **Data Encryption**: Sensitive data encrypted in local storage
- **XSS Protection**: Input sanitization prevents cross-site scripting attacks

### Default Credentials
- **Email**: admin@example.com
- **Password**: admin123

⚠️ **Important**: Change default credentials before deploying to production!

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

## Features Overview

### 🔐 Multi-Tenant & Security

- **Duo 2FA Integration**: **Optional** two-factor authentication with Duo Security
  - ✅ **Platform works WITHOUT Duo** - standard email/password login available
  - ⚙️ **Enable/Disable Anytime** - Toggle Duo 2FA in Firm Settings
  - 🔒 **Enhanced Security** - Enable Duo for extra protection when needed
- **Firm Setup**: Easy onboarding for new firms/companies
- **Multi-Tenant Architecture**: Each firm has its own portal and settings
- **Role-Based Access**: Admin, User, and Viewer roles

### 📊 Vendor Cost Portal (VCP)

- **Firm Portal**: Each firm can have its own VCP portal
- **Vendor Data Submission**: Firms can submit vendor cost information
- **Approval Workflow**: Review and approve vendor submissions
- **Public/Private Access**: Control who can view the portal

### 🎯 Company Dashboards

- **Real-Time Analytics**: View spending breakdowns and metrics
- **Quick Actions**: Fast access to common tasks
- **Activity Tracking**: Monitor recent changes and updates
- **Alerts & Notifications**: Stay informed about important events

### 📄 Contract Management Portal

- **Consultant Details**: Click on the Consultants section to view:
  - Individual consultant profiles
  - Work descriptions and deliverables
  - Results and impact metrics
  - Contract periods and costs

- **SaaS Products**: Click on the SaaS Software section to view:
  - Individual SaaS product details
  - Internal usage assessment questions
  - License utilization
  - Contract information

- **Legal Services**: Click on the Legal Services section to view:
  - Individual legal cases
  - Case descriptions and status
  - Law firm information
  - Case documents and contracts

- **Contract Upload**: Click "Manage Contracts" button to:
  - Upload new contracts manually
  - Upload SOWs (Statements of Work) from consultants
  - Upload SLA agreements with vendors
  - View all contracts and documents in one place
  - Drag-and-drop file upload support

### Navigation

- Swipe left/right or use buttons to accept/reject companies
- Click on "Consultants" or "SaaS Software" sections to view detailed information
- Use "Back" buttons to return to the main swipe interface

## License

MIT

