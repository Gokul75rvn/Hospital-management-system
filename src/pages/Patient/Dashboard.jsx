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
  User,
  Mail,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  X
} from 'lucide-react'

export default function PatientDashboard() {
  const demoMode = true;
  const { profile } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    doctor_id: '',
    date: '',
    time: ''
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stats, setStats] = useState({
    upcoming: 0,
    total: 0,
    completed: 0
  })

  useEffect(() => {
    loadData()
    if (!demoMode && profile?.id) {
      setupRealtimeSubscription()
    }
  }, [profile])

  const loadData = async () => {
    setLoading(true);
    
    if (demoMode) {
      // Mock data for demo mode
      setTimeout(() => {
        const mockAppointments = [
          {
            id: 1,
            doctor: { name: 'Sarah Wilson', specialization: 'Cardiology' },
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            time: '10:00 AM',
            status: 'accepted',
            reason: 'Regular Checkup'
          },
          {
            id: 2,
            doctor: { name: 'Michael Chen', specialization: 'General Surgery' },
            date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
            time: '02:00 PM',
            status: 'pending',
            reason: 'Follow-up Consultation'
          },
          {
            id: 3,
            doctor: { name: 'Emily Rodriguez', specialization: 'Endocrinology' },
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            time: '11:00 AM',
            status: 'completed',
            reason: 'Diabetes Management'
          }
        ];

        const mockDoctors = [
          { id: 1, name: 'Sarah Wilson', specialization: 'Cardiology' },
          { id: 2, name: 'Michael Chen', specialization: 'General Surgery' },
          { id: 3, name: 'Emily Rodriguez', specialization: 'Endocrinology' },
          { id: 4, name: 'James Martinez', specialization: 'Neurology' },
          { id: 5, name: 'Lisa Anderson', specialization: 'Pediatrics' }
        ];

        setAppointments(mockAppointments);
        setDoctors(mockDoctors);
        
        const today = new Date().toISOString().split('T')[0];
        const upcoming = mockAppointments.filter(a => a.date >= today && a.status !== 'rejected').length;
        const completed = mockAppointments.filter(a => a.status === 'completed').length;
        
        setStats({
          upcoming,
          total: mockAppointments.length,
          completed
        });
        
        setLoading(false);
      }, 800);
      return;
    }

    try {
      await Promise.all([loadAppointments(), loadDoctors()]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor:doctor_id (name, specialization)
        `)
        .eq('patient_id', profile.id)
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error

      setAppointments(data || [])
    } catch (error) {
      console.error('Error loading appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const loadDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, specialization')
        .eq('role', 'doctor')

      if (error) throw error

      setDoctors(data || [])
    } catch (error) {
      console.error('Error loading doctors:', error)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('patient-appointments')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments',
          filter: `patient_id=eq.${profile.id}`
        }, 
        (payload) => {
          console.log('Appointment change:', payload)
          
          if (payload.eventType === 'UPDATE' && payload.new.status === 'accepted') {
            toast.success('Your appointment has been accepted!', {
              icon: '✅',
              duration: 5000
            })
          }
          
          if (payload.eventType === 'UPDATE' && payload.new.status === 'rejected') {
            toast.error('Your appointment was rejected', {
              icon: '❌',
              duration: 5000
            })
          }
          
          loadAppointments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const bookAppointment = async (e) => {
    e.preventDefault()

    if (!bookingForm.doctor_id || !bookingForm.date || !bookingForm.time) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: profile.id,
          doctor_id: bookingForm.doctor_id,
          date: bookingForm.date,
          time: bookingForm.time,
          status: 'pending'
        })

      if (error) throw error

      toast.success('Appointment booked successfully!')
      setBookingForm({ doctor_id: '', date: '', time: '' })
      setShowBookingModal(false)
      loadAppointments()
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast.error('Failed to book appointment')
    } finally {
      setIsSubmitting(false)
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
      case 'rejected':
        return 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
      case 'pending':
        return 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700'
      default:
        return 'bg-gray-50 border-gray-300 dark:bg-gray-900/20 dark:border-gray-700'
    }
  }

  // Get upcoming and past appointments
  const today = new Date().toISOString().split('T')[0]
  const upcomingAppointments = appointments.filter(a => a.date >= today && a.status !== 'rejected')
  const pastAppointments = appointments.filter(a => a.date < today || a.status === 'rejected')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar  />
      <div className="flex">
        <Sidebar  />
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
                Patient Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {profile?.name || 'Demo Patient'}!
              </p>
            </div>

            {/* Profile Card & Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{profile?.name || 'Demo Patient'}</h3>
                    <p className="text-teal-100 text-sm flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {profile?.email || 'patient@demo.com'}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm text-teal-100">Patient ID</p>
                  <p className="font-mono text-xs">{profile?.id?.slice(0, 13)}...</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{upcomingAppointments.length}</h3>
                <p className="text-blue-100">Upcoming Appointments</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <Activity className="w-5 h-5 opacity-70" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{appointments.length}</h3>
                <p className="text-purple-100">Total Visits</p>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Appointments List */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-teal-600" />
                      My Appointments
                    </h2>
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Book Appointment
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">Loading appointments...</p>
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No appointments yet</p>
                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Book Your First Appointment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Upcoming Appointments */}
                      {upcomingAppointments.length > 0 && (
                        <>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                            Upcoming
                          </h3>
                          {upcomingAppointments.map((appointment) => (
                            <motion.div
                              key={appointment.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`p-4 rounded-lg border-2 ${getStatusColor(appointment.status)}`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getStatusIcon(appointment.status)}
                                    <h3 className="font-semibold text-gray-800 dark:text-white">
                                      Dr. {appointment.doctor?.name || 'Unknown'}
                                    </h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      appointment.status === 'pending'
                                        ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                                        : appointment.status === 'accepted'
                                        ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                                        : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                                    }`}>
                                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </span>
                                  </div>
                                  {appointment.doctor?.specialization && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      {appointment.doctor.specialization}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {formatDate(appointment.date)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {appointment.time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </>
                      )}

                      {/* Past Appointments */}
                      {pastAppointments.length > 0 && (
                        <>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide mt-6">
                            Past
                          </h3>
                          {pastAppointments.slice(0, 3).map((appointment) => (
                            <div
                              key={appointment.id}
                              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 opacity-75"
                            >
                              <div className="flex items-center justify-between text-sm">
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-white">
                                    Dr. {appointment.doctor?.name || 'Unknown'}
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {formatDate(appointment.date)} at {appointment.time}
                                  </p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                  {appointment.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Available Doctors */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-600" />
                    Available Doctors
                  </h2>

                  {doctors.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No doctors available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 dark:text-white truncate">
                                Dr. {doctor.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {doctor.specialization || 'General Physician'}
                              </p>
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

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowBookingModal(false)}
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
                  Book Appointment
                </h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={bookAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Doctor
                  </label>
                  <select
                    value={bookingForm.doctor_id}
                    onChange={(e) => setBookingForm({ ...bookingForm, doctor_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} {doctor.specialization && `(${doctor.specialization})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select time...</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Book Appointment
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
