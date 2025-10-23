import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import toast from 'react-hot-toast'
import { 
  User,
  Search,
  Phone,
  Mail,
  Calendar,
  FileText,
  Activity,
  Heart,
  Droplet,
  X,
  Edit,
  Plus
} from 'lucide-react'

export default function MyPatients() {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [prescription, setPrescription] = useState('')

  const demoMode = true

  useEffect(() => {
    if (demoMode) {
      loadMockPatients()
    }
  }, [])

  useEffect(() => {
    filterPatients()
  }, [searchTerm, patients])

  const loadMockPatients = () => {
    const mockPatients = [
      { 
        id: '1', 
        name: 'John Doe', 
        email: 'john@example.com', 
        phone: '(555) 123-4567',
        age: 45,
        gender: 'Male',
        bloodType: 'A+',
        address: '123 Main St, Springfield',
        lastVisit: '2025-09-15',
        nextAppointment: '2025-10-25',
        totalVisits: 8,
        conditions: ['Hypertension', 'Type 2 Diabetes'],
        allergies: ['Penicillin'],
        currentMedications: ['Metformin 500mg', 'Lisinopril 10mg']
      },
      { 
        id: '2', 
        name: 'Emily Davis', 
        email: 'emily@example.com', 
        phone: '(555) 234-5678',
        age: 32,
        gender: 'Female',
        bloodType: 'O-',
        address: '456 Oak Ave, Riverside',
        lastVisit: '2025-10-01',
        nextAppointment: '2025-10-25',
        totalVisits: 5,
        conditions: ['Post-Surgery Recovery'],
        allergies: [],
        currentMedications: ['Ibuprofen 400mg']
      },
      { 
        id: '3', 
        name: 'Robert Brown', 
        email: 'robert@example.com', 
        phone: '(555) 345-6789',
        age: 58,
        gender: 'Male',
        bloodType: 'B+',
        address: '789 Pine Rd, Lakeside',
        lastVisit: '2025-10-10',
        nextAppointment: '2025-10-26',
        totalVisits: 12,
        conditions: ['Heart Disease', 'High Cholesterol'],
        allergies: ['Aspirin'],
        currentMedications: ['Atorvastatin 20mg', 'Aspirin 81mg']
      },
      { 
        id: '4', 
        name: 'Linda Wilson', 
        email: 'linda@example.com', 
        phone: '(555) 456-7890',
        age: 41,
        gender: 'Female',
        bloodType: 'AB+',
        address: '321 Elm St, Hilltown',
        lastVisit: '2025-09-25',
        nextAppointment: '2025-10-27',
        totalVisits: 6,
        conditions: ['Hypertension'],
        allergies: [],
        currentMedications: ['Amlodipine 5mg']
      },
      { 
        id: '5', 
        name: 'Michael Lee', 
        email: 'michael@example.com', 
        phone: '(555) 567-8901',
        age: 29,
        gender: 'Male',
        bloodType: 'A-',
        address: '654 Maple Dr, Greenfield',
        lastVisit: '2025-10-05',
        nextAppointment: null,
        totalVisits: 3,
        conditions: ['Migraine'],
        allergies: ['Sulfa drugs'],
        currentMedications: ['Sumatriptan 50mg']
      },
      { 
        id: '6', 
        name: 'Sarah Taylor', 
        email: 'sarah@example.com', 
        phone: '(555) 678-9012',
        age: 36,
        gender: 'Female',
        bloodType: 'O+',
        address: '987 Cedar Ln, Brookside',
        lastVisit: '2025-09-30',
        nextAppointment: null,
        totalVisits: 4,
        conditions: ['Asthma'],
        allergies: ['Pollen'],
        currentMedications: ['Albuterol inhaler']
      },
    ]
    setPatients(mockPatients)
    setLoading(false)
  }

  const filterPatients = () => {
    if (searchTerm) {
      const filtered = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPatients(filtered)
    } else {
      setFilteredPatients(patients)
    }
  }

  const openPatientModal = (patient) => {
    setSelectedPatient(patient)
    setShowModal(true)
  }

  const openPrescriptionModal = (patient) => {
    setSelectedPatient(patient)
    setPrescription('')
    setShowPrescriptionModal(true)
  }

  const savePrescription = () => {
    if (prescription && selectedPatient) {
      setPatients(prev =>
        prev.map(p =>
          p.id === selectedPatient.id
            ? { ...p, currentMedications: [...p.currentMedications, prescription] }
            : p
        )
      )
      toast.success('Prescription added successfully!')
      setShowPrescriptionModal(false)
    } else {
      toast.error('Please enter a prescription')
    }
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
                  My Patients
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your patient records and medical history
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg">
                  <p className="text-sm">Total Patients</p>
                  <p className="text-2xl font-bold">{patients.length}</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading patients...</p>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No patients found</p>
                </div>
              ) : (
                filteredPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate">{patient.name}</h3>
                          <p className="text-sm text-green-100 truncate">{patient.age} years • {patient.gender}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Droplet className="w-4 h-4" />
                        <span>Blood Type: <strong>{patient.bloodType}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Activity className="w-4 h-4" />
                        <span>Total Visits: <strong>{patient.totalVisits}</strong></span>
                      </div>

                      {/* Conditions */}
                      {patient.conditions.length > 0 && (
                        <div className="pt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Conditions:</p>
                          <div className="flex flex-wrap gap-1">
                            {patient.conditions.slice(0, 2).map((condition, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-xs"
                              >
                                {condition}
                              </span>
                            ))}
                            {patient.conditions.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                                +{patient.conditions.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => openPatientModal(patient)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          View Full Record
                        </button>
                        <button
                          onClick={() => openPrescriptionModal(patient)}
                          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.main>
      </div>

      {/* Patient Details Modal */}
      {showModal && selectedPatient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                    <p className="text-green-100">{selectedPatient.age} years • {selectedPatient.gender}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Age</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{selectedPatient.age}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Droplet className="w-4 h-4" />
                    <span className="text-sm">Blood Type</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{selectedPatient.bloodType}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Last Visit</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm">Total Visits</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{selectedPatient.totalVisits}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedPatient.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedPatient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedPatient.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Conditions */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-3">Medical Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.conditions.map((condition, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg font-medium"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-3">Allergies</h3>
                {selectedPatient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map((allergy, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-lg font-medium"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No known allergies</p>
                )}
              </div>

              {/* Current Medications */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-3">Current Medications</h3>
                <div className="space-y-2">
                  {selectedPatient.currentMedications.map((med, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Heart className="w-5 h-5 text-blue-600" />
                      <p className="font-medium text-gray-800 dark:text-white">{med}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Appointment */}
              {selectedPatient.nextAppointment && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-2">Next Appointment</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(selectedPatient.nextAppointment).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedPatient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPrescriptionModal(false)}
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
                  <h2 className="text-2xl font-bold">Add Prescription</h2>
                  <p className="text-purple-100">{selectedPatient.name}</p>
                </div>
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medication Details
              </label>
              <input
                type="text"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="e.g., Amoxicillin 500mg - Take twice daily"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={savePrescription}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Prescription
                </button>
                <button
                  onClick={() => setShowPrescriptionModal(false)}
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
