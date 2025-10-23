import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import DashboardCard from '../../components/DashboardCard'
import { supabase } from '../../utils/supabaseClient'
import toast from 'react-hot-toast'
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Bell, 
  Activity,
  Stethoscope,
  X,
  Send
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const [counts, setCounts] = useState({ 
    patients: 0, 
    doctors: 0,
    staff: 0, 
    appointments: 0,
    activeAppointments: 0,
    notices: 0 
  })
  const [showNoticeModal, setShowNoticeModal] = useState(false)
  const [noticeForm, setNoticeForm] = useState({ title: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [recentNotices, setRecentNotices] = useState([])

  // Demo mode - use mock data if no profile
  const demoMode = !profile

  useEffect(() => {
    if (demoMode) {
      loadMockData()
    } else {
      loadCounts()
      loadUsers()
      loadRecentData()
      setupRealtimeSubscription()
    }
  }, [demoMode])

  const loadMockData = () => {
    setCounts({
      patients: 45,
      doctors: 12,
      staff: 18,
      appointments: 156,
      activeAppointments: 23,
      notices: 8
    })
    
    setAllUsers([
      { id: '1', name: 'John Doe', email: 'john@hospital.com', role: 'patient', created_at: '2025-10-20' },
      { id: '2', name: 'Dr. Sarah Wilson', email: 'sarah@hospital.com', role: 'doctor', specialization: 'Cardiologist', created_at: '2025-10-18' },
      { id: '3', name: 'Mike Johnson', email: 'mike@hospital.com', role: 'staff', created_at: '2025-10-19' },
      { id: '4', name: 'Emily Davis', email: 'emily@hospital.com', role: 'patient', created_at: '2025-10-21' },
      { id: '5', name: 'Dr. James Chen', email: 'james@hospital.com', role: 'doctor', specialization: 'Neurologist', created_at: '2025-10-17' },
    ])
    
    setRecentAppointments([
      { id: '1', patient: { name: 'John Doe' }, doctor: { name: 'Dr. Sarah Wilson' }, date: '2025-10-25', time: '10:00 AM', status: 'accepted' },
      { id: '2', patient: { name: 'Emily Davis' }, doctor: { name: 'Dr. James Chen' }, date: '2025-10-25', time: '02:00 PM', status: 'pending' },
      { id: '3', patient: { name: 'Robert Brown' }, doctor: { name: 'Dr. Sarah Wilson' }, date: '2025-10-26', time: '11:30 AM', status: 'accepted' },
    ])
    
    setRecentNotices([
      { id: '1', title: 'Hospital Maintenance', message: 'Scheduled maintenance on Oct 30', created_at: '2025-10-22', created_by: { name: 'Admin' } },
      { id: '2', title: 'New Equipment', message: 'New MRI machine installed', created_at: '2025-10-21', created_by: { name: 'Admin' } },
    ])
  }

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) throw error
      setAllUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadRecentData = async () => {
    try {
      // Load recent appointments
      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patient_id(name),
          doctor:doctor_id(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (!apptError) setRecentAppointments(appointments || [])
      
      // Load recent notices
      const { data: notices, error: noticeError } = await supabase
        .from('notices')
        .select(`
          *,
          created_by:created_by(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (!noticeError) setRecentNotices(notices || [])
    } catch (error) {
      console.error('Error loading recent data:', error)
    }
  }

  const loadCounts = async () => {
    try {
      const { count: patients } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'patient')
      
      const { count: doctors } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'doctor')
      
      const { count: staff } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'staff')
      
      const { count: appointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
      
      const { count: activeAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'accepted'])
      
      const { count: notices } = await supabase
        .from('notices')
        .select('*', { count: 'exact', head: true })
      
      setCounts({ 
        patients: patients || 0, 
        doctors: doctors || 0,
        staff: staff || 0, 
        appointments: appointments || 0,
        activeAppointments: activeAppointments || 0,
        notices: notices || 0 
      })
    } catch (error) {
      console.error('Error loading counts:', error)
      toast.error('Error loading dashboard data')
    }
  }

  const setupRealtimeSubscription = () => {
    const appointmentsChannel = supabase
      .channel('admin-appointments')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' }, 
        (payload) => {
          console.log('Appointment change:', payload)
          loadCounts() // Reload counts on any change
          
          if (payload.eventType === 'INSERT') {
            toast.success('New appointment created!', { icon: '📅' })
          }
        }
      )
      .subscribe()

    const profilesChannel = supabase
      .channel('admin-profiles')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'profiles' }, 
        (payload) => {
          console.log('New user registered:', payload)
          loadCounts()
          toast.success(`New ${payload.new.role} registered!`, { icon: '👤' })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(appointmentsChannel)
      supabase.removeChannel(profilesChannel)
    }
  }

  const handleSendNotice = async (e) => {
    e.preventDefault()
    
    if (!noticeForm.title.trim() || !noticeForm.message.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    if (demoMode) {
      // Demo mode - simulate success
      setTimeout(() => {
        toast.success('Notice sent successfully! (Demo Mode)')
        const newNotice = {
          id: Date.now().toString(),
          title: noticeForm.title,
          message: noticeForm.message,
          created_at: new Date().toISOString(),
          created_by: { name: 'Demo Admin' }
        }
        setRecentNotices([newNotice, ...recentNotices].slice(0, 5))
        setCounts({ ...counts, notices: counts.notices + 1 })
        setNoticeForm({ title: '', message: '' })
        setShowNoticeModal(false)
        setIsSubmitting(false)
      }, 1000)
      return
    }

    try {
      const { error } = await supabase
        .from('notices')
        .insert({
          title: noticeForm.title,
          message: noticeForm.message,
          created_by: profile?.id
        })

      if (error) throw error

      toast.success('Notice sent successfully!')
      setNoticeForm({ title: '', message: '' })
      setShowNoticeModal(false)
      loadCounts()
      loadRecentData()
    } catch (error) {
      console.error('Error sending notice:', error)
      toast.error('Failed to send notice')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar demoRole="admin" />
      <div className="flex">
        <Sidebar demoRole="admin" />
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {profile?.name || 'Demo Admin'}! Here's your hospital overview.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{counts.patients}</h3>
                <p className="text-blue-100">Total Patients</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{counts.doctors}</h3>
                <p className="text-green-100">Total Doctors</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{counts.staff}</h3>
                <p className="text-orange-100">Total Staff</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{counts.activeAppointments}</h3>
                <p className="text-purple-100">Active Appointments</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{counts.appointments}</h3>
                <p className="text-indigo-100">Total Appointments</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Bell className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{counts.notices}</h3>
                <p className="text-pink-100">Total Notices</p>
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Notice
                </button>
              </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Recent Users */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Recent Users
                </h2>
                <div className="space-y-3">
                  {allUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.role === 'patient' ? 'bg-teal-100 dark:bg-teal-900' :
                          user.role === 'doctor' ? 'bg-green-100 dark:bg-green-900' :
                          user.role === 'staff' ? 'bg-orange-100 dark:bg-orange-900' :
                          'bg-blue-100 dark:bg-blue-900'
                        }`}>
                          <Users className={`w-5 h-5 ${
                            user.role === 'patient' ? 'text-teal-600 dark:text-teal-400' :
                            user.role === 'doctor' ? 'text-green-600 dark:text-green-400' :
                            user.role === 'staff' ? 'text-orange-600 dark:text-orange-400' :
                            'text-blue-600 dark:text-blue-400'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.role === 'patient' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' :
                        user.role === 'doctor' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        user.role === 'staff' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Appointments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Recent Appointments
                </h2>
                <div className="space-y-3">
                  {recentAppointments.map((appt) => (
                    <div key={appt.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white text-sm">
                            {appt.patient?.name || 'Unknown'} → {appt.doctor?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {appt.date} at {appt.time}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          appt.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Notices & System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Notices */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-pink-600" />
                  Recent Notices
                </h2>
                <div className="space-y-3">
                  {recentNotices.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No notices yet</p>
                  ) : (
                    recentNotices.map((notice) => (
                      <div key={notice.id} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-1">{notice.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{notice.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          By {notice.created_by?.name || 'Admin'} • {new Date(notice.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* System Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  System Overview
                </h2>
                <div className="space-y-3 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span>📊 Real-time updates</span>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">{demoMode ? 'Demo Mode' : 'Active'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span>🔔 Notification system</span>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Running</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span>💾 Database connection</span>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Connected</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span>👥 Total Users</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{counts.patients + counts.doctors + counts.staff}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span>📅 Active Appointments</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{counts.activeAppointments}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.main>
      </div>

      {/* Notice Modal */}
      <AnimatePresence>
        {showNoticeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowNoticeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Send Notice
                </h3>
                <button
                  onClick={() => setShowNoticeModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSendNotice} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter notice title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={noticeForm.message}
                    onChange={(e) => setNoticeForm({ ...noticeForm, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter your message..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNoticeModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Notice
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
