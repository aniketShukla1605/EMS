import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OrganiserDashboard from './pages/OrganiserDashboard';
import StudentProfile from './pages/StudentProfile';
import AdminProfile from './pages/AdminProfile';
import OrganiserProfile from './pages/OrganiserProfile';
import CreateEvent from './pages/CreateEvent';
import EventRegister from './pages/EventRegister';
import ProtectedRoute from './components/ProtectedRoute'; 
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />

        {/* Student / User Routes */}
        <Route path="/student-dashboard" element={
          <ProtectedRoute allowedRoles={['ROLE_USER']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student-profile" element={
          <ProtectedRoute allowedRoles={['ROLE_USER']}>
            <StudentProfile />
          </ProtectedRoute>
        } />
        <Route path="/event-register" element={
          <ProtectedRoute allowedRoles={['ROLE_USER']}>
            <EventRegister />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminDashboard />
           </ProtectedRoute> 
        } />
        <Route path="/admin-profile" element={
          // <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminProfile />
          // </ProtectedRoute>
        } />

        {/* Organiser Routes */}
        <Route path="/organiser-dashboard" element={
          <ProtectedRoute allowedRoles={['ROLE_ORGANISER', 'ROLE_ADMIN']}>
            <OrganiserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/organiser-profile" element={
          <ProtectedRoute allowedRoles={['ROLE_ORGANISER', 'ROLE_ADMIN']}>
            <OrganiserProfile />
          </ProtectedRoute>
        } />
        <Route path="/create-event" element={
          <ProtectedRoute allowedRoles={['ROLE_ORGANISER', 'ROLE_ADMIN']}>
            <CreateEvent />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;