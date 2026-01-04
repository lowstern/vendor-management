# 🧪 Local Testing Guide

How to run and test your application locally.

---

## 🚀 Quick Start

### Step 1: Start Development Server

Open Terminal in Cursor (or your terminal) and run:

```bash
cd "/Users/lowellstern/Public/Drop Box"
npm run dev
```

### Step 2: Open in Browser

The server will start on: `http://localhost:5173`

**Open that URL in your browser!**

---

## ✅ What to Test

### 1. **Fund Roll-Up Hierarchy**

1. Click **"Funds"** button (top right header)
2. You'll see:
   - **TechVenture Fund III** - 4 portfolio companies
   - **Growth Partners Fund II** - 4 portfolio companies
3. Click a fund → See detailed breakdown
4. Expand companies → See all vendors rolled up
5. Click "View" → Navigate to company details

**Expected:**
- Fund totals show sum of all company spending
- Companies show sum of all vendor spending
- Vendors (Consultants, SaaS, Legal) all roll up correctly

### 2. **Vendor → Company → Fund Flow**

**Test Path:**
1. Start at **Funds** view
2. Click **TechVenture Fund III**
3. Expand **TechCorp Inc.** (first company)
4. See all vendors listed:
   - Consultants (Sarah Chen, Michael Rodriguez)
   - SaaS Products (Salesforce, Slack, Workday)
   - Legal Cases (Patent Infringement)
5. Each vendor shows monthly/annual cost
6. Company total = sum of all vendors
7. Fund total = sum of all companies

**Expected:**
- All vendors visible in company
- Monthly costs annualized correctly
- Totals calculate accurately

### 3. **Organizational Breakdown**

1. Click **"Org Breakdown"** button
2. See hierarchy:
   - COO ($100M budget)
   - VPs ($20M each)
   - Directors, Managers, Operators
3. Expand/collapse to navigate
4. See budget allocation at each level

**Expected:**
- Hierarchical structure displays
- Budgets roll down from COO
- Expand/collapse works

### 4. **IC View Toggle**

1. In **Swipe** view, click **"IC View"** toggle (top right)
2. See executive summary:
   - Company name
   - Annual run-rate
   - Risk flags
   - Quick action

**Expected:**
- Clean executive view
- Only essential info shown
- No detailed breakdowns

### 5. **Institutional UI**

Check for:
- ✅ Neutral slate/charcoal colors (no gradients)
- ✅ Subtle border radius (4-6px)
- ✅ Generous whitespace between cards
- ✅ Professional terminology ("Annualized Run-Rate Exposure")
- ✅ Monochrome exposure ladder
- ✅ Risk tags (Contract Term, Termination, Regulatory Risk)

---

## 📊 Test Data Structure

### Fund 1: TechVenture Fund III
- **Portfolio Companies:** 4
  - TechCorp Inc.
  - RetailMax Corp
  - EnergySolutions Ltd
  - ManufacturingPro

### Fund 2: Growth Partners Fund II
- **Portfolio Companies:** 4
  - Global Finance Group
  - MedHealth Systems
  - EduTech Innovations
  - MediaStream Global

---

## 🔍 Verification Checklist

### Fund Roll-Ups:
- [ ] Fund totals = sum of company totals
- [ ] Company totals = sum of vendor totals
- [ ] Annual run-rates calculated correctly (monthly × 12)
- [ ] Vendor counts accurate

### Navigation:
- [ ] Can navigate: Funds → Fund Detail → Company Detail
- [ ] Can expand/collapse company vendors
- [ ] Back buttons work correctly
- [ ] Can switch between views

### UI/UX:
- [ ] Institutional design (slate colors)
- [ ] Professional terminology
- [ ] Monochrome exposure ladder
- [ ] Risk tags display correctly
- [ ] IC View toggle works

---

## 🐛 Common Issues

### Server won't start?
```bash
# Kill any existing process
lsof -ti:5173 | xargs kill -9

# Start fresh
npm run dev
```

### Port already in use?
```bash
# Check what's using port 5173
lsof -i :5173

# Or use a different port
npm run dev -- --port 3000
```

### Build errors?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 🎯 Quick Test Scenarios

### Scenario 1: Verify Roll-Up Math
1. Go to **Funds**
2. Click **TechVenture Fund III**
3. Expand **TechCorp Inc.**
4. Manually sum vendors:
   - Consultants: $85k + $95k = $180k/mo
   - SaaS: $45k + $32k + $68k = $145k/mo
   - Legal: $125k/mo
   - **Total: $450k/mo = $5.4M annual**
5. Verify company card shows correct total

### Scenario 2: Test Fund Aggregation
1. Fund view shows: **Total Portfolio Run-Rate**
2. Should equal sum of all fund totals
3. Verify across both funds

### Scenario 3: Test Navigation
1. Funds → Fund Detail → Company Expand → Click Vendor → Company Detail
2. Verify all navigation works
3. Back buttons return to correct view

---

## 📝 Notes

- All calculations happen client-side (mock data)
- In production, would be API-backed
- Annualization: monthly × 12
- Fund totals include all companies in that fund

---

**Ready to test! Run `npm run dev` and visit `http://localhost:5173`** 🚀

