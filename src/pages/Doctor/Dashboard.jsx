import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../utils/supabaseClient'
import toast from 'react-hot-toast'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users,
  Bell,
  Activity,
  User,
  Star,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  MapPin,
  X
} from 'lucide-react'

export default function DoctorDashboard() {
  const { profile } = useAuth()
  const [schedule, setSchedule] = useState([])
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    total: 0,
    completed: 0
  })
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showPatientModal, setShowPatientModal] = useState(false)

  const demoMode = true

  useEffect(() => {
    if (demoMode) {
      loadMockData()
    } else if (profile?.id) {
      loadAppointments()
      loadPatients()
      setupRealtimeSubscription()
    }
  }, [profile])

  const loadMockData = () => {
    const mockAppointments = [
      {
        id: '1',
        patient: { id: '1', name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567', age: 45 },
        date: '2025-10-25',
        time: '10:00 AM',
        status: 'pending',
        reason: 'Regular checkup',
        notes: 'Patient has history of hypertension'
      },
      {
        id: '2',
        patient: { id: '2', name: 'Emily Davis', email: 'emily@example.com', phone: '(555) 234-5678', age: 32 },
        date: '2025-10-25',
        time: '02:00 PM',
        status: 'accepted',
        reason: 'Follow-up consultation',
        notes: 'Post-surgery checkup'
      },
      {
        id: '3',
        patient: { id: '3', name: 'Robert Brown', email: 'robert@example.com', phone: '(555) 345-6789', age: 58 },
        date: '2025-10-26',
        time: '11:30 AM',
        status: 'pending',
        reason: 'Heart examination',
        notes: 'Experiencing chest pain'
      },
      {
        id: '4',
        patient: { id: '4', name: 'Linda Wilson', email: 'linda@example.com', phone: '(555) 456-7890', age: 41 },
        date: '2025-10-27',
        time: '09:00 AM',
        status: 'accepted',
        reason: 'Blood pressure check',
        notes: 'Monthly monitoring'
      },
    ]

    const mockPatients = [
      { 
        id: '1', 
        name: 'John Doe', 
        email: 'john@example.com', 
        phone: '(555) 123-4567',
        age: 45,
        bloodType: 'A+',
        lastVisit: '2025-09-15',
        totalVisits: 8,
        conditions: ['Hypertension', 'Type 2 Diabetes']
      },
      { 
        id: '2', 
        name: 'Emily Davis', 
        email: 'emily@example.com', 
        phone: '(555) 234-5678',
        age: 32,
        bloodType: 'O-',
        lastVisit: '2025-10-01',
        totalVisits: 5,
        conditions: ['Post-Surgery Recovery']
      },
      { 
        id: '3', 
        name: 'Robert Brown', 
        email: 'robert@example.com', 
        phone: '(555) 345-6789',
        age: 58,
        bloodType: 'B+',
        lastVisit: '2025-10-10',
        totalVisits: 12,
        conditions: ['Heart Disease', 'High Cholesterol']
      },
      { 
        id: '4', 
        name: 'Linda Wilson', 
        email: 'linda@example.com', 
        phone: '(555) 456-7890',
        age: 41,
        bloodType: 'AB+',
        lastVisit: '2025-09-25',
        totalVisits: 6,
        conditions: ['Hypertension']
      },
      { 
        id: '5', 
        name: 'Michael Lee', 
        email: 'michael@example.com', 
        phone: '(555) 567-8901',
        age: 29,
        bloodType: 'A-',
        lastVisit: '2025-10-05',
        totalVisits: 3,
        conditions: ['Migraine']
      },
    ]

    setAppointments(mockAppointments)
    setPatients(mockPatients)
    
    setStats({
      pending: mockAppointments.filter(a => a.status === 'pending').length,
      accepted: mockAppointments.filter(a => a.status === 'accepted').length,
      total: mockAppointments.length,
      completed: 24
    })
    
    setLoading(false)
  }

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patient_id (name, email)
        `)
        .eq('doctor_id', profile.id)
        .in('status', ['pending', 'accepted'])
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error

      setAppointments(data || [])
      
      // Calculate stats
      const pending = data?.filter(a => a.status === 'pending').length || 0
      const accepted = data?.filter(a => a.status === 'accepted').length || 0
      setStats({
        pending,
        accepted,
        total: data?.length || 0
      })
    } catch (error) {
      console.error('Error loading appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const loadPatients = async () => {
    try {
      // Get unique patients from appointments
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          patient_id,
          patient:patient_id (name, email)
        `)
        .eq('doctor_id', profile.id)
        .eq('status', 'accepted')

      if (error) throw error

      // Get unique patients
      const uniquePatients = data?.reduce((acc, curr) => {
        if (!acc.find(p => p.id === curr.patient_id)) {
          acc.push({
            id: curr.patient_id,
            name: curr.patient?.name || 'Unknown',
            email: curr.patient?.email || ''
          })
        }
        return acc
      }, [])

      setPatients(uniquePatients || [])
    } catch (error) {
      console.error('Error loading patients:', error)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('doctor-appointments')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments',
          filter: `doctor_id=eq.${profile.id}`
        }, 
        (payload) => {
          console.log('Appointment change:', payload)
          
          if (payload.eventType === 'INSERT') {
            toast.success('New appointment request!', {
              icon: '📅',
              duration: 5000
            })
          }
          
          loadAppointments()
          loadPatients()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const toggleSlot = async (slot) => {
    const newStatus = slot.slot_status === 'available' ? 'booked' : 'available'
    await supabase.from('schedules').update({ slot_status: newStatus }).eq('id', slot.id)
    toast.success('Slot updated')
    setSchedule(s => s.map(x => x.id === slot.id ? { ...x, slot_status: newStatus } : x))
  }

  const acceptAppointment = async (id) => {
    try {
      if (demoMode) {
        setAppointments(prev => 
          prev.map(appt => 
            appt.id === id ? { ...appt, status: 'accepted' } : appt
          )
        )
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          accepted: prev.accepted + 1
        }))
        toast.success('Appointment accepted!')
        return
      }

      const { error } = await supabase
        .from('appointments')
        .update({ status: 'accepted' })
        .eq('id', id)

      if (error) throw error

      toast.success('Appointment accepted!')
      loadAppointments()
      loadPatients()
    } catch (error) {
      console.error('Error accepting appointment:', error)
      toast.error('Failed to accept appointment')
    }
  }

  const rejectAppointment = async (id) => {
    try {
      if (demoMode) {
        setAppointments(prev => prev.filter(appt => appt.id !== id))
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          total: prev.total - 1
        }))
        toast.success('Appointment rejected')
        return
      }

      const { error } = await supabase
        .from('appointments')
        .update({ status: 'rejected' })
        .eq('id', id)

      if (error) throw error

      toast.success('Appointment rejected')
      loadAppointments()
    } catch (error) {
      console.error('Error rejecting appointment:', error)
      toast.error('Failed to reject appointment')
    }
  }

  const completeAppointment = (id) => {
    if (demoMode) {
      setAppointments(prev => prev.filter(appt => appt.id !== id))
      setStats(prev => ({
        ...prev,
        accepted: prev.accepted - 1,
        total: prev.total - 1,
        completed: prev.completed + 1
      }))
      toast.success('Appointment marked as completed!')
    }
  }

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient)
    setShowPatientModal(true)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar demoRole="doctor" />
      <div className="flex">
        <Sidebar demoRole="doctor" />
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
                Doctor Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome, Dr. {profile?.name || 'Demo Doctor'}! {profile?.specialization || '(Cardiologist)'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">{' '}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Bell className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.pending}</h3>
                <p className="text-yellow-100">Pending Requests</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.accepted}</h3>
                <p className="text-green-100">Accepted Appointments</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.completed}</h3>
                <p className="text-purple-100">Completed</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{patients.length}</h3>
                <p className="text-blue-100">Total Patients</p>
              </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Appointments */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      Today's Schedule
                    </h2>
                    <a
                      href="/doctor/appointments"
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      View All →
                    </a>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">Loading appointments...</p>
                    </div>
                  ) : appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No appointments scheduled for today</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        {appointments.length > 0 ? `You have ${appointments.length} upcoming appointments` : 'Your schedule is clear'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).slice(0, 3).map((appointment) => (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-lg border-2 ${
                            appointment.status === 'pending'
                              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                              : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                  {appointment.patient?.name || 'Unknown Patient'}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  appointment.status === 'pending'
                                    ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                                    : 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                                }`}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(appointment.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {appointment.time}
                                </span>
                              </div>
                              {appointment.reason && (
                                <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                                  <strong>Reason:</strong> {appointment.reason}
                                </div>
                              )}
                              {appointment.notes && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded mt-2">
                                  <strong>Notes:</strong> {appointment.notes}
                                </div>
                              )}
                            </div>
                          </div>

                          {appointment.status === 'pending' && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => acceptAppointment(appointment.id)}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => rejectAppointment(appointment.id)}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          )}

                          {appointment.status === 'accepted' && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => completeAppointment(appointment.id)}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Mark Complete
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Patients List */}
              <div className="lg:col-span-1 space-y-6">
                {/* Recent Patients */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Recent Patients
                  </h2>

                  {patients.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No patients yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {patients.slice(0, 4).map((patient) => (
                        <div
                          key={patient.id}
                          onClick={() => viewPatientDetails(patient)}
                          className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 dark:text-white truncate">
                                {patient.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {patient.email}
                              </p>
                              {patient.lastVisit && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Last: {new Date(patient.lastVisit).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.main>
      </div>

      {/* Patient Details Modal */}
      <AnimatePresence>
        {showPatientModal && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPatientModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                      <p className="text-blue-100">{selectedPatient.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPatientModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Age</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {selectedPatient.age} years
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm">Blood Type</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {selectedPatient.bloodType}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium text-gray-800 dark:text-white">{selectedPatient.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-800 dark:text-white">{selectedPatient.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg">Medical History</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Last Visit</span>
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {new Date(selectedPatient.lastVisit).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Total Visits</span>
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {selectedPatient.totalVisits} visits
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conditions */}
                {selectedPatient.conditions && selectedPatient.conditions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-lg">Medical Conditions</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.conditions.map((condition, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm font-medium"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
