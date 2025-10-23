import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Search, 
  Filter,
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  X,
  Stethoscope,
  FileText,
  Trash2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PatientAppointments = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [bookingForm, setBookingForm] = useState({
    doctor_id: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    if (user) {
      loadAppointments();
      loadDoctors();
      
      // Subscribe to realtime changes
      const subscription = api.realtime.subscribeToAppointments(() => {
        loadAppointments();
      });

      return () => {
        api.realtime.unsubscribe(subscription);
      };
    }
  }, [user]);

  const loadAppointments = async () => {
    setLoading(true);
    
    const { data, error } = await api.appointments.getAppointments({
      patientId: user?.id
    });

    if (!error && data) {
      setAppointments(data);
    }
    
    setLoading(false);
  };

  const loadDoctors = async () => {
    const { data, error } = await api.doctors.getAllDoctors();
    
    if (!error && data) {
      setDoctors(data);
    }
  };

  const bookAppointment = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('Please log in to book an appointment');
      return;
    }

    const { data, error } = await api.appointments.createAppointment(bookingForm);

    if (!error && data) {
      loadAppointments();
      setShowBookingModal(false);
      setBookingForm({ doctor_id: '', date: '', time: '', reason: '' });
    }
  };

  const cancelAppointment = async (appointmentId) => {
    const { error } = await api.appointments.cancelAppointment(appointmentId);
    
    if (!error) {
      loadAppointments();
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const doctorName = apt.doctor?.name || '';
    const matchesSearch = doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'cancelled':
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(apt => 
      new Date(apt.date) >= new Date() && !['cancelled', 'rejected'].includes(apt.status.toLowerCase())
    ).length,
    completed: appointments.filter(apt => apt.status.toLowerCase() === 'completed').length,
    cancelled: appointments.filter(apt => ['cancelled', 'rejected'].includes(apt.status.toLowerCase())).length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar demoRole="patient" />
      <div className="flex">
        <Sidebar demoRole="patient" />
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
                My Appointments
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track all your appointments
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
                <p className="text-teal-100">Total Appointments</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.upcoming}</h3>
                <p className="text-blue-100">Upcoming</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.completed}</h3>
                <p className="text-green-100">Completed</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <XCircle className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.cancelled}</h3>
                <p className="text-red-100">Cancelled</p>
              </motion.div>
            </div>

            {/* Search, Filter & Book Button */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by doctor name or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="accepted">Accepted</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    Book New
                  </button>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No appointments found</p>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all"
                >
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt, index) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Appointment Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {apt.doctor?.name?.split(' ')[1]?.[0] || 'D'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(apt.status)}
                                <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                                  {apt.doctor?.name || 'Doctor'}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {apt.doctor?.specialization || 'General'}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-teal-500" />
                                  <span>{new Date(apt.date).toLocaleDateString('en-US', { 
                                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                                  })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-500" />
                                  <span>{apt.time}</span>
                                </div>
                                {apt.notes && (
                                  <div className="flex items-center gap-2 md:col-span-2">
                                    <FileText className="w-4 h-4 text-purple-500" />
                                    <span>{apt.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-col items-end gap-3">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                          <div className="flex gap-2">
                            {(['accepted', 'pending'].includes(apt.status.toLowerCase())) && 
                             new Date(apt.date) > new Date() && (
                              <button
                                onClick={() => cancelAppointment(apt.id)}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setShowDetailsModal(true);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg transition-all text-sm font-medium"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {apt.notes && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Notes:</span> {apt.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.main>
      </div>

      {/* Book Appointment Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-cyan-500 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Book Appointment
                    </h2>
                    <p className="text-teal-100">
                      Schedule a visit with your doctor
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <form onSubmit={bookAppointment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Doctor
                  </label>
                  <select
                    value={bookingForm.doctor_id}
                    onChange={(e) => {
                      setBookingForm({ 
                        ...bookingForm, 
                        doctor_id: e.target.value
                      });
                    }}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                    required
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
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
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
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
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                    required
                  >
                    <option value="">Select time...</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Visit
                  </label>
                  <textarea
                    value={bookingForm.reason}
                    onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                    placeholder="Brief description of your symptoms or reason..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Book Appointment
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedAppointment && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-cyan-500 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Appointment Details
                    </h2>
                    <p className="text-teal-100">
                      {selectedAppointment.doctor?.name || 'Doctor'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Doctor</p>
                    <p className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-teal-500" />
                      {selectedAppointment.doctor?.name || 'Doctor'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedAppointment.doctor?.specialization || 'General'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                    <p className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time</p>
                    <p className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      {selectedAppointment.time}
                    </p>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-teal-500" />
                      Notes
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientAppointments;
