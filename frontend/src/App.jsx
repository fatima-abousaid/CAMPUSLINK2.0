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
<<<<<<< HEAD
import AnnouncementDetails from './pages/AnnouncementDetails';
import Profile from './pages/Profile';
import EditAnnouncement from './pages/EditAnnouncement';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
=======
import AnnouncementDetails from './pages/AnnouncementDetails';  // ← THIS WAS MISSING!!!
import Profile from './pages/Profile';
import EditAnnouncement from './pages/EditAnnouncement';
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
<<<<<<< HEAD
            <Route path="/announcements/:id" element={<AnnouncementDetails />} />

            {/* Guest only */}
            <Route
              path="/login"
=======

            <Route path="/announcements/:id" element={<AnnouncementDetails />} />

            {/* Guest only */}
            <Route 
              path="/login" 
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
<<<<<<< HEAD
              }
            />
            <Route
              path="/register"
=======
              } 
            />
            <Route 
              path="/register" 
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
<<<<<<< HEAD
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
=======
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
<<<<<<< HEAD
              }
            />
            <Route
              path="/create-announcement"
=======
              } 
            />
            <Route 
              path="/create-announcement" 
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
              element={
                <ProtectedRoute>
                  <CreateAnnouncement />
                </ProtectedRoute>
<<<<<<< HEAD
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
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
=======
              } 
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
            />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
<<<<<<< HEAD
=======
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
>>>>>>> 51dfc8b9df3a6d096f5476827fc51edbb9a4367a
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;