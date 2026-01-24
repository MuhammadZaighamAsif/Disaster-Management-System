# ResQ Backend - Node.js + Express + MongoDB

Complete backend API for Disaster Relief Management System.

## Quick Start

```bash
cd backend
npm install
npm start  # Starts on http://localhost:5000
```

## Configuration

Create `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/resq
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**MongoDB Atlas**: Replace `MONGODB_URI` with `mongodb+srv://username:password@cluster.mongodb.net/resq`

## Project Structure

```
backend/
├── server.js              # Express app entry
├── controllers/           # Request handlers
├── models/                # MongoDB schemas
├── routes/                # API routes
├── middleware/            # Auth & error handling
└── .env                   # Environment config
```

## Authentication

### Signup
```bash
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main St",
  "role": "DONOR"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes JWT token - use in `Authorization: Bearer {token}` header

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (Private)

### Disasters
- `GET /api/disasters` - Get all disasters
- `POST /api/disasters/report` - Report disaster (Private)
- `PUT /api/disasters/:id/verify` - Verify disaster (Admin)

### Aid Requests
- `POST /api/aid-requests` - Create request (Victim)
- `GET /api/aid-requests/my-requests` - Get my requests (Victim)
- `PUT /api/aid-requests/:id/approve` - Approve request (Admin)

### Donations
- `POST /api/donations/money` - Donate money (Donor)
- `POST /api/donations/items` - Donate items (Donor)
- `GET /api/donations/my-donations` - Get my donations (Donor)

### Shelters
- `GET /api/shelters/available` - Get available shelters
- `POST /api/shelters` - Offer shelter (Donor)
- `PUT /api/shelters/:id` - Update shelter

### Volunteers
- `GET /api/volunteers/tasks/available` - Get available tasks
- `POST /api/volunteers/tasks/:id/assign` - Assign task
- `PUT /api/volunteers/tasks/:id/status` - Update status

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/verify` - Verify user

## Database Models

### User
- name, email, password (hashed), phone, address
- role: ADMIN | VOLUNTEER | DONOR | VICTIM
- isVerified, isActive

### Disaster
- name, type, location, city, description
- severity, status, coordinates
- reportedBy, verifiedBy

### AidRequest
- victim, disaster, aidType, amount, familySize
- status, exceedsLimit, reviewedBy

### Donation
- donor, type, amount, itemType
- status, verifiedBy

### Shelter
- donor, shelterName, address, city
- bedsAvailable, bedsOccupied, facilities

### Task
- volunteer, disaster, title, taskType
- status, priority, assignedAt

## Security

- **JWT Authentication** - Token-based auth
- **Password Hashing** - bcrypt encryption
- **Helmet** - Security headers
- **CORS** - Cross-origin protection
- **Input Validation** - express-validator
- **Error Handling** - Centralized middleware

## Testing

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@resq.com","password":"admin123"}'

# Get disasters (with token)
curl http://localhost:5000/api/disasters \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| MONGODB_URI | mongodb://localhost:27017/resq | MongoDB connection |
| JWT_SECRET | (required) | JWT signing key |
| JWT_EXPIRE | 7d | Token expiration |
| FRONTEND_URL | http://localhost:5173 | CORS origin |

## Create Admin User

```javascript
// createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.model');

mongoose.connect(process.env.MONGODB_URI);

User.create({
  name: 'Admin User',
  email: 'admin@resq.com',
  password: 'admin123',
  phone: '1234567890',
  address: 'Admin Office',
  role: 'ADMIN',
  isVerified: true,
}).then(() => process.exit());
```

Run: `node createAdmin.js`

## Deployment

### Heroku

```bash
heroku create resq-backend
heroku config:set MONGODB_URI=your_atlas_connection
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production
git push heroku main
```

### Production Checklist
- [ ] MongoDB Atlas with SSL
- [ ] Strong JWT_SECRET
- [ ] NODE_ENV=production
- [ ] Proper CORS origins
- [ ] Rate limiting enabled

## Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [JWT.io](https://jwt.io/)
