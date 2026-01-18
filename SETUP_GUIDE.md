# ResQ - Complete Setup Guide

## Prerequisites

Before starting, make sure you have installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (v6 or higher)
   - **Option A - Local Installation:**
     - Windows: Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
     - Install and start the service: `net start MongoDB`
   
   - **Option B - MongoDB Atlas (Recommended for beginners):**
     - Create free account at https://www.mongodb.com/cloud/atlas
     - Create a cluster (free tier available)
     - Get connection string
     - Update `.env` with your connection string

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

---

## 🚀 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

All dependencies are already installed! But if needed:

```bash
npm install
```

### Step 3: Configure Environment

The `.env` file is already created with default values. Review and update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resq
JWT_SECRET=resq_secret_key_change_this_in_production_2025
FRONTEND_URL=http://localhost:5173
```

**If using MongoDB Atlas:**
- Replace `MONGODB_URI` with your Atlas connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/resq`

### Step 4: Start MongoDB (if using local installation)

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Step 5: Create Admin User

```bash
npm run create-admin
```

This creates an admin user:
- **Email:** admin@resq.com
- **Password:** admin123

⚠️ **IMPORTANT:** Change this password after first login!

### Step 6: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📡 API Base URL: http://localhost:5000/api
```

### Step 7: Test the API

Open a browser and visit:
- **Health Check:** http://localhost:5000/health
- **API Info:** http://localhost:5000/

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-18T...",
  "database": "connected"
}
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new terminal** and navigate to frontend:

```bash
cd frontend/ResQ
```

### Step 2: Install Dependencies

Dependencies are already installed, but if needed:

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

You should see:
```
VITE ready in ... ms
➜  Local:   http://localhost:5173/
```

### Step 4: Open the Application

Open your browser and visit: **http://localhost:5173/**

---

## 🔐 First Login

1. Open http://localhost:5173/
2. Click **"Login"**
3. Use admin credentials:
   - **Email:** admin@resq.com
   - **Password:** admin123

4. You should be redirected to the Admin Dashboard

---

## 📝 Creating Test Users

### Create a Donor

1. Go to http://localhost:5173/signup
2. Fill in the form:
   - Name: Test Donor
   - Email: donor@test.com
   - Password: test123
   - Phone: 1234567890
   - Address: Test Address
   - Role: **Donor**
   - Donor Type: Individual

### Create a Volunteer

1. Go to http://localhost:5173/signup
2. Fill in the form:
   - Role: **Volunteer**
   - Volunteer Role: On-field or Off-field
   - Skills: First Aid, Rescue, etc.

### Create a Victim

1. Go to http://localhost:5173/signup
2. Fill in the form:
   - Role: **Victim**

---

## 🧪 Testing the System

### 1. Test Disaster Reporting (Admin)

1. Login as admin
2. Go to "Add Disaster"
3. Create a test disaster:
   - Name: Test Flood
   - Type: Flood
   - Location: Test City
   - Severity: High
   - Status: Active

### 2. Test Aid Request (Victim)

1. Login as victim
2. Go to "Request Aid"
3. Submit a request:
   - Aid Type: Food
   - Amount: 20 (within limit - auto-approved)
   - Family Size: 4

Try another request:
   - Amount: 60 (exceeds limit - needs admin approval)

### 3. Test Donation (Donor)

1. Login as donor
2. Go to "Donate Money"
3. Make a donation:
   - Amount: 1000
   - Type: General or Specific disaster

### 4. Test Shelter Offer (Donor)

1. Login as donor
2. Go to "Offer Shelter"
3. Create shelter:
   - Shelter Name: Community Center
   - Beds Available: 50
   - City: Test City

### 5. Test Volunteer Tasks (Volunteer)

1. Login as admin
2. Create a task in admin panel
3. Logout and login as volunteer
4. Go to "Choose Task"
5. Select and assign a task
6. Go to "Update Tasks"
7. Change status to In Progress → Completed

---

## 🌐 System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │ ◄─────► │   Express   │ ◄─────► │   MongoDB   │
│  (React +   │  HTTP   │   Server    │  CRUD   │  Database   │
│   Vite)     │  REST   │  (Node.js)  │         │             │
│  Port 5173  │   API   │  Port 5000  │         │  Port 27017 │
└─────────────┘         └─────────────┘         └─────────────┘
```

