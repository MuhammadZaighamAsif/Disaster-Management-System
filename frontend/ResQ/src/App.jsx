import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';

// General Pages
import Home from './pages/general/Home';
import Login from './pages/general/Login';
import Signup from './pages/general/Signup';
import Search from './pages/general/Search';
import ReportDisaster from './pages/general/ReportDisaster';

// Common Pages
import Profile from './pages/common/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddDisaster from './pages/admin/AddDisaster';
import ManageDisasters from './pages/admin/ManageDisasters';
import VerifyDisasters from './pages/admin/VerifyDisasters';
import ViewVolunteers from './pages/admin/ViewVolunteers';
import ViewDonations from './pages/admin/ViewDonations';
import VerifyDonors from './pages/admin/VerifyDonors';
import VerifyAidRequests from './pages/admin/VerifyAidRequests';
import CreateTask from './pages/admin/CreateTask';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import ChooseRole from './pages/volunteer/ChooseRole';
import ChooseTask from './pages/volunteer/ChooseTask';
import ViewMap from './pages/volunteer/ViewMap';
import UpdateTasks from './pages/volunteer/UpdateTasks';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import DonateMoney from './pages/donor/DonateMoney';
import DonateItems from './pages/donor/DonateItems';
import OfferShelter from './pages/donor/OfferShelter';
import DonationHistory from './pages/donor/DonationHistory';

// Victim Pages
import VictimDashboard from './pages/victim/VictimDashboard';
import RequestAid from './pages/victim/RequestAid';
import AidStatus from './pages/victim/AidStatus';
import AvailableShelters from './pages/victim/AvailableShelters';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const userRole = user?.role || user?.data?.user?.role;
  
  if (allowedRoles && userRole) {
    const roleLower = userRole.toLowerCase();
    if (!allowedRoles.includes(roleLower)) {
      return <Navigate to={`/${roleLower}/dashboard`} />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<Search />} />

            {/* Common Authenticated Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['admin', 'volunteer', 'donor', 'victim']}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/disasters/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddDisaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/disasters/manage"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageDisasters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/disasters/verify"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <VerifyDisasters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/volunteers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ViewVolunteers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/donations"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ViewDonations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/donors/verify"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <VerifyDonors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/aid-requests"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <VerifyAidRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tasks/create"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CreateTask />
                </ProtectedRoute>
              }
            />

            {/* Volunteer Routes */}
            <Route
              path="/volunteer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <VolunteerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer/role"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <ChooseRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer/tasks"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <ChooseTask />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer/map"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <ViewMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer/tasks/update"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <UpdateTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer/report-disaster"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <ReportDisaster />
                </ProtectedRoute>
              }
            />

            {/* Donor Routes */}
            <Route
              path="/donor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/donate-money"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <DonateMoney />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/donate-items"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <DonateItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/offer-shelter"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <OfferShelter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/history"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <DonationHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/report-disaster"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <ReportDisaster />
                </ProtectedRoute>
              }
            />

            {/* Victim Routes */}
            <Route
              path="/victim/dashboard"
              element={
                <ProtectedRoute allowedRoles={['victim']}>
                  <VictimDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/victim/request-aid"
              element={
                <ProtectedRoute allowedRoles={['victim']}>
                  <RequestAid />
                </ProtectedRoute>
              }
            />
            <Route
              path="/victim/aid-status"
              element={
                <ProtectedRoute allowedRoles={['victim']}>
                  <AidStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/victim/shelters"
              element={
                <ProtectedRoute allowedRoles={['victim']}>
                  <AvailableShelters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/victim/report-disaster"
              element={
                <ProtectedRoute allowedRoles={['victim']}>
                  <ReportDisaster />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
