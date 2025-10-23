import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText,
  Settings,
  Stethoscope,
  UserCheck,
  ClipboardList
} from 'lucide-react'

export default function Sidebar({ demoRole = null }) {
  const { profile } = useAuth()
  const location = useLocation()
  const role = profile?.role || demoRole

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { path: '/admin/users', icon: Users, label: 'User Management' },
          { path: '/admin/appointments', icon: Calendar, label: 'Appointments' },
          { path: '/admin/reports', icon: FileText, label: 'Reports' },
        ]
      case 'doctor':
        return [
          { path: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { path: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
          { path: '/doctor/patients', icon: Users, label: 'My Patients' },
          { path: '/doctor/schedule', icon: ClipboardList, label: 'Schedule' },
        ]
      case 'staff':
        return [
          { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { path: '/staff/patients', icon: Users, label: 'Assigned Patients' },
          { path: '/staff/appointments', icon: Calendar, label: 'Appointments' },
          { path: '/staff/attendance', icon: UserCheck, label: 'Attendance' },
        ]
      case 'patient':
        return [
          { path: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { path: '/patient/appointments', icon: Calendar, label: 'My Appointments' },
          { path: '/patient/doctors', icon: Stethoscope, label: 'Find Doctors' },
          { path: '/patient/profile', icon: Settings, label: 'Profile' },
        ]
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-blue-500 to-indigo-500'
      case 'doctor':
        return 'from-green-500 to-emerald-500'
      case 'staff':
        return 'from-orange-500 to-red-500'
      case 'patient':
        return 'from-teal-500 to-cyan-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors">
      <div className="p-6">
        {/* Role Badge */}
        <div className={`mb-6 p-4 bg-gradient-to-r ${getRoleColor(role)} rounded-xl text-white`}>
          <div className="text-sm opacity-90 mb-1">Welcome</div>
          <div className="font-bold text-lg capitalize">{role} Panel</div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r ' + getRoleColor(role) + ' text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Quick Info */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            Quick Info
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {role === 'admin' && '🎯 Manage hospital operations'}
            {role === 'doctor' && '🩺 Care for your patients'}
            {role === 'staff' && '📋 Support healthcare delivery'}
            {role === 'patient' && '💊 Track your health journey'}
          </div>
        </div>
      </div>
    </aside>
  )
}
