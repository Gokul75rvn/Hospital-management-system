import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import toast from 'react-hot-toast'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  Filter,
  Search,
  AlertCircle,
  Phone,
  Mail,
  FileText,
  Edit,
  X
} from 'lucide-react'

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [notes, setNotes] = useState('')

  const demoMode = true

  useEffect(() => {
    if (demoMode) {
      loadMockAppointments()
    }
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [searchTerm, filterStatus, filterDate, appointments])

  const loadMockAppointments = () => {
    const mockAppointments = [
      {
        id: '1',
        patient: { id: '1', name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567', age: 45, bloodType: 'A+' },
        date: '2025-10-25',
        time: '10:00 AM',
        status: 'pending',
        reason: 'Regular checkup',
        notes: 'Patient has history of hypertension',
        type: 'consultation'
      },
      {
        id: '2',
        patient: { id: '2', name: 'Emily Davis', email: 'emily@example.com', phone: '(555) 234-5678', age: 32, bloodType: 'O-' },
        date: '2025-10-25',
        time: '02:00 PM',
        status: 'accepted',
        reason: 'Follow-up consultation',
        notes: 'Post-surgery checkup',
        type: 'follow-up'
      },
      {
        id: '3',
        patient: { id: '3', name: 'Robert Brown', email: 'robert@example.com', phone: '(555) 345-6789', age: 58, bloodType: 'B+' },
        date: '2025-10-26',
        time: '11:30 AM',
        status: 'pending',
        reason: 'Heart examination',
        notes: 'Experiencing chest pain',
        type: 'emergency'
      },
      {
        id: '4',
        patient: { id: '4', name: 'Linda Wilson', email: 'linda@example.com', phone: '(555) 456-7890', age: 41, bloodType: 'AB+' },
        date: '2025-10-27',
        time: '09:00 AM',
        status: 'accepted',
        reason: 'Blood pressure check',
        notes: 'Monthly monitoring',
        type: 'consultation'
      },
      {
        id: '5',
        patient: { id: '5', name: 'Michael Lee', email: 'michael@example.com', phone: '(555) 567-8901', age: 29, bloodType: 'A-' },
        date: '2025-10-24',
        time: '03:30 PM',
        status: 'completed',
        reason: 'Migraine treatment',
        notes: 'Prescribed medication',
        type: 'consultation'
      },
      {
        id: '6',
        patient: { id: '6', name: 'Sarah Taylor', email: 'sarah@example.com', phone: '(555) 678-9012', age: 36, bloodType: 'O+' },
        date: '2025-10-23',
        time: '10:30 AM',
        status: 'rejected',
        reason: 'General consultation',
        notes: 'Schedule conflict',
        type: 'consultation'
      },
    ]
    setAppointments(mockAppointments)
    setLoading(false)
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
        filtered = filtered.filter(appt => appt.date >= today && appt.status !== 'completed' && appt.status !== 'rejected')
      } else if (filterDate === 'past') {
        filtered = filtered.filter(appt => appt.date < today || appt.status === 'completed')
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(appt => 
        appt.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.reason.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredAppointments(filtered)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />
      case 'completed': return <CheckCircle className="w-5 h-5 text-blue-600" />
      default: return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const acceptAppointment = (id) => {
    setAppointments(prev => 
      prev.map(appt => 
        appt.id === id ? { ...appt, status: 'accepted' } : appt
      )
    )
    toast.success('Appointment accepted!')
  }

  const rejectAppointment = (id) => {
    setAppointments(prev => 
      prev.map(appt => 
        appt.id === id ? { ...appt, status: 'rejected' } : appt
      )
    )
    toast.success('Appointment rejected')
  }

  const completeAppointment = (id) => {
    setAppointments(prev => 
      prev.map(appt => 
        appt.id === id ? { ...appt, status: 'completed' } : appt
      )
    )
    toast.success('Appointment marked as completed!')
  }

  const openDetailsModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailsModal(true)
  }

  const openNotesModal = (appointment) => {
    setSelectedAppointment(appointment)
    setNotes(appointment.notes || '')
    setShowNotesModal(true)
  }

  const saveNotes = () => {
    if (selectedAppointment) {
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === selectedAppointment.id ? { ...appt, notes } : appt
        )
      )
      toast.success('Notes saved successfully!')
      setShowNotesModal(false)
    }
  }

  const statusStats = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    accepted: appointments.filter(a => a.status === 'accepted').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar demoRole="doctor" />
      <div className="flex">
        <Sidebar demoRole="doctor" />
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                My Appointments
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track all your appointments
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'All', value: statusStats.all, color: 'from-purple-500 to-purple-600', status: 'all' },
                { label: 'Pending', value: statusStats.pending, color: 'from-yellow-500 to-orange-600', status: 'pending' },
                { label: 'Accepted', value: statusStats.accepted, color: 'from-green-500 to-emerald-600', status: 'accepted' },
                { label: 'Completed', value: statusStats.completed, color: 'from-blue-500 to-cyan-600', status: 'completed' },
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
                    placeholder="Search patient or reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 appearance-none"
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 appearance-none"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
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
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {getStatusIcon(appt.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {appt.patient?.name}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appt.status)}`}>
                                {appt.status}
                              </span>
                              <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                                {appt.type}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{appt.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span><strong>Reason:</strong> {appt.reason}</span>
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
                      <div className="flex-shrink-0 flex flex-wrap gap-2">
                        <button
                          onClick={() => openDetailsModal(appt)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => openNotesModal(appt)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Notes
                        </button>
                        {appt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => acceptAppointment(appt.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => rejectAppointment(appt.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </>
                        )}
                        {appt.status === 'accepted' && (
                          <button
                            onClick={() => completeAppointment(appt.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.main>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedAppointment.patient.name}</h2>
                  <p className="text-green-100">Appointment Details</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Age</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{selectedAppointment.patient.age} years</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Blood Type</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{selectedAppointment.patient.bloodType}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-800 dark:text-white">{selectedAppointment.patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 dark:text-white">{selectedAppointment.patient.email}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Appointment</p>
                <p className="font-medium text-gray-800 dark:text-white">{new Date(selectedAppointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedAppointment.time}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Reason</p>
                <p className="font-medium text-gray-800 dark:text-white">{selectedAppointment.reason}</p>
              </div>
              {selectedAppointment.notes && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes</p>
                  <p className="font-medium text-gray-800 dark:text-white">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedAppointment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowNotesModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Edit Notes</h2>
                  <p className="text-purple-100">{selectedAppointment.patient.name}</p>
                </div>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add clinical notes, observations, or prescriptions..."
                className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={saveNotes}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Save Notes
                </button>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
