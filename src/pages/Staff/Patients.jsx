import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter,
  Activity, 
  Heart,
  Thermometer,
  Wind,
  Clock,
  X,
  FileText,
  Plus,
  Save,
  User,
  Stethoscope,
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';

const StaffPatients = () => {
  const demoMode = true;
  
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [vitals, setVitals] = useState({
    temperature: '',
    blood_pressure: '',
    heart_rate: '',
    respiratory_rate: '',
    oxygen_saturation: '',
    notes: ''
  });

  const [observations, setObservations] = useState({
    observation: '',
    symptoms: '',
    condition: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    
    if (demoMode) {
      // Mock data for demo mode
      setTimeout(() => {
        const mockPatients = [
          {
            id: 1,
            name: 'John Doe',
            age: 45,
            gender: 'Male',
            condition: 'Hypertension',
            room_number: '101',
            status: 'Stable',
            assigned_date: '2024-01-15',
            last_checkup: '2 hours ago',
            doctor_name: 'Dr. Sarah Wilson',
            contact: '+1 234-567-8901',
            blood_type: 'O+',
            allergies: 'Penicillin',
            current_vitals: {
              temperature: '98.6°F',
              blood_pressure: '120/80',
              heart_rate: '72 bpm',
              oxygen_saturation: '98%'
            }
          },
          {
            id: 2,
            name: 'Emily Davis',
            age: 32,
            gender: 'Female',
            condition: 'Post-Surgery Recovery',
            room_number: '203',
            status: 'Recovering',
            assigned_date: '2024-01-18',
            last_checkup: '4 hours ago',
            doctor_name: 'Dr. Michael Chen',
            contact: '+1 234-567-8902',
            blood_type: 'A+',
            allergies: 'None',
            current_vitals: {
              temperature: '99.1°F',
              blood_pressure: '115/75',
              heart_rate: '78 bpm',
              oxygen_saturation: '97%'
            }
          },
          {
            id: 3,
            name: 'Robert Brown',
            age: 58,
            gender: 'Male',
            condition: 'Heart Disease',
            room_number: '105',
            status: 'Critical',
            assigned_date: '2024-01-10',
            last_checkup: '30 minutes ago',
            doctor_name: 'Dr. Sarah Wilson',
            contact: '+1 234-567-8903',
            blood_type: 'B+',
            allergies: 'Aspirin',
            current_vitals: {
              temperature: '100.2°F',
              blood_pressure: '145/95',
              heart_rate: '88 bpm',
              oxygen_saturation: '94%'
            }
          },
          {
            id: 4,
            name: 'Linda Wilson',
            age: 41,
            gender: 'Female',
            condition: 'Diabetes Management',
            room_number: '208',
            status: 'Stable',
            assigned_date: '2024-01-16',
            last_checkup: '1 hour ago',
            doctor_name: 'Dr. Emily Rodriguez',
            contact: '+1 234-567-8904',
            blood_type: 'AB+',
            allergies: 'Latex',
            current_vitals: {
              temperature: '98.4°F',
              blood_pressure: '118/78',
              heart_rate: '70 bpm',
              oxygen_saturation: '99%'
            }
          },
          {
            id: 5,
            name: 'Michael Lee',
            age: 29,
            gender: 'Male',
            condition: 'Severe Migraine',
            room_number: '302',
            status: 'Recovering',
            assigned_date: '2024-01-19',
            last_checkup: '3 hours ago',
            doctor_name: 'Dr. James Martinez',
            contact: '+1 234-567-8905',
            blood_type: 'O-',
            allergies: 'Sulfa drugs',
            current_vitals: {
              temperature: '98.8°F',
              blood_pressure: '122/82',
              heart_rate: '75 bpm',
              oxygen_saturation: '98%'
            }
          }
        ];
        setPatients(mockPatients);
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*, assigned_staff(staff_id)')
        .order('name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const recordVitals = async () => {
    if (demoMode) {
      toast.success('Vitals recorded successfully!');
      setShowVitalsModal(false);
      setVitals({
        temperature: '',
        blood_pressure: '',
        heart_rate: '',
        respiratory_rate: '',
        oxygen_saturation: '',
        notes: ''
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('patient_vitals')
        .insert({
          patient_id: selectedPatient.id,
          ...vitals,
          recorded_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Vitals recorded successfully!');
      setShowVitalsModal(false);
      setVitals({
        temperature: '',
        blood_pressure: '',
        heart_rate: '',
        respiratory_rate: '',
        oxygen_saturation: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error recording vitals:', error);
      toast.error('Failed to record vitals');
    }
  };

  const addObservation = async () => {
    if (demoMode) {
      toast.success('Observation added successfully!');
      setObservations({
        observation: '',
        symptoms: '',
        condition: ''
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('patient_observations')
        .insert({
          patient_id: selectedPatient.id,
          ...observations,
          recorded_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Observation added successfully!');
      setObservations({
        observation: '',
        symptoms: '',
        condition: ''
      });
    } catch (error) {
      console.error('Error adding observation:', error);
      toast.error('Failed to add observation');
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.room_number.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || patient.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      case 'stable':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'recovering':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const stats = {
    total: patients.length,
    critical: patients.filter(p => p.status.toLowerCase() === 'critical').length,
    stable: patients.filter(p => p.status.toLowerCase() === 'stable').length,
    recovering: patients.filter(p => p.status.toLowerCase() === 'recovering').length
  };

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
                Assigned Patients
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and monitor your assigned patients
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
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
                <p className="text-orange-100">Total Patients</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.critical}</h3>
                <p className="text-red-100">Critical</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.stable}</h3>
                <p className="text-green-100">Stable</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.recovering}</h3>
                <p className="text-yellow-100">Recovering</p>
              </motion.div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or room number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="critical">Critical</option>
                    <option value="stable">Stable</option>
                    <option value="recovering">Recovering</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Patients Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No patients found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedPatient(patient);
                      setShowDetailsModal(true);
                    }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                              {patient.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {patient.age} years • {patient.gender}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Activity className="w-4 h-4" />
                          <span>{patient.condition}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span>Room {patient.room_number}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Last checkup: {patient.last_checkup}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient);
                            setShowVitalsModal(true);
                          }}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Heart className="w-4 h-4" />
                          Vitals
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient);
                            setShowDetailsModal(true);
                          }}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.main>
      </div>

      {/* Patient Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedPatient.name}
                    </h2>
                    <p className="text-orange-100">
                      Room {selectedPatient.room_number} • {selectedPatient.condition}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Patient Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedPatient.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Blood Type</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedPatient.blood_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPatient.status)}`}>
                      {selectedPatient.status}
                    </span>
                  </div>
                </div>

                {/* Current Vitals */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Current Vitals
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 rounded-lg">
                      <Thermometer className="w-5 h-5 text-red-500 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">{selectedPatient.current_vitals.temperature}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Blood Pressure</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">{selectedPatient.current_vitals.blood_pressure}</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 p-4 rounded-lg">
                      <Heart className="w-5 h-5 text-pink-500 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">{selectedPatient.current_vitals.heart_rate}</p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                      <Wind className="w-5 h-5 text-cyan-500 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Oxygen</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">{selectedPatient.current_vitals.oxygen_saturation}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Attending Doctor</p>
                    <p className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-orange-500" />
                      {selectedPatient.doctor_name}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Allergies</p>
                    <p className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      {selectedPatient.allergies}
                    </p>
                  </div>
                </div>

                {/* Add Observation */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Add Observation
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Observation
                      </label>
                      <textarea
                        value={observations.observation}
                        onChange={(e) => setObservations({ ...observations, observation: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
                        placeholder="Enter your observation..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Symptoms
                        </label>
                        <input
                          type="text"
                          value={observations.symptoms}
                          onChange={(e) => setObservations({ ...observations, symptoms: e.target.value })}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
                          placeholder="e.g., Fever, Cough"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Condition Update
                        </label>
                        <input
                          type="text"
                          value={observations.condition}
                          onChange={(e) => setObservations({ ...observations, condition: e.target.value })}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
                          placeholder="e.g., Improving, Stable"
                        />
                      </div>
                    </div>
                    <button
                      onClick={addObservation}
                      className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save Observation
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Record Vitals Modal */}
      <AnimatePresence>
        {showVitalsModal && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowVitalsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Record Vitals
                    </h2>
                    <p className="text-blue-100">
                      {selectedPatient.name} • Room {selectedPatient.room_number}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowVitalsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      Temperature (°F)
                    </label>
                    <input
                      type="text"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                      placeholder="98.6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      Blood Pressure
                    </label>
                    <input
                      type="text"
                      value={vitals.blood_pressure}
                      onChange={(e) => setVitals({ ...vitals, blood_pressure: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                      placeholder="120/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="text"
                      value={vitals.heart_rate}
                      onChange={(e) => setVitals({ ...vitals, heart_rate: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                      placeholder="72"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Wind className="w-4 h-4 text-cyan-500" />
                      Respiratory Rate
                    </label>
                    <input
                      type="text"
                      value={vitals.respiratory_rate}
                      onChange={(e) => setVitals({ ...vitals, respiratory_rate: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                      placeholder="16"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-500" />
                      Oxygen Saturation (%)
                    </label>
                    <input
                      type="text"
                      value={vitals.oxygen_saturation}
                      onChange={(e) => setVitals({ ...vitals, oxygen_saturation: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                      placeholder="98"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={vitals.notes}
                    onChange={(e) => setVitals({ ...vitals, notes: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                    placeholder="Any additional notes..."
                  />
                </div>

                <button
                  onClick={recordVitals}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Record Vitals
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffPatients;
