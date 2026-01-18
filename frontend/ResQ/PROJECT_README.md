# ResQ - Disaster Relief Management System

## Project Overview
ResQ is a desktop-based Disaster Relief Management System designed to help disaster victims, NGOs, donors, and volunteers coordinate relief efforts efficiently. Built with React, Tailwind CSS, and Java Maven backend.

## Team 3 - BSE-4B
- **Muhammad Zaigham Asif** (23L-3058) - UC-1, UC-2, UC-3
- **Muhammad Abdullah Latif** (23L-3080) - UC-4, UC-5, UC-6, UC-7
- **Muhammad Shuja Jamal** (23L-3024) - UC-8, UC-9, UC-10, UC-11
- **Abu Bakar Afzal** (23L-3062) - UC-12, UC-13, UC-14, UC-15
- **Walija Fatima** (23L-3055) - UC-16, UC-17, UC-18, UC-19
- **Fatima Tuz Zahra** (23L-3099) - UC-20, UC-21, UC-22, UC-23

## Tech Stack
- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **Backend**: Java Maven (Spring Boot)
- **Database**: SQL

## Project Structure
```
ResQ/
├── src/
│   ├── components/        # Reusable components
│   │   ├── common/       # Common components (Navbar, Footer, etc.)
│   │   ├── admin/        # Admin-specific components
│   │   ├── volunteer/    # Volunteer-specific components
│   │   ├── donor/        # Donor-specific components
│   │   └── victim/       # Victim-specific components
│   ├── pages/            # Page components
│   │   ├── general/      # Public pages (Home, Login, Signup, Search)
│   │   ├── admin/        # Admin pages
│   │   ├── volunteer/    # Volunteer pages
│   │   ├── donor/        # Donor pages
│   │   └── victim/       # Victim pages
│   ├── context/          # React Context (Auth, etc.)
│   ├── utils/            # Utility functions (API, validation, helpers)
│   ├── App.jsx           # Main app component with routing
│   └── main.jsx          # Entry point
├── public/               # Static assets
└── package.json          # Dependencies
```

## Features by Actor

### Admin
- **UC-1**: Add Disaster - Create new disaster entries
- **UC-2**: Remove Disaster - Delete disaster records
- **UC-3**: Verify Disaster - Approve/reject reported incidents
- **UC-4**: View Volunteers - See all registered volunteers
- **UC-5**: View Donations - Track incoming donations
- **UC-6**: Verify Donor - Approve donor verification requests
- **UC-7**: Verify Aid Request - Approve pending aid requests

### Volunteer
- **UC-14**: Choose Volunteer Role - Select on-field/off-field role
- **UC-15**: Choose Task - Select from available tasks
- **UC-16**: View Google Map - See victims within 5km radius
- **UC-17**: Update Tasks - Update progress on assigned tasks

### Donor
- **UC-18**: Donate Currency - Make monetary donations
- **UC-19**: Donate Items - Donate food, clothes, supplies
- **UC-20**: Donate to Specific Disaster - Target specific disasters
- **UC-21**: Offer Shelter - Provide shelter to victims

### Victim
- **UC-22**: Request Aid - Request food, clothes, shelter, medical help
- **UC-23**: Receive Aid - Confirm receipt of aid

### General (All Users)
- **UC-8**: Perform Basic Search - Search disasters by keywords
- **UC-9**: Perform Advanced Search - Filter by area code, city
- **UC-10**: Login - User authentication
- **UC-11**: Report Disaster - Report new incidents
- **UC-12**: Logout - End user session
- **UC-13**: Sign Up - Create new account

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Java JDK 17+ (for backend)
- Maven (for backend)

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend/ResQ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your API URL and Google Maps API key

4. **Run development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup
(See backend README for detailed instructions)

1. Navigate to backend directory
2. Configure database connection
3. Run Maven build
4. Start Spring Boot application on port 8080

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Disasters
- `GET /api/disasters` - Get all disasters
- `GET /api/disasters/search?query={query}` - Search disasters
- `GET /api/disasters/pending` - Get pending disaster reports
- `POST /api/disasters` - Create new disaster (Admin only)
- `POST /api/disasters/report` - Report new disaster
- `POST /api/disasters/{id}/verify` - Verify/reject disaster
- `DELETE /api/disasters/{id}` - Remove disaster

### Volunteers
- `GET /api/volunteers` - Get all volunteers
- `GET /api/volunteers/tasks` - Get available tasks
- `POST /api/volunteers/tasks/{id}/update` - Update task progress

### Donors & Donations
- `GET /api/donors/verify` - Get pending donor verifications
- `POST /api/donors/{id}/verify` - Verify donor
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Make a donation

### Victims & Aid
- `GET /api/aid-requests` - Get all aid requests
- `POST /api/aid-requests` - Request aid
- `POST /api/aid-requests/{id}/verify` - Verify aid request
- `POST /api/aid-requests/{id}/receive` - Confirm aid received

## Non-Functional Requirements (NFR)

### Performance (NFR 1)
- Page load time: < 10 seconds
- User actions processed within 10 seconds

### Safety (NFR 2)
- Role-based access control (RBAC)
- Input validation for all forms
- Special characters blocked in critical fields

### Security (NFR 3)
- User authentication required
- Role-based authorization
- Secure API communication

### Quality Attributes (NFR 4)
- **Usability**: 90% task completion rate
- **Maintainability**: 90% unit test coverage
- **Reliability**: 90% uptime
- **Portability**: Browser compatibility (Chrome)

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow ESLint rules
- Use Tailwind CSS for styling
- Keep components small and focused

### Naming Conventions
- Components: PascalCase (e.g., `AdminDashboard.jsx`)
- Files: PascalCase for components, camelCase for utilities
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

### Git Workflow
1. Create feature branch from main
2. Make changes and commit with descriptive messages
3. Create pull request for review
4. Merge after approval

## Testing

### Run ESLint
```bash
npm run lint
```

### Run Tests (when implemented)
```bash
npm test
```

## Deployment

### Frontend Deployment
```bash
npm run build
```
Deploy the `dist` folder to your hosting service.

### Backend Deployment
Package the Spring Boot application as JAR and deploy to server.

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
```

### API Connection Error
- Verify backend is running on port 8080
- Check `.env` file has correct API URL
- Check CORS configuration in backend

## License
This is a university project for SE course - Spring 2025

## Contact
For questions or issues, contact team members via university email.
