# Database Schema & Example Data for Map Integration

## Victim Data Model

### MongoDB Schema Example

```javascript
// AidRequest Schema
const aidRequestSchema = new Schema({
  _id: ObjectId,
  
  // Basic Info
  victimId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  victimName: {
    type: String,
    required: true
  },
  
  // Location Data
  location: {
    type: String,  // Address: "House #42, Street 5, Sector G-7"
    required: true
  },
  latitude: {
    type: Number,  // GPS coordinate
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,  // GPS coordinate
    required: true,
    min: -180,
    max: 180
  },
  
  // Priority & Status
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Contact Info
  phone: String,
  email: String,
  
  // Request Details
  disasterId: {
    type: Schema.Types.ObjectId,
    ref: 'Disaster'
  },
  description: String,
  
  // Assignment
  assignedVolunteer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

---

## Example Responses

### Response 1: Multiple Victims Near Volunteer

**Request:**
```
GET /api/volunteers/victims/nearby?lat=33.6844&lng=73.0479
```

**Response (200 OK):**
```json
[
  {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Ahmed Ali",
    "location": "House #42, Street 5, Sector G-7, Islamabad",
    "latitude": 33.6870,
    "longitude": 73.0495,
    "distance": 0.45,
    "priority": "high",
    "status": "active"
  },
  {
    "id": "64a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Fatima Khan",
    "location": "Apartment 5B, Plaza Heights, Sector F-8",
    "latitude": 33.6900,
    "longitude": 73.0520,
    "distance": 1.82,
    "priority": "medium",
    "status": "active"
  },
  {
    "id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "name": "Hassan Ahmed",
    "location": "Shop #12, Main Market, Blue Area",
    "latitude": 33.6750,
    "longitude": 73.0400,
    "distance": 4.23,
    "priority": "low",
    "status": "pending"
  },
  {
    "id": "64a1b2c3d4e5f6g7h8i9j0k4",
    "name": "Ayesha Malik",
    "location": "Office Complex, Jinnah Avenue",
    "latitude": 33.7000,
    "longitude": 73.0600,
    "distance": 6.15,
    "priority": "medium",
    "status": "active"
  },
  {
    "id": "64a1b2c3d4e5f6g7h8i9j0k5",
    "name": "Muhammad Hassan",
    "location": "Residential Block 7, G-6",
    "latitude": 33.6650,
    "longitude": 73.0300,
    "distance": 8.47,
    "priority": "high",
    "status": "pending"
  }
]
```

### Response 2: No Victims Nearby

**Response (200 OK):**
```json
[]
```

### Response 3: Invalid Coordinates

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid latitude or longitude provided"
}
```

### Response 4: Server Error

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Failed to fetch nearby victims"
}
```

---

## Sample Database Records

### Complete Aid Request Document

```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "victimId": "64a1b2c3d4e5f6g7h8i9j0m1",
  "victimName": "Ahmed Ali",
  "location": "House #42, Street 5, Sector G-7, Islamabad",
  "latitude": 33.6870,
  "longitude": 73.0495,
  "priority": "high",
  "status": "active",
  "phone": "+92-300-1234567",
  "email": "ahmed@example.com",
  "disasterId": "64a1b2c3d4e5f6g7h8i9j0d1",
  "description": "Injured leg, requires medical assistance and food supplies",
  "assignedVolunteer": null,
  "createdAt": "2026-01-18T10:30:00Z",
  "updatedAt": "2026-01-18T10:30:00Z"
}
```

---

## Distance Calculation Reference

### Haversine Formula (Node.js)

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return parseFloat(distance.toFixed(2));
}

// Test
const dist = calculateDistance(33.6844, 73.0479, 33.6870, 73.0495);
console.log(dist); // Output: 0.45 km
```

---

## Implementation Steps

### Step 1: Create Database Indexes

```javascript
// Improve query performance for geospatial queries
db.aidRequests.createIndex({ latitude: 1, longitude: 1 });
db.aidRequests.createIndex({ status: 1 });
db.aidRequests.createIndex({ priority: 1 });
```

### Step 2: Create the Route Handler

