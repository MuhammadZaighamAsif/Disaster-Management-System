# ResQ Frontend - React + Vite

Modern React frontend for the ResQ Disaster Relief Management System.

## Quick Start

```bash
cd frontend/ResQ
npm install
npm run dev  # Starts on http://localhost:5173
```

## Tech Stack

- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool & dev server
- **Tailwind CSS** 4.0.0 - Utility-first styling
- **React Router** 7.12.0 - Client-side routing
- **Leaflet** 1.9.4 - Interactive maps
- **Recharts** 3.6.0 - Data visualization
- **FontAwesome** 7.1.0 - Icons
- **Axios** 1.6.0 - HTTP client

## Project Structure

```
src/
├── pages/              # Page components by role
│   ├── general/       # Home, Login, Signup, Search
│   ├── victim/        # Victim dashboard & pages
│   ├── donor/         # Donor dashboard & pages
│   ├── volunteer/     # Volunteer dashboard & pages
│   └── admin/         # Admin dashboard & pages
├── components/        # Reusable components
│   ├── common/       # Navbar, Footer, Layout, Cards
│   ├── victim/
│   ├── donor/
│   ├── volunteer/
│   └── admin/
├── context/          # React Context (AuthContext)
├── utils/            # API client, helpers, validation
├── styles/           # CSS files (map.css)
├── assets/           # Images, icons
├── config/           # Configuration (api.js)
├── App.jsx           # Root component with routes
├── main.jsx          # Entry point
└── index.css         # Global Tailwind styles
```

## Configuration

Update API base URL in `src/config/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
export default API_BASE_URL;
```

## Key Features

### Authentication
- JWT token-based authentication
- Role-based access control (Victim, Donor, Volunteer, Admin)
- Protected routes with AuthContext
- Persistent login with localStorage

### User Roles & Pages

**Victim Pages**
- Dashboard, Report Disaster, Request Aid, Aid Status, Find Shelters

**Donor Pages**
- Dashboard, Donate Money, Donate Items, Offer Shelter, Donation History

**Volunteer Pages**
- Dashboard, View Victim Map (Leaflet), Choose Tasks, Update Tasks, History

**Admin Pages**
- Dashboard, Verify Disasters, Verify Donors, Verify Volunteers, Manage Disasters, View Donations, View Volunteers

### Map Integration

Uses **Leaflet** + **OpenStreetMap** for volunteer victim mapping:
- Real-time geolocation
- Color-coded markers (Red=High, Yellow=Medium, Green=Low priority)
- Distance calculation
- Interactive popups
- No API key required

```javascript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
```

### Styling

**Tailwind CSS** with custom donor color palette:
- 12 donor-themed colors (e.g., `bg-donor-rose-400`, `text-donor-coral-500`)
- Responsive design (mobile-first)
- Custom components in `components/common/`

### Form Validation

Input validation for all forms:
- Email format validation
- Password strength requirements
- CNIC format validation
- Phone number validation
- Custom error messages

## Available Scripts

```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Components

### Common Components
- `<Navbar />` - Responsive navigation with role-based links
- `<Footer />` - Site footer with links
- `<Layout />` - Page layout wrapper
- `<Card />` - Reusable card component
- `<SearchBar />` - Search with FontAwesome icons
- `<LogoutConfirmationModal />` - Logout confirmation

### Role-Specific Components
Each role has dedicated components in their respective directories

## Routing

Protected routes with role-based access:

```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  
  {/* Victim Routes */}
  <Route path="/victim/dashboard" element={<ProtectedRoute><VictimDashboard /></ProtectedRoute>} />
  
  {/* Donor Routes */}
  <Route path="/donor/dashboard" element={<ProtectedRoute><DonorDashboard /></ProtectedRoute>} />
  
  {/* Volunteer Routes */}
  <Route path="/volunteer/dashboard" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
  
  {/* Admin Routes */}
  <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
</Routes>
```

## State Management

Uses React Context API:
- **AuthContext** - User authentication state, login/logout functions

## API Integration

Axios client in `src/utils/api.js`:

```javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## Build for Production

```bash
npm run build
```

Outputs to `dist/` folder. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Environment Variables

For production, create `.env`:

```env
VITE_API_URL=https://your-backend-api.com/api
```

Access in code: `import.meta.env.VITE_API_URL`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Adding a New Page

1. Create component in `src/pages/[role]/`
2. Add route in `App.jsx`
3. Add navigation link in `Navbar.jsx`
4. Create API functions in `src/utils/api.js`

### Styling Guidelines

- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use donor color palette for consistency
- Keep components modular and reusable

## Resources

- [React Docs](https://react.dev/)
- [Vite Guide](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Leaflet Documentation](https://leafletjs.com/)
- [React Router](https://reactrouter.com/)

## Troubleshooting

**Map not loading**: Check Leaflet CSS import and OpenStreetMap tiles  
**API errors**: Verify backend is running on port 5000  
**Build errors**: Clear `node_modules` and reinstall: `npm install`  
**Routing issues**: Check `basename` in `BrowserRouter`
