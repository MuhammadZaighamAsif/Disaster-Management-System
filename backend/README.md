# ResQ Backend - Node.js + Express + MongoDB

Complete backend implementation for the Disaster Relief Management System (ResQ).

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/resq

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Install and Start MongoDB

**Windows:**
```bash
# Install MongoDB Community Edition
# Download from: https://www.mongodb.com/try/download/community

# Start MongoDB Service
net start MongoDB
```

**Alternative: Use MongoDB Atlas (Cloud)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on: `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── server.js                 # Express app entry point
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── controllers/              # Request handlers
│   ├── auth.controller.js
│   ├── disaster.controller.js
│   ├── aidRequest.controller.js
│   ├── donation.controller.js
│   ├── shelter.controller.js
│   ├── volunteer.controller.js
│   ├── donor.controller.js
│   ├── victim.controller.js
│   └── admin.controller.js
├── models/                   # MongoDB schemas
│   ├── User.model.js
│   ├── Disaster.model.js
│   ├── AidRequest.model.js
│   ├── Donation.model.js
│   ├── Shelter.model.js
│   └── Task.model.js
├── routes/                   # API routes
│   ├── auth.routes.js
│   ├── disaster.routes.js
│   ├── aidRequest.routes.js
│   ├── donation.routes.js
│   ├── shelter.routes.js
│   ├── volunteer.routes.js
│   ├── donor.routes.js
│   ├── victim.routes.js
│   └── admin.routes.js
└── middleware/               # Custom middleware
    ├── auth.js               # JWT authentication
    └── errorHandler.js       # Error handling
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Signup

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main St",
  "role": "DONOR",
  "donorType": "INDIVIDUAL"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "name": "John Doe", "role": "DONOR" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Using the Token

Include the token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Private)
- `POST /api/auth/logout` - Logout user (Private)
- `GET /api/auth/verify` - Verify token (Private)

### Disasters
- `GET /api/disasters` - Get all disasters (Public)
- `GET /api/disasters/search?query=...` - Search disasters (Public)
- `GET /api/disasters/:id` - Get single disaster (Public)
- `POST /api/disasters/report` - Report disaster (Private)
- `POST /api/disasters` - Add disaster (Admin)
- `PUT /api/disasters/:id` - Update disaster (Admin)
- `DELETE /api/disasters/:id` - Delete disaster (Admin)
- `PUT /api/disasters/:id/verify` - Verify disaster (Admin)
- `PUT /api/disasters/:id/reject` - Reject disaster (Admin)

### Aid Requests
- `POST /api/aid-requests` - Create aid request (Victim)
- `GET /api/aid-requests/my-requests` - Get my aid requests (Victim)
- `GET /api/aid-requests/pending` - Get pending requests (Admin)
- `GET /api/aid-requests` - Get all requests (Admin)
- `PUT /api/aid-requests/:id/approve` - Approve request (Admin)
- `PUT /api/aid-requests/:id/reject` - Reject request (Admin)
- `PUT /api/aid-requests/:id/status` - Update status (Admin)

### Donations
- `POST /api/donations/money` - Donate money (Donor)
- `POST /api/donations/items` - Donate items (Donor)
- `GET /api/donations/my-donations` - Get my donations (Donor)
- `GET /api/donations` - Get all donations (Admin)
- `PUT /api/donations/:id/verify` - Verify donation (Admin)
- `PUT /api/donations/:id/reject` - Reject donation (Admin)

### Shelters
- `GET /api/shelters/available` - Get available shelters (Public)
- `POST /api/shelters` - Offer shelter (Donor)
- `GET /api/shelters/my-shelters` - Get my shelters (Donor)
- `GET /api/shelters` - Get all shelters (Admin)
- `PUT /api/shelters/:id` - Update shelter (Donor/Admin)
- `PUT /api/shelters/:id/occupancy` - Update occupancy (Admin)
- `DELETE /api/shelters/:id` - Delete shelter (Donor/Admin)

### Volunteers & Tasks
- `GET /api/volunteers/tasks/available` - Get available tasks (Volunteer)
- `GET /api/volunteers/my-tasks` - Get my tasks (Volunteer)
- `POST /api/volunteers/tasks/:id/assign` - Assign task to self (Volunteer)
- `PUT /api/volunteers/tasks/:id/status` - Update task status (Volunteer)
- `GET /api/volunteers` - Get all volunteers (Admin)
- `POST /api/volunteers/tasks` - Create task (Admin)
- `GET /api/volunteers/tasks` - Get all tasks (Admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `GET /api/admin/users/:id` - Get single user (Admin)
- `PUT /api/admin/users/:id` - Update user (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)
- `PUT /api/admin/users/:id/verify` - Verify user (Admin)
- `PUT /api/admin/users/:id/deactivate` - Deactivate user (Admin)

## 🗄️ Database Models

### User
- name, email, password (hashed)
- phone, cnic, address
- role: ADMIN | VOLUNTEER | DONOR | VICTIM
- isVerified, isActive
- Role-specific fields (donorType, volunteerRole, etc.)

### Disaster
- name, type, location, city, areaCode
- description, severity, status
- occurredAt, affectedAreas, estimatedVictims
- reportedBy, verifiedBy

### AidRequest
- victim, disaster, aidType (FOOD, CLOTHES, SHELTER, MEDICAL)
- amount, familySize, urgency
- status, exceedsLimit, reviewedBy

### Donation
- donor, type (MONEY, ITEMS, SHELTER)
- amount, itemType, quantity
- status, verifiedBy

### Shelter
- donor, disaster, shelterName, address, city
- bedsAvailable, bedsOccupied
- facilities, status, coordinates

### Task
- volunteer, disaster, title, description
- taskType, status, priority, location
- assignedAt, startedAt, completedAt

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password encryption
- **Helmet** - Security headers
- **CORS** - Configured cross-origin resource sharing
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - Express-validator for request validation
- **Error Handling** - Centralized error handling middleware

## 🧪 Testing

Test the API using Postman or cURL:

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@resq.com","password":"admin123"}'

# Get disasters (authenticated)
curl http://localhost:5000/api/disasters \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🌍 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/resq |
| `JWT_SECRET` | Secret key for JWT | (required) |
| `JWT_EXPIRE` | Token expiration time | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `AID_LIMIT_FOOD` | Food aid limit | 50 |
| `AID_LIMIT_CLOTHES` | Clothes aid limit | 30 |
| `AID_LIMIT_SHELTER` | Shelter aid limit | 10 |
| `AID_LIMIT_MEDICAL` | Medical aid limit | 20 |

## 📝 Development Notes

### Creating an Admin User

Since the first user needs to be an admin, you can:

1. **Manual Database Entry**: Use MongoDB Compass or mongosh
2. **Seed Script**: Create a seed script
3. **Temporary Signup Modification**: Temporarily modify signup to allow admin creation

Example seed script:

```javascript
// scripts/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.model');

mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@resq.com',
    password: 'admin123',
    phone: '1234567890',
    address: 'Admin Office',
    role: 'ADMIN',
    isVerified: true,
  });
  console.log('Admin created:', admin.email);
  process.exit();
};

createAdmin();
```

Run: `node scripts/createAdmin.js`

## 🚀 Deployment

### Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create resq-backend

# Set environment variables
heroku config:set MONGODB_URI=your_atlas_connection_string
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Environment Setup for Production

- Use MongoDB Atlas for production database
- Set strong `JWT_SECRET`
- Enable MongoDB SSL/TLS
- Set `NODE_ENV=production`
- Configure proper CORS origins
- Use environment-specific rate limits

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [JWT.io](https://jwt.io/)

## 🤝 Support

For issues or questions, refer to the main project documentation or create an issue.
