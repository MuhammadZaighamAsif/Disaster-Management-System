# 🆘 ResQ - Disaster Relief Management System

A comprehensive full-stack web application for managing disaster relief operations, connecting victims, volunteers, donors, and NGOs in real-time.

![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Features Breakdown](#features-breakdown)
- [Map Integration](#map-integration)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

---

## 🎯 Overview

**ResQ** is a disaster relief management system that facilitates coordination between:
- **Victims**: Report disasters and request aid
- **Volunteers**: Respond to emergencies and help victims
- **Donors**: Contribute money, items, or shelter
- **Admins**: Verify and manage all operations

The platform uses real-time location tracking, priority-based assignment, and transparent communication to maximize relief efficiency.

---

## ✨ Features

### 👤 **For Victims**
- ✅ Report disaster locations and damage
- ✅ Request specific types of aid (food, medical, shelter)
- ✅ Track aid request status in real-time
- ✅ View available shelters in area
- ✅ Get help from verified volunteers

### 🤝 **For Volunteers**
- ✅ View nearby victims on interactive map (Leaflet + OpenStreetMap)
- ✅ Choose on-field or off-field tasks
- ✅ Accept and manage aid requests
- ✅ Real-time geolocation tracking
- ✅ Task status updates and history

### 💝 **For Donors**
- ✅ Donate money to specific disasters
- ✅ Contribute physical items (food, water, medicine)
- ✅ Offer shelter for disaster victims
- ✅ View donation impact and statistics
- ✅ History of contributions

### 👨‍💼 **For Admins**
- ✅ Verify disaster reports
- ✅ Approve volunteer registrations
- ✅ Monitor all aid requests
- ✅ View platform analytics
- ✅ Manage user access and roles

### 📊 **Platform Features**
- ✅ Real-time geolocation & mapping
- ✅ Input validation on all forms
- ✅ Role-based access control (RBAC)
- ✅ JWT authentication
- ✅ Analytics dashboard with charts
- ✅ Responsive mobile-friendly design
- ✅ Protected navigation flows

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI library |
| React Router | 7.12.0 | Client-side routing |
| Vite | 7.2.4 | Build tool |
| Tailwind CSS | 4.0.0 | Styling |
| Leaflet | 1.9.4 | Maps |
| React-Leaflet | 5.0.0 | React map integration |
| Recharts | 3.6.0 | Charts & analytics |
| FontAwesome | 7.1.0 | Icons |
| Axios | 1.6.0 | HTTP client |

### **Backend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | Latest | Web framework |
| MongoDB | 6+ | Database |
| JWT | Latest | Authentication |
| Bcrypt | Latest | Password hashing |
| Cors | Latest | Cross-origin handling |

### **Dev Tools**
| Tool | Purpose |
|------|---------|
| Git | Version control |
| ESLint | Code linting |
| Postman | API testing |
| MongoDB Compass | Database visualization |

---

## 📁 Project Structure

```
ResQ/
├── 📂 frontend/
│   └── ResQ/
│       ├── src/
│       │   ├── pages/               # Page components
│       │   │   ├── general/        # Home, Login, Signup
│       │   │   ├── victim/         # Victim dashboard & pages
│       │   │   ├── donor/          # Donor dashboard & pages
│       │   │   ├── volunteer/      # Volunteer dashboard & pages
│       │   │   └── admin/          # Admin dashboard & pages
│       │   ├── components/         # Reusable components
│       │   │   ├── common/        # Navbar, Footer, Layout
│       │   │   ├── victim/
│       │   │   ├── donor/
│       │   │   ├── volunteer/
│       │   │   └── admin/
│       │   ├── context/           # React Context (Auth)
│       │   ├── utils/             # Helpers, API, validation
│       │   ├── styles/            # CSS files
│       │   ├── assets/            # Images, icons
│       │   ├── App.jsx            # Root component
│       │   ├── main.jsx           # Entry point
│       │   └── index.css          # Global styles
│       ├── public/                # Static files
│       ├── package.json
│       ├── vite.config.js
│       ├── tailwind.config.js
│       ├── eslint.config.js
│       └── README.md
│
├── 📂 backend/
│   ├── controllers/              # Request handlers
│   ├── models/                   # Database schemas
│   ├── routes/                   # API routes
│   ├── middleware/               # Auth, error handling
│   ├── config/                   # Configuration files
│   ├── .env                      # Environment variables
│   ├── package.json
│   ├── server.js                 # Entry point
│   └── README.md
│
├── 📂 .github/                   # GitHub workflows
├── 📂 .vscode/                   # VS Code settings
├── 📄 README.md                  # This file
├── 📄 SETUP_GUIDE.md            # Detailed setup instructions
└── 📄 .gitignore                # Git ignore rules
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB v6+ (local or Atlas)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd Pr
```

### 2. Backend Setup
```bash
cd backend
npm install
# Update .env if needed
npm run dev
# Server runs at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend/ResQ
npm install
npm run dev
# Client runs at http://localhost:5173
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 📦 Installation

### Full Setup Guide

For detailed installation instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Backend Installation

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (already provided)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/resq
# JWT_SECRET=your_secret_key

# Start server
npm run dev
```

### Frontend Installation

```bash
# Navigate to frontend
cd frontend/ResQ

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## ⚙️ Configuration

### Backend Configuration (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/resq
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resq

# Security
JWT_SECRET=resq_secret_key_change_this_in_production_2025
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload (optional)
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### Frontend Configuration

**API Base URL**: `src/utils/api.js`
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend/ResQ
npm run dev
```

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend/ResQ
npm run build
# Serve from dist folder
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### User Registration
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+92-300-1234567",
  "role": "victim|donor|volunteer|admin",
  "cnic": "12345-6789012-3",
  "address": "123 Main St"
}
```

#### User Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { user_data }
}
```

### Disaster Endpoints

#### Report Disaster
```
POST /disasters/report
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Earthquake in Sector G",
  "location": "Sector G-7, Islamabad",
  "city": "Islamabad",
  "description": "6.5 magnitude earthquake",
  "severity": "high",
  "latitude": 33.6844,
  "longitude": 73.0479
}
```

#### Get All Disasters
```
GET /disasters
```

### Victim Endpoints

#### Request Aid
```
POST /aid/request
Authorization: Bearer {token}
Content-Type: application/json

{
  "victimId": "user_id",
  "disasterId": "disaster_id",
  "aidType": "food|medical|shelter|water",
  "priority": "high|medium|low",
  "location": "address",
  "latitude": 33.6844,
  "longitude": 73.0479
}
```

### Volunteer Endpoints

#### Get Nearby Victims
```
GET /api/volunteers/victims/nearby?lat=33.6844&lng=73.0479
Authorization: Bearer {token}

Response:
[
  {
    "id": "victim_id",
    "name": "Ahmed Ali",
    "location": "House #42",
    "latitude": 33.6870,
    "longitude": 73.0495,
    "distance": 0.45,
    "priority": "high",
    "status": "active"
  }
]
```

#### Accept Task
```
POST /volunteers/task/accept
Authorization: Bearer {token}
Content-Type: application/json

{
  "aidRequestId": "aid_id"
}
```

### Donor Endpoints

#### Make Donation
```
POST /donations/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "disasterId": "disaster_id",
  "donationType": "money|items|shelter",
  "amount": 5000,
  "items": ["food", "water"],
  "description": "Donation description"
}
```

### Admin Endpoints

#### Verify Disaster
```
PUT /admin/disasters/{disasterId}/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "verified": true,
  "notes": "Verified by admin"
}
```

#### Approve Volunteer
```
PUT /admin/volunteers/{volunteerId}/approve
Authorization: Bearer {token}
Content-Type: application/json

{
  "approved": true
}
```

---

## 🗄️ Database

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  cnic: String,
  address: String,
  role: String, // victim, donor, volunteer, admin
  verified: Boolean,
  status: String, // active, inactive, suspended
  createdAt: Date,
  updatedAt: Date
}
```

#### Disasters Collection
```javascript
{
  _id: ObjectId,
  name: String,
  location: String,
  city: String,
  description: String,
  latitude: Number,
  longitude: Number,
  severity: String, // low, medium, high, critical
  status: String, // reported, verified, ongoing, resolved
  verified: Boolean,
  verifiedBy: ObjectId (admin),
  reportedBy: ObjectId (user),
  affectedPeople: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Aid Requests Collection
```javascript
{
  _id: ObjectId,
  victimId: ObjectId,
  disasterId: ObjectId,
  aidType: String, // food, medical, shelter, water
  priority: String, // low, medium, high
  location: String,
  latitude: Number,
  longitude: Number,
  description: String,
  status: String, // pending, active, in-progress, completed
  assignedVolunteer: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🗺️ Map Integration

### Leaflet + OpenStreetMap

The volunteer map feature uses:
- **Leaflet**: Open-source map library
- **OpenStreetMap**: Free map tiles (no API key needed)
- **Geolocation API**: Browser GPS detection

**Features:**
- Real-time victim location display
- Color-coded markers (Red=High, Yellow=Medium, Green=Low)
- Distance calculation from volunteer
- Interactive popups with victim info
- Mobile responsive design

**Documentation**: See [frontend/ResQ/MAP_INTEGRATION_GUIDE.md](frontend/ResQ/MAP_INTEGRATION_GUIDE.md)

---

## 👥 User Roles & Permissions

### Victim Role
- ✅ Report disasters
- ✅ Request aid
- ✅ View aid status
- ✅ Search for shelters
- ✅ Rate volunteers

### Volunteer Role
- ✅ View nearby victims on map
- ✅ Accept aid requests
- ✅ Update task status
- ✅ View task history
- ✅ Choose on-field or off-field

### Donor Role
- ✅ Donate money
- ✅ Donate items
- ✅ Offer shelter
- ✅ View donation history
- ✅ See impact of donations

### Admin Role
- ✅ Verify disaster reports
- ✅ Approve volunteers
- ✅ Verify donors
- ✅ View analytics
- ✅ Manage all users
- ✅ System configuration

---

## 🔐 Security Features

- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Password Hashing**: Bcrypt for secure password storage
- ✅ **Role-Based Access Control**: Different permissions per role
- ✅ **Input Validation**: All fields validated
- ✅ **CORS Protection**: Cross-origin request validation
- ✅ **Environment Variables**: Sensitive data protected
- ✅ **SQL Injection Prevention**: MongoDB + validation
- ✅ **Protected Routes**: Frontend navigation protection

---

## 📊 Key Pages

### General Pages
- **Home**: Landing page with features and statistics
- **Login**: User authentication
- **Signup**: User registration with role selection
- **Search**: Search for disasters and aid requests

### Victim Pages
- **Dashboard**: Overview of aid requests
- **Report Disaster**: Create new disaster report
- **Request Aid**: Submit aid request
- **Aid Status**: Track ongoing requests
- **Available Shelters**: Find nearby shelters

### Volunteer Pages
- **Dashboard**: Overview and statistics
- **View Map**: Interactive map with nearby victims
- **Choose Task**: Select aid to work on
- **Update Tasks**: Mark tasks as complete
- **Volunteer History**: View past tasks

### Donor Pages
- **Dashboard**: Donation overview
- **Donate Items**: Contribute physical items
- **Donate Money**: Financial contributions
- **Offer Shelter**: Provide shelter space
- **Donation History**: View all contributions

### Admin Pages
- **Dashboard**: System overview
- **Verify Disasters**: Approve disaster reports
- **Verify Donors**: Check donor credentials
- **Verify Volunteers**: Approve volunteer applications
- **Manage Disasters**: Edit disaster information
- **View Donations**: Monitor donations
- **View Volunteers**: Manage volunteer list

---

## 🧪 Testing

### Manual Testing Checklist

```
Authentication:
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout functionality
- [ ] Protected routes work

Forms:
- [ ] Input validation works
- [ ] Error messages display
- [ ] Submit buttons disabled for invalid data
- [ ] Success messages show

Maps:
- [ ] Map loads correctly
- [ ] Geolocation works
- [ ] Markers display
- [ ] Popups show correct info

Responsive Design:
- [ ] Desktop layout works
- [ ] Tablet layout works
- [ ] Mobile layout works
- [ ] Navigation menu responsive
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port Already in Use**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

**MongoDB Connection Error**
```
1. Ensure MongoDB is running
2. Check MONGODB_URI in .env
3. Verify connection string format
```

**JWT Authentication Error**
```
1. Clear browser localStorage
2. Re-login to get new token
3. Check JWT_SECRET in .env
```

### Frontend Issues

**Map Not Showing**
```
1. Check Leaflet CSS is imported
2. Verify OpenStreetMap tiles are accessible
3. Clear browser cache
4. Check console for errors
```

**Geolocation Not Working**
```
1. Enable location permission in browser
2. HTTPS required in production (HTTP OK locally)
3. Check browser geolocation setting
```

**API Calls Failing**
```
1. Verify backend is running on port 5000
2. Check API_BASE_URL in utils/api.js
3. Enable browser developer console for error details
4. Verify CORS configuration
```

---

## 📚 Documentation

### Additional Resources

- [Setup Guide](SETUP_GUIDE.md) - Detailed installation steps
- [Map Integration Guide](frontend/ResQ/MAP_INTEGRATION_GUIDE.md) - Leaflet documentation
- [Backend API Setup](frontend/ResQ/BACKEND_API_SETUP.md) - Backend implementation
- [Database Schema](frontend/ResQ/DATABASE_SCHEMA_EXAMPLES.md) - Database design
- [Alternative Map Providers](frontend/ResQ/ALTERNATIVE_MAP_PROVIDERS.md) - Map customization

---

## 🤝 Contributing

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow existing code style
- Add comments for complex logic
- Test before submitting PR
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Contact & Support

### Getting Help

- **Issues**: GitHub Issues for bug reports
- **Documentation**: See documentation files
- **Setup Help**: Refer to SETUP_GUIDE.md

### Project Maintainers

- Development Team: ResQ Team
- Last Updated: January 18, 2026
- Status: Active Development

---

## 🎯 Future Roadmap

### Phase 1 (Current)
- ✅ Core functionality
- ✅ User authentication
- ✅ Map integration
- ✅ Form validation

### Phase 2
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Mobile app version
- [ ] Payment integration

### Phase 3
- [ ] AI-powered matching (volunteer to victim)
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Advanced reporting

---

## 📊 Technology Comparison

| Aspect | ResQ | Competitors |
|--------|------|------------|
| **Cost** | Free/Open | Varies |
| **Tech Stack** | Modern (React, Node) | Various |
| **Map Integration** | Leaflet (Free) | Google Maps (Paid) |
| **Real-time** | Socket.io Ready | Limited |
| **Mobile Ready** | Yes | Varies |
| **Open Source** | Yes | Limited |

---

## ✅ Checklist for Developers

### Before Deployment
- [ ] Environment variables configured
- [ ] Database backups in place
- [ ] API tests passing
- [ ] Frontend builds without errors
- [ ] Security checklist completed
- [ ] Performance optimized

### After Deployment
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify all API endpoints
- [ ] Test user flows
- [ ] Monitor database usage

---

## 📈 Project Statistics

| Metric | Count |
|--------|-------|
| Frontend Pages | 15+ |
| API Endpoints | 20+ |
| Database Collections | 8+ |
| User Roles | 4 |
| Features | 40+ |
| Documentation Files | 15+ |
| Total Lines of Code | 5000+ |

---

## 🙏 Acknowledgments

- **Leaflet Team** - For amazing map library
- **OpenStreetMap** - For free map tiles
- **React Community** - For excellent documentation
- **Node.js Community** - For backend framework

---

**Last Updated**: January 18, 2026  
**Version**: 1.0.0  
**Status**: 🟢 Active Development

For the most up-to-date information, refer to the documentation folder.
