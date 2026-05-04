import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import VenueDetail from './pages/student/VenueDetail';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';
import { roleHomePath } from './utils/jwt';

const App = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute allowedRoles={['student']} />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/venue/:venueId" element={<VenueDetail />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['teacher']} />}>
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/venue/:venueId" element={<VenueDetail />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated && user ? roleHomePath(user.role) : '/login'} replace />}
      />
    </Routes>
  );
};

export default App;
