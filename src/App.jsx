import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Landing from './pages/Landing'
import AdminDashboard from './pages/Admin/Dashboard'
import UserManagement from './pages/Admin/UserManagement'
import Appointments from './pages/Admin/Appointments'
import Reports from './pages/Admin/Reports'
import StaffDashboard from './pages/Staff/Dashboard'
import StaffPatients from './pages/Staff/Patients'
import StaffAppointments from './pages/Staff/Appointments'
import StaffAttendance from './pages/Staff/Attendance'
import PatientDashboard from './pages/Patient/Dashboard'
import PatientAppointments from './pages/Patient/Appointments'
import FindDoctors from './pages/Patient/FindDoctors'
import PatientProfile from './pages/Patient/Profile'
import DoctorDashboard from './pages/Doctor/Dashboard'
import DoctorAppointments from './pages/Doctor/Appointments'
import DoctorPatients from './pages/Doctor/Patients'
import DoctorSchedule from './pages/Doctor/Schedule'
import ProtectedRoute from './components/ProtectedRoute'
import DatabaseCheck from './pages/DatabaseCheck'
import TestConnection from './pages/TestConnection'
import LoadingPage from './pages/LoadingPage'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/database-check" element={<DatabaseCheck />} />
        <Route path="/test" element={<TestConnection />} />

        <Route 
          path="/admin/dashboard" 
          element={<AdminDashboard />} 
        />

        <Route 
          path="/admin/users" 
          element={<UserManagement />} 
        />

        <Route 
          path="/admin/appointments" 
          element={<Appointments />} 
        />

        <Route 
          path="/admin/reports" 
          element={<Reports />} 
        />

        <Route 
          path="/doctor/dashboard" 
          element={<DoctorDashboard />} 
        />

        <Route 
          path="/doctor/appointments" 
          element={<DoctorAppointments />} 
        />

        <Route 
          path="/doctor/patients" 
          element={<DoctorPatients />} 
        />

        <Route 
          path="/doctor/schedule" 
          element={<DoctorSchedule />} 
        />

        <Route 
          path="/staff/dashboard" 
          element={<StaffDashboard />} 
        />

        <Route 
          path="/staff/patients" 
          element={<StaffPatients />} 
        />

        <Route 
          path="/staff/appointments" 
          element={<StaffAppointments />} 
        />

        <Route 
          path="/staff/attendance" 
          element={<StaffAttendance />} 
        />

        <Route 
          path="/patient/dashboard" 
          element={<PatientDashboard />} 
        />

        <Route 
          path="/patient/appointments" 
          element={<PatientAppointments />} 
        />

        <Route 
          path="/patient/doctors" 
          element={<FindDoctors />} 
        />

        <Route 
          path="/patient/profile" 
          element={<PatientProfile />} 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
