# Backend API Setup for Map Integration

## Required Endpoint

The frontend expects the following API endpoint:

```
GET /api/volunteers/victims/nearby?lat={latitude}&lng={longitude}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | number | Yes | Volunteer's latitude (decimal) |
| `lng` | number | Yes | Volunteer's longitude (decimal) |

### Response Format

```json
[
  {
    "id": "victim_123",
    "name": "Ahmed Ali",
    "location": "House #42, Street 5, Sector G-7",
    "latitude": 33.6844,
    "longitude": 73.0479,
    "distance": 2.5,
    "priority": "high",
    "status": "Waiting for help"
  },
  {
    "id": "victim_456",
    "name": "Fatima Khan",
    "location": "Apartment 5B, Plaza Heights",
    "latitude": 33.6900,
    "longitude": 73.0520,
    "distance": 1.8,
    "priority": "medium",
    "status": "Aid received"
  },
  {
    "id": "victim_789",
    "name": "Hassan Ahmed",
    "location": "Shop #12, Main Market",
    "latitude": 33.6750,
    "longitude": 73.0400,
    "distance": 4.2,
    "priority": "low",
    "status": "Pending verification"
  }
]
```

### Response Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique victim identifier |
| `name` | string | Yes | Victim's full name |
| `location` | string | Yes | Human-readable address |
| `latitude` | number | Yes | GPS latitude coordinate |
| `longitude` | number | Yes | GPS longitude coordinate |
| `distance` | number | Yes | Distance from volunteer in kilometers |
| `priority` | string | Yes | Priority level: "high", "medium", or "low" |
| `status` | string | Yes | Current aid request status |

### Priority Levels

- **`high`** - Urgent case (injuries, medical emergency, critical need)
- **`medium`** - Important case (significant damage, moderate needs)
- **`low`** - Standard case (minor damage, assistance request)

### Calculation Notes

1. **Distance Calculation**
   - Use Haversine formula to calculate distance between two GPS points
   - Formula: `a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)`
   - Convert to kilometers (Earth radius ≈ 6371 km)

2. **Radius Filter**
   - Frontend displays victims within 5km radius
   - Backend may return all nearby victims (5-10km) for flexibility
   - Distance should be calculated accurately

### Example Node.js/Express Implementation

```javascript
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
};

router.get('/api/volunteers/victims/nearby', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    // Validate input
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }
    
    // Convert to numbers
    const volunteerLat = parseFloat(lat);
    const volunteerLng = parseFloat(lng);
    
    // Validate coordinates
    if (isNaN(volunteerLat) || isNaN(volunteerLng)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates'
      });
    }
    
    // Fetch active aid requests with victim locations
    const victims = await AidRequest.find({ status: 'active' })
      .select('id victimName location latitude longitude priority status')
      .populate('victimId', 'name');
    
    // Calculate distances and filter
    const nearbyVictims = victims
      .map(victim => ({
        id: victim._id,
        name: victim.victimName,
        location: victim.location,
        latitude: victim.latitude,
        longitude: victim.longitude,
        distance: calculateDistance(
          volunteerLat, 
          volunteerLng, 
          victim.latitude, 
          victim.longitude
        ),
        priority: victim.priority || 'medium',
        status: victim.status
      }))
      .filter(victim => victim.distance <= 10) // Keep within 10km for display
      .sort((a, b) => {
        // Sort by priority first, then by distance
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
```

### Error Handling

The frontend expects:

**Success (200):**
```json
[
  { "id": "...", ... },
  { "id": "...", ... }
]
```

**Error (4xx/5xx):**
```json
{
  "success": false,
  "error": "Error message"
}
```

### CORS Configuration

Ensure backend CORS allows requests from frontend:

```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

### Testing the Endpoint

Using cURL:
```bash
curl "http://localhost:5000/api/volunteers/victims/nearby?lat=33.6844&lng=73.0479"
```

Using Postman:
1. Method: GET
2. URL: `http://localhost:5000/api/volunteers/victims/nearby`
3. Query Params:
   - `lat`: 33.6844
   - `lng`: 73.0479

### Performance Optimization

1. **Indexing**
   ```javascript
   // Add indexes for faster queries
   victimSchema.index({ latitude: 1, longitude: 1 });
   victimSchema.index({ status: 1 });
   ```

2. **Pagination** (Optional)
   ```javascript
   // Limit results to top 20 closest victims
   .limit(20)
   ```

3. **Caching**
   - Cache results for 2-5 minutes
   - Invalidate on new aid requests

### Security Checklist

- [ ] Validate latitude/longitude ranges (-90 to 90, -180 to 180)
- [ ] Implement rate limiting (prevent abuse)
- [ ] Verify volunteer authentication (JWT token)
- [ ] Sanitize data before sending to frontend
- [ ] Log API access for security audit
- [ ] Handle null/undefined coordinates gracefully

### Related Endpoints

Consider also implementing:

```bash
GET /api/volunteers/victims/{victimId}
# Get full details of a specific victim

POST /api/volunteers/task/accept/{victimId}
# Volunteer accepts a victim's aid request

PUT /api/volunteers/task/{taskId}/update
# Update task status
```