```javascript
const express = require('express');
const router = express.Router();
const AidRequest = require('../models/AidRequest');
const auth = require('../middleware/auth'); // JWT auth middleware

// Helper function
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
};

// Route
router.get('/victims/nearby', auth, async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    // Validation
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }
    
    const volunteerLat = parseFloat(lat);
    const volunteerLng = parseFloat(lng);
    
    if (isNaN(volunteerLat) || isNaN(volunteerLng) ||
        volunteerLat < -90 || volunteerLat > 90 ||
        volunteerLng < -180 || volunteerLng > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates'
      });
    }
    
    // Query database
    const aidRequests = await AidRequest.find({
      status: { $in: ['active', 'pending'] }
    })
    .select('victimName location latitude longitude priority status phone')
    .limit(50); // Max 50 results
    
    // Calculate distances
    const nearbyVictims = aidRequests
      .map(request => ({
        id: request._id.toString(),
        name: request.victimName,
        location: request.location,
        latitude: request.latitude,
        longitude: request.longitude,
        distance: parseFloat(calculateDistance(
          volunteerLat,
          volunteerLng,
          request.latitude,
          request.longitude
        )),
        priority: request.priority || 'medium',
        status: request.status
      }))
      .filter(item => item.distance <= 10) // Within 10km
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return a.distance - b.distance;
      });
    
    res.json(nearbyVictims);
    
  } catch (error) {
    console.error('Error fetching nearby victims:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nearby victims'
    });
  }
});

module.exports = router;
```

### Step 3: Register Route in Express App

```javascript
// app.js
const volunteerRoutes = require('./routes/volunteer');

app.use('/api/volunteers', volunteerRoutes);
```

---

## Test Data SQL (for PostgreSQL)

```sql
-- Create victims table
CREATE TABLE IF NOT EXISTS aid_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  victim_name VARCHAR(255) NOT NULL,
  location VARCHAR(500) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'pending',
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index
CREATE INDEX idx_location ON aid_requests USING gist(
  ll_to_earth(latitude, longitude)
);

-- Insert test data
INSERT INTO aid_requests (victim_name, location, latitude, longitude, priority, status, phone)
VALUES 
  ('Ahmed Ali', 'House #42, Street 5, Sector G-7', 33.6870, 73.0495, 'high', 'active', '+92-300-1234567'),
  ('Fatima Khan', 'Apartment 5B, Plaza Heights, Sector F-8', 33.6900, 73.0520, 'medium', 'active', '+92-300-7654321'),
  ('Hassan Ahmed', 'Shop #12, Main Market, Blue Area', 33.6750, 73.0400, 'low', 'pending', '+92-300-9876543'),
  ('Ayesha Malik', 'Office Complex, Jinnah Avenue', 33.7000, 73.0600, 'medium', 'active', '+92-300-1111111'),
  ('Muhammad Hassan', 'Residential Block 7, G-6', 33.6650, 73.0300, 'high', 'pending', '+92-300-2222222');

-- Query with PostGIS distance (within 10km)
SELECT 
  id,
  victim_name,
  location,
  latitude,
  longitude,
  priority,
  status,
  earth_distance(ll_to_earth(33.6844, 73.0479), ll_to_earth(latitude, longitude)) / 1000 as distance_km
FROM aid_requests
WHERE status IN ('active', 'pending')
  AND earth_distance(ll_to_earth(33.6844, 73.0479), ll_to_earth(latitude, longitude)) / 1000 <= 10
ORDER BY priority DESC, distance_km ASC;
```

---

## Pagination (Optional)

For large datasets, implement pagination:

```javascript
router.get('/victims/nearby', auth, async (req, res) => {
  try {
    const { lat, lng, page = 1, limit = 20 } = req.query;
    
    // ... validation code ...
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const aidRequests = await AidRequest.find({
      status: { $in: ['active', 'pending'] }
    })
    .skip(skip)
    .limit(parseInt(limit));
    
    const total = await AidRequest.countDocuments({
      status: { $in: ['active', 'pending'] }
    });
    
    // ... calculation code ...
    
    res.json({
      data: nearbyVictims,
      pagination: {
        current: parseInt(page),
        total: total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    // ... error handling ...
  }
});
```

---

## Caching (Optional)

For better performance:

```javascript
const redis = require('redis');
const client = redis.createClient();

router.get('/victims/nearby', auth, async (req, res) => {
  const { lat, lng } = req.query;
  const cacheKey = `victims:${lat}:${lng}`;
  
  // Check cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // ... fetch from DB ...
  
  // Set cache for 5 minutes
  await client.setEx(cacheKey, 300, JSON.stringify(nearbyVictims));
  
  res.json(nearbyVictims);
});
```

---

## Testing the Endpoint

### cURL
```bash
curl "http://localhost:5000/api/volunteers/victims/nearby?lat=33.6844&lng=73.0479" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript/Fetch
```javascript
const response = await fetch(
  '/api/volunteers/victims/nearby?lat=33.6844&lng=73.0479',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const data = await response.json();
console.log(data);
```

### Postman
1. Method: GET
2. URL: `http://localhost:5000/api/volunteers/victims/nearby`
3. Query Params:
   - `lat`: 33.6844
   - `lng`: 73.0479
4. Headers:
   - `Authorization`: Bearer YOUR_TOKEN

---

**Ready to implement!** Follow the steps above to get your backend API running.

