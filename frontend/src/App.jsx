
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Lesson from './pages/Lesson'
import Communication from './pages/communication'
import Community from './pages/Community'
import Register from './pages/Register'
import Login from './pages/Login'
import Lessons from './pages/Lessons'

// Protect pages that require a logged-in user
function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('authToken')

  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons"
          element={
            <ProtectedRoute>
              <Lessons />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lesson"
          element={
            <ProtectedRoute>
              <Lesson />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lesson/:lessonId"
          element={
            <ProtectedRoute>
              <Lesson />
            </ProtectedRoute>
          }
        />

        <Route
          path="/communication"
          element={
            <ProtectedRoute>
              <Communication />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />

        {/* Unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
