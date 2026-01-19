# ResQ - Disaster Relief Management System

![Status](https://img.shields.io/badge/Status-Active-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green) ![React](https://img.shields.io/badge/React-19.2.0-blue)

## Overview

ResQ is a full-stack disaster relief management platform connecting victims, volunteers, donors, and admins for efficient disaster response coordination with real-time location tracking and analytics.

## Features

**Victims**: Report disasters, request aid, track status, find shelters  
**Volunteers**: View victim map, accept tasks, update status  
**Donors**: Donate money/items/shelter, view impact, track history  
**Admins**: Verify reports, approve users, monitor analytics  

**Platform**: Real-time geolocation, JWT auth, RBAC, input validation, responsive design

## Tech Stack

**Frontend**: React 19.2, Vite 7.2, Tailwind CSS 4.0, Leaflet 1.9, React Router 7.12, Recharts, FontAwesome  
**Backend**: Node.js 18+, Express, MongoDB 6+, JWT, Bcrypt, Cors  
**Dev Tools**: Git, ESLint, Postman, MongoDB Compass

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB v6+ (local or Atlas)

### Setup

```bash
# Clone repository
git clone <repository-url>
cd Pr

# Backend setup
cd backend
npm install
npm run dev  # Runs on http://localhost:5000

# Frontend setup (new terminal)
cd frontend/ResQ
npm install
npm run dev  # Runs on http://localhost:5173
```

### Configuration

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resq
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

## Project Structure

```
Pr/
├── backend/          # Express API, MongoDB models, JWT auth
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/ResQ/    # React app, Vite build, Tailwind styling
│   ├── src/
│   │   ├── pages/       # Victim, Donor, Volunteer, Admin pages
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth context
│   │   └── utils/       # API client, helpers
│   └── public/
└── README.md         # This file
```

## API Endpoints

**Base URL**: `http://localhost:5000/api`

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (requires token)

### Disasters
- `GET /disasters` - Get all disasters
- `POST /disasters/report` - Report disaster (requires token)
- `PUT /admin/disasters/:id/verify` - Verify disaster (admin)

### Aid Requests
- `POST /aid/request` - Create aid request (victim)
- `GET /aid/my-requests` - Get my requests (victim)
- `PUT /aid/:id/approve` - Approve request (admin)

### Donations
- `POST /donations/create` - Make donation (donor)
- `GET /donations/history` - View donation history (donor)

### Volunteers
- `GET /volunteers/victims/nearby?lat=33.6&lng=73.0` - Get nearby victims
- `POST /volunteers/task/accept` - Accept task
- `PUT /volunteers/task/:id/status` - Update task status

## Database Schema

### Users
```javascript
{
  name, email, password, phone, cnic, address,
  role: "victim|donor|volunteer|admin",
  verified, status
}
```

### Disasters
```javascript
{
  name, location, city, description,
  latitude, longitude, severity, status,
  verified, reportedBy, verifiedBy
}
```

### Aid Requests
```javascript
{
  victimId, disasterId, aidType, priority,
  location, latitude, longitude, status,
  assignedVolunteer
}
```

## Map Integration

Uses **Leaflet** + **OpenStreetMap** (no API key required)

**Features**: Real-time victim locations, color-coded markers, distance calculation, interactive popups, mobile responsive

**Setup**: Leaflet CSS auto-imported, tiles from OpenStreetMap

## User Roles

| Role | Key Features |
|------|--------------|
| **Victim** | Report disasters, request aid, view shelters |
| **Volunteer** | View victim map, accept/update tasks |
| **Donor** | Donate money/items/shelter, view impact |
| **Admin** | Verify reports, approve users, manage system |

## Security

- JWT token authentication
- Bcrypt password hashing
- Role-based access control (RBAC)
- Input validation with express-validator
- CORS protection
- Protected routes

## Troubleshooting

**Port in use**: Kill process on port 5000/5173  
**MongoDB error**: Ensure MongoDB running, check MONGODB_URI  
**Map not showing**: Check Leaflet CSS, verify tiles accessible  
**API failing**: Verify backend running, check CORS config  
**JWT error**: Clear localStorage, re-login

## Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed installation
- [backend/README.md](backend/README.md) - Backend API docs
- [frontend/ResQ/README.md](frontend/ResQ/README.md) - Frontend guide

## Development

```bash
# Run backend dev server
cd backend && npm run dev

# Run frontend dev server
cd frontend/ResQ && npm run dev

# Build frontend for production
cd frontend/ResQ && npm run build
```

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

## License

MIT License

## Stats

- 15+ Frontend Pages
- 20+ API Endpoints
- 8+ Database Collections
- 4 User Roles
- 40+ Features

**Version**: 1.0.0 | **Last Updated**: January 18, 2026 | **Status**: Active Development
