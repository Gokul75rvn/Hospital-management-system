import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter,
  Stethoscope,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Clock,
  User,
  Heart
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FindDoctors = () => {
  const demoMode = true;
  const navigate = useNavigate();
  
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    
    if (demoMode) {
      setTimeout(() => {
        const mockDoctors = [
          {
            id: 1,
            name: 'Dr. Sarah Wilson',
            specialization: 'Cardiology',
            experience: '15 years',
            rating: 4.9,
            reviews: 156,
            availability: 'Available Today',
            location: 'Building A, Floor 3',
            phone: '+1 234-567-8901',
            email: 'sarah.wilson@hospital.com',
            education: 'MD, Harvard Medical School',
            languages: ['English', 'Spanish'],
            consultationFee: '$150',
            nextAvailable: 'Today at 2:00 PM',
            image: null,
            about: 'Specialized in heart diseases and cardiovascular surgery with over 15 years of experience.'
          },
          {
            id: 2,
            name: 'Dr. Michael Chen',
            specialization: 'General Surgery',
            experience: '12 years',
            rating: 4.8,
            reviews: 143,
            availability: 'Available Tomorrow',
            location: 'Building B, Floor 2',
            phone: '+1 234-567-8902',
            email: 'michael.chen@hospital.com',
            education: 'MD, Johns Hopkins University',
            languages: ['English', 'Mandarin'],
            consultationFee: '$180',
            nextAvailable: 'Tomorrow at 10:00 AM',
            image: null,
            about: 'Expert in minimally invasive surgical procedures and post-operative care.'
          },
          {
            id: 3,
            name: 'Dr. Emily Rodriguez',
            specialization: 'Endocrinology',
            experience: '10 years',
            rating: 4.9,
            reviews: 189,
            availability: 'Available Today',
            location: 'Building A, Floor 2',
            phone: '+1 234-567-8903',
            email: 'emily.rodriguez@hospital.com',
            education: 'MD, Stanford University',
            languages: ['English', 'Spanish', 'French'],
            consultationFee: '$140',
            nextAvailable: 'Today at 4:00 PM',
            image: null,
            about: 'Specialist in diabetes management and hormonal disorders treatment.'
          },
          {
            id: 4,
            name: 'Dr. James Martinez',
            specialization: 'Neurology',
            experience: '18 years',
            rating: 4.7,
            reviews: 201,
            availability: 'Busy',
            location: 'Building C, Floor 4',
            phone: '+1 234-567-8904',
            email: 'james.martinez@hospital.com',
            education: 'MD, Yale School of Medicine',
            languages: ['English', 'Spanish'],
            consultationFee: '$200',
            nextAvailable: 'Next Monday at 9:00 AM',
            image: null,
            about: 'Renowned neurologist specializing in brain disorders and neurological conditions.'
          },
          {
            id: 5,
            name: 'Dr. Robert Johnson',
            specialization: 'Orthopedics',
            experience: '14 years',
            rating: 4.8,
            reviews: 167,
            availability: 'Available Today',
            location: 'Building B, Floor 3',
            phone: '+1 234-567-8905',
            email: 'robert.johnson@hospital.com',
            education: 'MD, UCLA Medical School',
            languages: ['English'],
            consultationFee: '$160',
            nextAvailable: 'Today at 11:00 AM',
            image: null,
            about: 'Expert in joint replacements and sports injury treatments.'
          },
          {
            id: 6,
            name: 'Dr. Lisa Anderson',
            specialization: 'Pediatrics',
            experience: '11 years',
            rating: 5.0,
            reviews: 223,
            availability: 'Available Tomorrow',
            location: 'Building A, Floor 1',
            phone: '+1 234-567-8906',
            email: 'lisa.anderson@hospital.com',
            education: 'MD, Columbia University',
            languages: ['English', 'German'],
            consultationFee: '$130',
            nextAvailable: 'Tomorrow at 3:00 PM',
            image: null,
            about: 'Dedicated pediatrician with expertise in child development and care.'
          }
        ];
        setDoctors(mockDoctors);
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor')
        .order('name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = specializationFilter === 'all' || 
                                  doctor.specialization.toLowerCase() === specializationFilter.toLowerCase();
    return matchesSearch && matchesSpecialization;
  });

  const specializations = [...new Set(doctors.map(d => d.specialization))];

  const getAvailabilityColor = (availability) => {
    if (availability.includes('Today')) return 'text-green-600 dark:text-green-400';
    if (availability.includes('Tomorrow')) return 'text-blue-600 dark:text-blue-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const bookAppointment = (doctor) => {
    toast.success(`Redirecting to book appointment with ${doctor.name}`);
    navigate('/patient/appointments');
  };

  const stats = {
    total: doctors.length,
    available: doctors.filter(d => d.availability.includes('Today')).length,
    specializations: specializations.length,
    avgRating: doctors.length > 0 
      ? (doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length).toFixed(1)
      : '0'
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
                Find Doctors
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Browse our expert doctors and book appointments
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
                    <Stethoscope className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
                <p className="text-teal-100">Total Doctors</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.available}</h3>
                <p className="text-green-100">Available Today</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.specializations}</h3>
                <p className="text-blue-100">Specializations</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Star className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.avgRating}</h3>
                <p className="text-yellow-100">Average Rating</p>
              </motion.div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                    className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                  >
                    <option value="all">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <Stethoscope className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No doctors found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="p-6">
                      {/* Doctor Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1 truncate">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-1">
                            {doctor.specialization}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">
                              {doctor.rating}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({doctor.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Award className="w-4 h-4 text-blue-500" />
                          <span>{doctor.experience} experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span>{doctor.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span className={getAvailabilityColor(doctor.availability)}>
                            {doctor.availability}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Heart className="w-4 h-4 text-pink-500" />
                          <span>{doctor.consultationFee} consultation</span>
                        </div>
                      </div>

                      {/* About */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {doctor.about}
                      </p>

                      {/* Education Badge */}
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 px-3 py-2 rounded-lg mb-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400">{doctor.education}</p>
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doctor.languages.map(lang => (
                          <span 
                            key={lang}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => bookAppointment(doctor)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Book Now
                        </button>
                        <a
                          href={`tel:${doctor.phone}`}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Next Available */}
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Next available: <span className="font-medium text-gray-800 dark:text-white">{doctor.nextAvailable}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default FindDoctors;
