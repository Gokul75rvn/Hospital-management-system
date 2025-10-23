import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import toast from 'react-hot-toast'
import { 
  Calendar,
  Clock,
  Plus,
  X,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react'

export default function Schedule() {
  const [schedule, setSchedule] = useState([])
  const [selectedDay, setSelectedDay] = useState('monday')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSlot, setNewSlot] = useState({ day: 'monday', startTime: '09:00', endTime: '10:00', status: 'available' })
  const [loading, setLoading] = useState(true)

  const demoMode = true

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  useEffect(() => {
    if (demoMode) {
      loadMockSchedule()
    }
  }, [])

  const loadMockSchedule = () => {
    const mockSchedule = [
      // Monday
      { id: '1', day: 'monday', startTime: '09:00', endTime: '10:00', status: 'available', patient: null },
      { id: '2', day: 'monday', startTime: '10:00', endTime: '11:00', status: 'booked', patient: 'John Doe' },
      { id: '3', day: 'monday', startTime: '11:00', endTime: '12:00', status: 'available', patient: null },
      { id: '4', day: 'monday', startTime: '14:00', endTime: '15:00', status: 'booked', patient: 'Emily Davis' },
      { id: '5', day: 'monday', startTime: '15:00', endTime: '16:00', status: 'available', patient: null },
      
      // Tuesday
      { id: '6', day: 'tuesday', startTime: '09:00', endTime: '10:00', status: 'available', patient: null },
      { id: '7', day: 'tuesday', startTime: '10:00', endTime: '11:00', status: 'available', patient: null },
      { id: '8', day: 'tuesday', startTime: '11:30', endTime: '12:30', status: 'booked', patient: 'Robert Brown' },
      { id: '9', day: 'tuesday', startTime: '14:00', endTime: '15:00', status: 'available', patient: null },
      
      // Wednesday
      { id: '10', day: 'wednesday', startTime: '09:00', endTime: '10:00', status: 'booked', patient: 'Linda Wilson' },
      { id: '11', day: 'wednesday', startTime: '10:00', endTime: '11:00', status: 'available', patient: null },
      { id: '12', day: 'wednesday', startTime: '11:00', endTime: '12:00', status: 'available', patient: null },
      
      // Thursday
      { id: '13', day: 'thursday', startTime: '09:00', endTime: '10:00', status: 'available', patient: null },
      { id: '14', day: 'thursday', startTime: '10:00', endTime: '11:00', status: 'available', patient: null },
      { id: '15', day: 'thursday', startTime: '14:00', endTime: '15:00', status: 'booked', patient: 'Michael Lee' },
      
      // Friday
      { id: '16', day: 'friday', startTime: '09:00', endTime: '10:00', status: 'available', patient: null },
      { id: '17', day: 'friday', startTime: '10:30', endTime: '11:30', status: 'available', patient: null },
      { id: '18', day: 'friday', startTime: '14:00', endTime: '15:00', status: 'available', patient: null },
    ]
    setSchedule(mockSchedule)
    setLoading(false)
  }

  const getDaySchedule = (day) => {
    return schedule.filter(slot => slot.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const getStatusColor = (status) => {
    return status === 'available' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const addSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast.error('Please fill in all fields')
      return
    }

    const slot = {
      id: Date.now().toString(),
      day: newSlot.day,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      status: 'available',
      patient: null
    }

    setSchedule(prev => [...prev, slot])
    toast.success('Time slot added successfully!')
    setShowAddModal(false)
    setNewSlot({ day: 'monday', startTime: '09:00', endTime: '10:00', status: 'available' })
  }

  const deleteSlot = (id) => {
    setSchedule(prev => prev.filter(slot => slot.id !== id))
    toast.success('Time slot deleted')
  }

  const toggleSlotStatus = (id) => {
    setSchedule(prev =>
      prev.map(slot =>
        slot.id === id
          ? { ...slot, status: slot.status === 'available' ? 'blocked' : 'available' }
          : slot
      )
    )
    toast.success('Slot status updated')
  }

  const stats = {
    total: schedule.length,
    available: schedule.filter(s => s.status === 'available').length,
    booked: schedule.filter(s => s.status === 'booked').length,
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
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  My Schedule
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your availability and time slots
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Add Time Slot
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
                <p className="text-purple-100">Total Slots</p>
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
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.available}</h3>
                <p className="text-green-100">Available Slots</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.booked}</h3>
                <p className="text-red-100">Booked Slots</p>
              </motion.div>
            </div>

            {/* Day Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDay === day
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Display */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}'s Schedule
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading schedule...</p>
                </div>
              ) : getDaySchedule(selectedDay).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No time slots for this day</p>
                  <button
                    onClick={() => {
                      setNewSlot({ ...newSlot, day: selectedDay })
                      setShowAddModal(true)
                    }}
                    className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Time Slot
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getDaySchedule(selectedDay).map((slot, index) => (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">
                              {slot.startTime} - {slot.endTime}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slot.status)}`}>
                          {slot.status}
                        </span>
                      </div>

                      {slot.patient && (
                        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Patient:</strong> {slot.patient}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {slot.status !== 'booked' && (
                          <>
                            <button
                              onClick={() => toggleSlotStatus(slot.id)}
                              className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              {slot.status === 'available' ? 'Block' : 'Unblock'}
                            </button>
                            <button
                              onClick={() => deleteSlot(slot.id)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {slot.status === 'booked' && (
                          <div className="flex-1 text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                            Booked - Cannot modify
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.main>
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Add Time Slot</h2>
                  <p className="text-green-100">Create a new availability slot</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Day
                </label>
                <select
                  value={newSlot.day}
                  onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addSlot}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Slot
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
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