### Tech Stack

**Frontend:**
- React 19.2.0
- Vite (build tool)
- Tailwind CSS 4.0.0
- FontAwesome icons
- React Router DOM 7.12.0

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt (password hashing)
- Helmet (security)
- CORS enabled

---

## 🔧 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoDB Connection Error: connect ECONNREFUSED`

**Solutions:**
1. Check if MongoDB is running: `net start MongoDB`
2. Verify MongoDB URI in `.env`
3. Or use MongoDB Atlas (cloud) instead

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**
1. Kill the process using port 5000
2. Or change PORT in `.env` to 5001
3. Also update API_BASE_URL in frontend `src/config/api.js`

### CORS Error

**Error:** `Access-Control-Allow-Origin blocked`

**Solution:**
1. Verify `FRONTEND_URL` in backend `.env` matches frontend URL
2. Default should be `http://localhost:5173`

### JWT Token Invalid

**Error:** `Not authorized to access this route`

**Solutions:**
1. Login again to get a fresh token
2. Check if token is properly stored in localStorage
3. Verify JWT_SECRET is consistent

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
npm install
```

---

## 📊 Database Structure

### Collections Created

1. **users** - All users (admin, donors, volunteers, victims)
2. **disasters** - Disaster records
3. **aidrequests** - Victim aid requests
4. **donations** - Donor contributions
5. **shelters** - Shelter offers
6. **tasks** - Volunteer tasks

### Viewing Database (Optional)

**Using MongoDB Compass:**
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `resq`
4. Browse collections

**Using mongosh (CLI):**
```bash
mongosh
use resq
db.users.find()
db.disasters.find()
```

---

## 🚀 Next Steps

1. ✅ Backend server running on port 5000
2. ✅ Frontend server running on port 5173
3. ✅ Admin user created
4. ✅ MongoDB connected

**What to do next:**

1. **Login as admin** and explore the dashboard
2. **Create test disasters** using "Add Disaster"
3. **Create multiple user accounts** (donor, volunteer, victim)
4. **Test all 23 use cases** listed in requirements
5. **Verify aid request workflow** (especially exceeding limits)
6. **Test donation tracking**
7. **Test volunteer task assignment**

---

## 🔐 Security Notes

### For Development:
- Default admin credentials are provided
- JWT secret is included in `.env`
- CORS is open for localhost

### For Production:
- [ ] Change admin password immediately
- [ ] Generate strong JWT_SECRET (use: `openssl rand -base64 32`)
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set NODE_ENV=production
- [ ] Enable rate limiting
- [ ] Add input sanitization
- [ ] Implement audit logging

---

## 📚 API Documentation

Full API documentation is available in:
- Backend README: `backend/README.md`
- Frontend MODERNIZATION.md: `frontend/ResQ/MODERNIZATION.md`

### Quick API Test (using cURL or Postman)

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@resq.com","password":"admin123"}'
```

**Get Disasters:**
```bash
curl http://localhost:5000/api/disasters \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review backend console for error messages
3. Review frontend browser console (F12)
4. Check MongoDB connection status
5. Verify all environment variables

---

## ✅ Setup Checklist

- [ ] Node.js installed (v18+)
- [ ] MongoDB installed and running (or Atlas connected)
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Admin user created (`npm run create-admin`)
- [ ] Backend server running (`npm run dev`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Successfully logged in as admin
- [ ] Tested creating a disaster
- [ ] Tested creating other user types

**Congratulations! Your ResQ system is ready! 🎉**
