# Map Integration for Volunteers - Documentation

## Overview
The ResQ volunteer section now integrates **Leaflet** with **OpenStreetMap** to display victim locations on an interactive map. This is a free, open-source alternative to Google Maps.

## Technologies Used

### 1. **Leaflet** (Map Library)
- **Website**: https://leafletjs.com/
- **License**: BSD-2-Clause (Open Source)
- **Package**: `leaflet` (v1.9.4)
- **React Wrapper**: `react-leaflet` (v5.0.0)

**Why Leaflet?**
- Lightweight and fast
- Free and open-source
- Excellent for interactive maps
- Great documentation and community support
- Works seamlessly with React

### 2. **OpenStreetMap** (Tile Provider)
- **Website**: https://www.openstreetmap.org/
- **License**: Open Data Commons (Free to use)
- **Usage**: Provides map tiles via URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

**Why OpenStreetMap?**
- Completely free
- No API key required
- Community-driven and continuously updated
- Respects user privacy (no tracking)

## Features Implemented

### 1. **Interactive Map Display**
- Center map on volunteer's current location
- Zoom level: 13 (neighborhood level)
- Responsive design (500px height on desktop)

### 2. **Geolocation Integration**
```javascript
navigator.geolocation.getCurrentPosition()
```
- Requests user's permission to access GPS location
- Falls back to default location (Islamabad: 33.6844, 73.0479) if denied
- Passes coordinates to backend API

### 3. **Color-Coded Markers**
- **Red Markers**: High Priority Victims
- **Yellow Markers**: Medium Priority Victims
- **Green Markers**: Low Priority Victims

Uses CDN-hosted marker images:
```
https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-{color}.png
```

### 4. **Popup Information**
Each marker shows on click:
- Victim's name
- Location address
- Distance from volunteer (in km)
- Priority level
- Current status

### 5. **Volunteer Location Indicator**
- Shows volunteer's current position with blue marker
- Labeled as "Your Location"

### 6. **Sidebar List**
- Shows victim count
- Lists all nearby victims with:
  - Name and address
  - Distance calculation
  - Color-coded priority indicators
  - "View Details" button
- Priority legend at bottom

## Installation & Setup

### Already Installed Dependencies
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0"
}
```

If they're not installed, run:
```bash
npm install leaflet react-leaflet
```

### CSS Import
The Leaflet CSS is automatically imported in ViewMap.jsx:
```javascript
import 'leaflet/dist/leaflet.css';
```

## File Structure

```
frontend/ResQ/src/
├── pages/
│   └── volunteer/
│       └── ViewMap.jsx          # Main map component
├── styles/
│   └── map.css                  # Custom map styles
```

## Component Props & State

### State Management
```javascript
const [victims, setVictims] = useState([])              // List of nearby victims
const [loading, setLoading] = useState(true)            // Loading state
const [error, setError] = useState('')                  // Error messages
const [volunteerLocation, setVolunteerLocation] = useState(null)  // Volunteer GPS coords
```

### Backend API Integration
- **Endpoint**: `GET /api/volunteers/victims/nearby?lat={lat}&lng={lng}`
- **Query Parameters**: 
  - `lat`: Volunteer's latitude
  - `lng`: Volunteer's longitude
- **Expected Response**:
```javascript
[
  {
    id: "123",
    name: "Ahmed Ali",
    location: "House #42, Street 5, Sector G-7",
    latitude: 33.6844,
    longitude: 73.0479,
    distance: 2.5,
    priority: "high",  // high | medium | low
    status: "Waiting for help"
  },
  // ... more victims
]
```

## Usage Example

### How Volunteers Use It:
1. Login as a volunteer
2. Navigate to "View Map" from volunteer dashboard
3. Browser requests location permission
4. Map loads with:
   - Volunteer's current position
   - All nearby victims (within 5km radius)
   - Color-coded pins by priority
5. Click any pin to see detailed popup
6. Click "View Details" in sidebar for full victim profile

## Map Libraries Comparison

| Feature | Leaflet | Google Maps | Mapbox |
|---------|---------|------------|--------|
| Cost | FREE | Paid | Paid |
| License | Open Source | Proprietary | Proprietary |
| API Key Required | No | Yes | Yes |
| React Support | Excellent | Good | Good |
| Performance | Excellent | Good | Excellent |
| Customization | High | Medium | High |

## Future Enhancements

1. **Route Optimization**
   - Add routing to show fastest path to victim
   - Use OSRM (Open Source Routing Machine)

2. **Real-Time Updates**
   - WebSocket integration for live victim location updates
   - Automatic map refresh every 30 seconds

3. **Heatmap Visualization**
   - Show concentration of victims by area
   - Use Leaflet.heat plugin

4. **Cluster Markers**
   - Group nearby markers when zoomed out
   - Use Leaflet.MarkerCluster plugin

5. **GeoSearch**
   - Add search box for finding specific locations
   - Use Leaflet-Geosearch plugin

6. **Multiple Map Providers**
   - Allow switching between OSM, Satellite, Terrain views
   - Use Leaflet-provider plugin

## Troubleshooting

### Issue: Map not displaying
- **Solution**: Ensure Leaflet CSS is imported
- Check browser console for errors
- Verify backend API is running

### Issue: Geolocation not working
- **Cause**: HTTPS required in production (HTTP works locally)
- **Solution**: Enable location permission in browser settings
- Fallback to default location works

### Issue: Markers not showing
- **Cause**: CDN for marker images may be blocked
- **Solution**: Download markers locally or use alternative CDN
- Fallback to default blue markers

### Issue: Map controls not visible
- **Cause**: CSS not properly imported
- **Solution**: Clear browser cache
- Rebuild with `npm run build`

## Security Considerations

1. **User Privacy**
   - Location data only sent to backend
   - Not stored permanently (only session use)
   - User must grant permission

2. **API Security**
   - Backend should validate coordinates
   - Add rate limiting to `/api/volunteers/victims/nearby`
   - Implement JWT token verification

3. **Frontend Security**
   - Sanitize victim data before display
   - Validate all marker data from backend

## Performance Optimization

1. **Lazy Loading**
   - Map only loads when component mounts
   - Victims list updates asynchronously

2. **Marker Caching**
   - Color icons pre-loaded
   - Reduces render time

3. **Responsive Design**
   - Map height adjusts to screen size
   - Sidebar scrollable on mobile

## Testing Checklist

- [ ] Map loads with correct center location
- [ ] Markers display with correct colors
- [ ] Popups show complete victim information
- [ ] Sidebar list matches map markers
- [ ] Geolocation permission request appears
- [ ] Works on mobile browsers
- [ ] Works on desktop browsers
- [ ] Handles API errors gracefully
- [ ] Fallback location works when geolocation denied
- [ ] Performance is acceptable (< 2s load time)

## References

- **Leaflet Documentation**: https://leafletjs.com/reference.html
- **React-Leaflet Documentation**: https://react-leaflet.js.org/
- **OpenStreetMap**: https://www.openstreetmap.org/
- **Leaflet Color Markers**: https://github.com/pointhi/leaflet-color-markers

## License

- Leaflet: BSD-2-Clause
- OpenStreetMap: ODbL (Open Data Commons)
- ResQ: As per project license
