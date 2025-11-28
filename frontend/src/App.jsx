import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateAnnouncement from './pages/CreateAnnouncement';
import AnnouncementDetails from './pages/AnnouncementDetails';  // ← THIS WAS MISSING!!!
import Profile from './pages/Profile';
import EditAnnouncement from './pages/EditAnnouncement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            <Route path="/announcements/:id" element={<AnnouncementDetails />} />

            {/* Guest only */}
            <Route 
              path="/login" 
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-announcement" 
              element={
                <ProtectedRoute>
                  <CreateAnnouncement />
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
            <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
              path="/edit-announcement/:id" 
              element={
                <ProtectedRoute>
                  <EditAnnouncement />
                </ProtectedRoute>
              } 
/>
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;