# ResQ - Setup Guide

## Prerequisites

- **Node.js** v18+ - [Download](https://nodejs.org/)
- **MongoDB** v6+ - Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- **Git** (optional) - [Download](https://git-scm.com/)

## Backend Setup

### 1. Navigate & Install

```bash
cd backend
npm install
```

### 2. Configure Environment

`.env` file is ready with defaults. Update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resq
JWT_SECRET=resq_secret_key_change_this_in_production_2025
FRONTEND_URL=http://localhost:5173
```

**For MongoDB Atlas**: Replace `MONGODB_URI` with your connection string  
Format: `mongodb+srv://username:password@cluster.mongodb.net/resq`

### 3. Start MongoDB

**Local Installation:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**MongoDB Atlas**: No action needed - cloud-based

### 4. Create Admin User

```bash
npm run create-admin
```

Credentials: `admin@resq.com` / `admin123` (change after first login!)

### 5. Start Server

```bash
npm run dev
```

Output:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

Test: Visit [http://localhost:5000/health](http://localhost:5000/health)

## Frontend Setup

### 1. Navigate & Install

```bash
cd frontend/ResQ
npm install
```

### 2. Start Dev Server

```bash
npm run dev
```

Output:
```
➜  Local: http://localhost:5173/
```

### 3. Access Application

Open [http://localhost:5173](http://localhost:5173)

## First Login

1. Visit [http://localhost:5173](http://localhost:5173)
2. Click **Login**
3. Credentials: `admin@resq.com` / `admin123`
4. You'll see Admin Dashboard

## Create Test Users

### Donor
Go to signup, fill form with role = **Donor**, donor type = Individual

### Volunteer
Go to signup, fill form with role = **Volunteer**, select On-field/Off-field

### Victim
Go to signup, fill form with role = **Victim**

## Testing the System

### 1. Report Disaster (Admin)
Login as admin → "Add Disaster" → Fill form (name, type, location, severity)

### 2. Request Aid (Victim)
Login as victim → "Request Aid" → Submit request (amount ≤20 auto-approved, >20 needs admin approval)

### 3. Make Donation (Donor)
Login as donor → "Donate Money" → Enter amount and disaster

### 4. Offer Shelter (Donor)
Login as donor → "Offer Shelter" → Create shelter listing

### 5. Manage Tasks (Volunteer)
Admin creates task → Login as volunteer → "Choose Task" → Assign → "Update Tasks" → Change status

## Architecture

```
Browser (React:5173) ↔ Express Server (Node:5000) ↔ MongoDB (27017)
```

## Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running: `net start MongoDB`
- Verify `MONGODB_URI` in `.env`
- Or use MongoDB Atlas instead

### Port Already in Use
- Kill process on port 5000
- Or change `PORT` in `.env` to 5001 and update frontend API URL

### CORS Error
- Verify `FRONTEND_URL=http://localhost:5173` in backend `.env`

### JWT Token Invalid
- Login again for fresh token
- Check `JWT_SECRET` in `.env`

### Module Not Found
```bash
cd backend && npm install
cd frontend/ResQ && npm install
```

## Database Collections

Created automatically:
- `users` - All user accounts
- `disasters` - Disaster records  
- `aidrequests` - Aid requests
- `donations` - Donor contributions
- `shelters` - Shelter offers
- `tasks` - Volunteer tasks

**View with MongoDB Compass**: Connect to `mongodb://localhost:27017`, browse `resq` database

## Security for Production

- [ ] Change admin password
- [ ] Generate strong JWT_SECRET: `openssl rand -base64 32`
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set `NODE_ENV=production`
- [ ] Enable rate limiting

## Setup Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB running
- [ ] Backend deps installed (`npm install`)
- [ ] Frontend deps installed (`npm install`)
- [ ] `.env` configured
- [ ] Admin user created
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] Successfully logged in as admin
- [ ] Tested creating disaster
- [ ] Created test users (donor, volunteer, victim)

## Next Steps

1. Login as admin and explore dashboard
2. Create test disasters via "Add Disaster"
3. Create multiple user accounts for each role
4. Test aid request workflow (within/exceeding limits)
5. Test donation tracking
6. Test volunteer task assignment and updates

**Your ResQ system is ready!** 🎉
