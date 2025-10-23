import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { supabase } from '../../utils/supabaseClient'
import toast from 'react-hot-toast'
import { 
  Calendar, 
  Clock,
  User,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Stethoscope
} from 'lucide-react'

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [loading, setLoading] = useState(true)

  const demoMode = true

  useEffect(() => {
    if (demoMode) {
      loadMockAppointments()
    } else {
      loadAppointments()
    }
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [searchTerm, filterStatus, filterDate, appointments])

  const loadMockAppointments = () => {
    const mockAppointments = [
      { 
        id: '1', 
        patient: { name: 'John Doe', email: 'john@example.com' },
        doctor: { name: 'Dr. Sarah Johnson', specialization: 'Cardiologist' },
        date: '2025-10-25',
        time: '10:00 AM',
        status: 'accepted',
        notes: 'Regular checkup',
        created_at: '2025-10-20'
      },
      { 
        id: '2', 
        patient: { name: 'Emily Davis', email: 'emily@example.com' },
        doctor: { name: 'Dr. James Chen', specialization: 'Neurologist' },
        date: '2025-10-25',
        time: '02:00 PM',
        status: 'pending',
        notes: 'Follow-up consultation',
        created_at: '2025-10-21'
      },
      { 
        id: '3', 
        patient: { name: 'Robert Brown', email: 'robert@example.com' },
        doctor: { name: 'Dr. Sarah Johnson', specialization: 'Cardiologist' },
        date: '2025-10-26',
        time: '11:30 AM',
        status: 'accepted',
        notes: 'Heart examination',
        created_at: '2025-10-22'
      },
      { 
        id: '4', 
        patient: { name: 'Linda Wilson', email: 'linda@example.com' },
        doctor: { name: 'Dr. Maria Garcia', specialization: 'Pediatrician' },
        date: '2025-10-24',
        time: '09:00 AM',
        status: 'completed',
        notes: 'Child vaccination',
        created_at: '2025-10-19'
      },
      { 
        id: '5', 
        patient: { name: 'Michael Lee', email: 'michael@example.com' },
        doctor: { name: 'Dr. James Chen', specialization: 'Neurologist' },
        date: '2025-10-23',
        time: '03:30 PM',
        status: 'rejected',
        notes: 'Migraine treatment',
        created_at: '2025-10-18'
      },
      { 
        id: '6', 
        patient: { name: 'Sarah Taylor', email: 'sarah@example.com' },
        doctor: { name: 'Dr. Sarah Johnson', specialization: 'Cardiologist' },
        date: '2025-10-27',
        time: '10:30 AM',
        status: 'pending',
        notes: 'Blood pressure check',
        created_at: '2025-10-23'
      },
    ]
    setAppointments(mockAppointments)
    setLoading(false)
  }

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patient_id(name, email),
          doctor:doctor_id(name, specialization)
        `)
        .order('date', { ascending: false })
      
      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error loading appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    if (filterStatus !== 'all') {
      filtered = filtered.filter(appt => appt.status === filterStatus)
    }

    if (filterDate !== 'all') {
      const today = new Date().toISOString().split('T')[0]
      if (filterDate === 'today') {
        filtered = filtered.filter(appt => appt.date === today)
      } else if (filterDate === 'upcoming') {
        filtered = filtered.filter(appt => appt.date >= today)
      } else if (filterDate === 'past') {
        filtered = filtered.filter(appt => appt.date < today)
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(appt => 
        appt.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredAppointments(filtered)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />
      case 'completed': return <CheckCircle className="w-5 h-5 text-blue-600" />
      default: return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  }

  const statusStats = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    accepted: appointments.filter(a => a.status === 'accepted').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    rejected: appointments.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar demoRole="admin" />
      <div className="flex">
        <Sidebar demoRole="admin" />
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Appointments Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage all appointments in the system
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {[
                { label: 'All', value: statusStats.all, color: 'from-purple-500 to-purple-600', status: 'all' },
                { label: 'Pending', value: statusStats.pending, color: 'from-yellow-500 to-orange-600', status: 'pending' },
                { label: 'Accepted', value: statusStats.accepted, color: 'from-green-500 to-emerald-600', status: 'accepted' },
                { label: 'Completed', value: statusStats.completed, color: 'from-blue-500 to-cyan-600', status: 'completed' },
                { label: 'Rejected', value: statusStats.rejected, color: 'from-red-500 to-pink-600', status: 'rejected' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setFilterStatus(stat.status)}
                  className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white cursor-pointer hover:scale-105 transition-transform ${
                    filterStatus === stat.status ? 'ring-4 ring-white/50' : ''
                  }`}
                >
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patient or doctor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appointments Grid */}
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading appointments...</p>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No appointments found</p>
                </div>
              ) : (
                filteredAppointments.map((appt) => (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {getStatusIcon(appt.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {appt.patient?.name || 'Unknown Patient'}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appt.status)}`}>
                                {appt.status}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4" />
                                <span>Dr. {appt.doctor?.name || 'Unknown'}</span>
                                {appt.doctor?.specialization && (
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                                    {appt.doctor.specialization}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{appt.time}</span>
                              </div>
                              {appt.notes && (
                                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                                  <strong>Notes:</strong> {appt.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Created: {new Date(appt.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  )
}
