import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Search, 
  Filter,
  Clock, 
  Users,
  User,
  Activity,
  X,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  FileText,
  Phone,
  Mail
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';

const StaffAppointments = () => {
  const demoMode = true;
  
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    
    if (demoMode) {
      // Mock data for demo mode
      setTimeout(() => {
        const mockAppointments = [
          {
            id: 1,
            patient_name: 'John Doe',
            patient_age: 45,
            patient_contact: '+1 234-567-8901',
            patient_email: 'john.doe@email.com',
            doctor_name: 'Dr. Sarah Wilson',
            doctor_specialization: 'Cardiology',
            appointment_date: new Date().toISOString(),
            appointment_time: '09:00 AM',
            status: 'Scheduled',
            reason: 'Regular Checkup',
            room_number: '101',
            notes: 'Patient needs blood pressure monitoring'
          },
          {
            id: 2,
            patient_name: 'Emily Davis',
            patient_age: 32,
            patient_contact: '+1 234-567-8902',
            patient_email: 'emily.davis@email.com',
            doctor_name: 'Dr. Michael Chen',
            doctor_specialization: 'General Surgery',
            appointment_date: new Date().toISOString(),
            appointment_time: '10:30 AM',
            status: 'In Progress',
            reason: 'Post-Surgery Follow-up',
            room_number: '203',
            notes: 'Check surgical wound healing'
          },
          {
            id: 3,
            patient_name: 'Robert Brown',
            patient_age: 58,
            patient_contact: '+1 234-567-8903',
            patient_email: 'robert.brown@email.com',
            doctor_name: 'Dr. Sarah Wilson',
            doctor_specialization: 'Cardiology',
            appointment_date: new Date().toISOString(),
            appointment_time: '02:00 PM',
            status: 'Scheduled',
            reason: 'Heart Disease Consultation',
            room_number: '105',
            notes: 'Critical patient - priority handling'
          },
          {
            id: 4,
            patient_name: 'Linda Wilson',
            patient_age: 41,
            patient_contact: '+1 234-567-8904',
            patient_email: 'linda.wilson@email.com',
            doctor_name: 'Dr. Emily Rodriguez',
            doctor_specialization: 'Endocrinology',
            appointment_date: new Date(Date.now() + 86400000).toISOString(),
            appointment_time: '11:00 AM',
            status: 'Scheduled',
            reason: 'Diabetes Management',
            room_number: '208',
            notes: 'Blood sugar monitoring required'
          },
          {
            id: 5,
            patient_name: 'Michael Lee',
            patient_age: 29,
            patient_contact: '+1 234-567-8905',
            patient_email: 'michael.lee@email.com',
            doctor_name: 'Dr. James Martinez',
            doctor_specialization: 'Neurology',
            appointment_date: new Date(Date.now() - 86400000).toISOString(),
            appointment_time: '03:30 PM',
            status: 'Completed',
            reason: 'Migraine Treatment',
            room_number: '302',
            notes: 'Prescribed medication working well'
          },
          {
            id: 6,
            patient_name: 'Sarah Johnson',
            patient_age: 35,
            patient_contact: '+1 234-567-8906',
            patient_email: 'sarah.johnson@email.com',
            doctor_name: 'Dr. Michael Chen',
            doctor_specialization: 'General Surgery',
            appointment_date: new Date(Date.now() - 86400000).toISOString(),
            appointment_time: '01:00 PM',
            status: 'Cancelled',
            reason: 'Routine Consultation',
            room_number: 'N/A',
            notes: 'Patient requested cancellation'
          }
        ];
        setAppointments(mockAppointments);
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patient_id (name, age, contact, email),
          doctor:doctor_id (name, specialization)
        `)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    if (demoMode) {
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
      toast.success(`Appointment marked as ${newStatus}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      loadAppointments();
      toast.success(`Appointment marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.doctor_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status.toLowerCase() === statusFilter.toLowerCase();
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date().toDateString();
      matchesDate = new Date(apt.appointment_date).toDateString() === today;
    } else if (dateFilter === 'upcoming') {
      matchesDate = new Date(apt.appointment_date) > new Date();
    } else if (dateFilter === 'past') {
      matchesDate = new Date(apt.appointment_date) < new Date();
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const stats = {
    total: appointments.length,
    today: appointments.filter(apt => 
      new Date(apt.appointment_date).toDateString() === new Date().toDateString()
    ).length,
    scheduled: appointments.filter(apt => apt.status.toLowerCase() === 'scheduled').length,
    completed: appointments.filter(apt => apt.status.toLowerCase() === 'completed').length
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
                Appointments
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage all appointments
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
                <p className="text-blue-100">Total Appointments</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.today}</h3>
                <p className="text-orange-100">Today's Appointments</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.scheduled}</h3>
                <p className="text-yellow-100">Scheduled</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
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
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by patient or doctor name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
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
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No appointments found</p>
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
                        {/* Patient Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {apt.patient_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-2">
                                {apt.patient_name}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                  <Stethoscope className="w-4 h-4 text-blue-500" />
                                  <span>{apt.doctor_name} ({apt.doctor_specialization})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-orange-500" />
                                  <span>{new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-purple-500" />
                                  <span>Room {apt.room_number}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-green-500" />
                                  <span>{apt.reason}</span>
                                </div>
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
                            {apt.status.toLowerCase() === 'scheduled' && (
                              <>
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'In Progress')}
                                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white rounded-lg transition-all text-sm font-medium"
                                >
                                  Start
                                </button>
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all text-sm font-medium"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {apt.status.toLowerCase() === 'in progress' && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all text-sm font-medium"
                              >
                                Complete
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setShowDetailsModal(true);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all text-sm font-medium"
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Appointment Details
                    </h2>
                    <p className="text-blue-100">
                      {selectedAppointment.patient_name}
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
                {/* Patient Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{selectedAppointment.patient_name}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Age</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{selectedAppointment.patient_age} years</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-white">{selectedAppointment.patient_contact}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">{selectedAppointment.patient_email}</p>
                    </div>
                  </div>
                </div>

                {/* Appointment Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    Appointment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Doctor</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{selectedAppointment.doctor_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedAppointment.doctor_specialization}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {new Date(selectedAppointment.appointment_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedAppointment.appointment_time}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Room Number</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{selectedAppointment.room_number}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reason and Notes */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Reason for Visit
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedAppointment.reason}</p>
                  
                  {selectedAppointment.notes && (
                    <>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Additional Notes</h4>
                      <p className="text-gray-700 dark:text-gray-300">{selectedAppointment.notes}</p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffAppointments;
