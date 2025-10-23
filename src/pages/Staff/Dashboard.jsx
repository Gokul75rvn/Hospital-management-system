import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { supabase } from '../../utils/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock,
  Activity,
  UserCheck,
  Stethoscope,
  X
} from 'lucide-react'

export default function StaffDashboard() {
  const { profile } = useAuth()
  const [patients, setPatients] = useState([])
  const [appointmentsToday, setAppointmentsToday] = useState([])
  const [attendanceMarked, setAttendanceMarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [doctorAppointments, setDoctorAppointments] = useState([])
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingTasks: 0
  })

  const demoMode = true

  useEffect(() => {
    if (demoMode) {
      loadMockData()
    } else if (profile?.id) {
      loadData()
      checkAttendance()
    }
  }, [profile])

  const loadMockData = () => {
    const mockPatients = [
      { id: '1', name: 'John Doe', condition: 'Hypertension', age: 45, room: '101', status: 'stable' },
      { id: '2', name: 'Emily Davis', condition: 'Post-Surgery Recovery', age: 32, room: '203', status: 'recovering' },
      { id: '3', name: 'Robert Brown', condition: 'Heart Disease', age: 58, room: '105', status: 'critical' },
      { id: '4', name: 'Linda Wilson', condition: 'Hypertension', age: 41, room: '208', status: 'stable' },
      { id: '5', name: 'Michael Lee', condition: 'Migraine', age: 29, room: '302', status: 'stable' },
    ]

    const mockAppointments = [
      {
        id: '1',
        patient: { name: 'John Doe', email: 'john@example.com' },
        doctor: { name: 'Dr. Sarah Johnson', specialization: 'Cardiologist' },
        time: '10:00 AM',
        status: 'accepted'
      },
      {
        id: '2',
        patient: { name: 'Emily Davis', email: 'emily@example.com' },
        doctor: { name: 'Dr. James Chen', specialization: 'Neurologist' },
        time: '02:00 PM',
        status: 'accepted'
      },
      {
        id: '3',
        patient: { name: 'Robert Brown', email: 'robert@example.com' },
        doctor: { name: 'Dr. Maria Garcia', specialization: 'Pediatrician' },
        time: '11:30 AM',
        status: 'pending'
      },
    ]

    setPatients(mockPatients)
    setAppointmentsToday(mockAppointments)
    setDoctorAppointments(mockAppointments)
    setStats({
      totalPatients: mockPatients.length,
      todayAppointments: mockAppointments.length,
      pendingTasks: 3
    })
    setLoading(false)
  }

  const loadData = async () => {
    try {
      // Load patients
      const { data: patientsData } = await supabase
        .from('patients')
        .select('*')
        .eq('assigned_staff_id', profile.id)
      
      setPatients(patientsData || [])

      // Load today's appointments
      const today = new Date().toISOString().slice(0, 10)
      const { data: appts } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patient_id (name, email),
          doctor:doctor_id (name, specialization)
        `)
        .eq('date', today)
      
      setAppointmentsToday(appts || [])
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const checkAttendance = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('staff_id', profile.id)
        .eq('date', today)
        .single()

      if (data) {
        setAttendanceMarked(true)
      }
    } catch (error) {
      // No attendance marked yet
      setAttendanceMarked(false)
    }
  }

  const markAttendance = async () => {
    if (demoMode) {
      setAttendanceMarked(true)
      toast.success('Attendance marked successfully!')
      return
    }

    try {
      const today = new Date().toISOString().slice(0, 10)
      
      const { error } = await supabase
        .from('attendance')
        .insert({ 
          staff_id: profile.id, 
          date: today, 
          status: 'present' 
        })

      if (error) throw error

      toast.success('Attendance marked successfully!')
      setAttendanceMarked(true)
    } catch (error) {
      console.error('Error marking attendance:', error)
      if (error.code === '23505') {
        toast.error('Attendance already marked for today')
        setAttendanceMarked(true)
      } else {
        toast.error('Failed to mark attendance')
      }
    }
  }

  const assistDoctor = async () => {
    if (demoMode) {
      setShowDoctorModal(true)
      return
    }

    try {
      const today = new Date().toISOString().slice(0, 10)
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patient_id (name, email),
          doctor:doctor_id (name, specialization)
        `)
        .eq('date', today)
        .eq('status', 'accepted')

      if (error) throw error

      setDoctorAppointments(data || [])
      setShowDoctorModal(true)
    } catch (error) {
      console.error('Error loading doctor appointments:', error)
      toast.error('Failed to load doctor appointments')
    }
  }

  const formatTime = (timeString) => {
    return timeString
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar demoRole="staff" />
      <div className="flex">
        <Sidebar demoRole="staff" />
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
                Staff Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome, {profile?.name || 'Demo Staff'}!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.totalPatients}</h3>
                <p className="text-orange-100">Assigned Patients</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.todayAppointments}</h3>
                <p className="text-blue-100">Today's Appointments</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Clock className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.pendingTasks}</h3>
                <p className="text-purple-100">Pending Tasks</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`bg-gradient-to-br ${attendanceMarked ? 'from-green-500 to-emerald-500' : 'from-gray-500 to-gray-600'} rounded-xl shadow-lg p-6 text-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {attendanceMarked ? 'Marked' : 'Not Marked'}
                </h3>
                <p className="text-white/80 mb-3">Attendance Status</p>
                {!attendanceMarked && (
                  <button
                    onClick={markAttendance}
                    className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all"
                  >
                    Mark Present
                  </button>
                )}
              </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Appointments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Today's Appointments
                  </h2>
                  <button
                    onClick={assistDoctor}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Assist Doctor
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : appointmentsToday.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No appointments today</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointmentsToday.map((appt) => (
                      <div
                        key={appt.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                              {appt.patient?.name || 'Unknown'}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Dr. {appt.doctor?.name || 'Unknown'} 
                              {appt.doctor?.specialization && ` (${appt.doctor.specialization})`}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            appt.status === 'accepted' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {appt.time}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Assigned Patients */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  Assigned Patients
                </h2>

                {patients.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No assigned patients</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {patients.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                              {patient.name}
                            </h4>
                            {patient.condition && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Condition: {patient.condition}
                              </p>
                            )}
                            {patient.age && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Age: {patient.age}
                              </p>
                            )}
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.main>
      </div>

      {/* Doctor Assist Modal */}
      <AnimatePresence>
        {showDoctorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDoctorModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-orange-600" />
                  Doctor's Appointments Today
                </h3>
                <button
                  onClick={() => setShowDoctorModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {doctorAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No appointments scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {doctorAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-orange-500"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                            {appt.patient?.name || 'Unknown Patient'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Dr. {appt.doctor?.name || 'Unknown'} 
                            {appt.doctor?.specialization && ` (${appt.doctor.specialization})`}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            {appt.time}
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
