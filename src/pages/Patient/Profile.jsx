import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Activity,
  Droplet,
  Edit2,
  Save,
  X,
  Bell,
  Shield,
  FileText,
  AlertCircle
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';

const PatientProfile = () => {
  const demoMode = true;
  
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 234-567-8900',
    address: '123 Healthcare Street, Medical City, MC 12345',
    dob: '1980-05-15',
    gender: 'Male',
    blood_type: 'O+',
    height: '180 cm',
    weight: '75 kg',
    allergies: 'Penicillin, Peanuts',
    chronic_conditions: 'Hypertension',
    emergency_contact_name: 'Jane Doe',
    emergency_contact_phone: '+1 234-567-8901',
    emergency_contact_relation: 'Spouse'
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    appointments: true,
    reminders: true
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (demoMode) {
      // Profile already set in state
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const updateProfile = async () => {
    if (demoMode) {
      setLoading(true);
      setTimeout(() => {
        toast.success('Profile updated successfully!');
        setEditMode(false);
        setLoading(false);
      }, 1000);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updateNotifications = async (key, value) => {
    setNotifications({ ...notifications, [key]: value });
    
    if (demoMode) {
      toast.success('Notification preferences updated');
      return;
    }

    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({ [key]: value });

      if (error) throw error;
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update preferences');
    }
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    const heightInMeters = parseFloat(profile.height) / 100;
    const weightInKg = parseFloat(profile.weight);
    const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    return bmi;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-yellow-600' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-orange-600' };
    return { text: 'Obese', color: 'text-red-600' };
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(parseFloat(bmi));

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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  My Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your personal and medical information
                </p>
              </div>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Card & Health Stats */}
              <div className="space-y-6">
                {/* Profile Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                    <p className="text-teal-100 mb-4">{calculateAge(profile.dob)} years old</p>
                    <div className="w-full space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{profile.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Droplet className="w-4 h-4" />
                        <span>Blood Type: {profile.blood_type}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Health Stats */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal-500" />
                    Health Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Height</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">{profile.height}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weight</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">{profile.weight}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">BMI</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{bmi}</p>
                        <span className={`text-sm font-semibold ${bmiCategory.color}`}>
                          {bmiCategory.text}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Middle & Right Column - Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-500" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      {editMode ? (
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      {editMode ? (
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date of Birth
                      </label>
                      {editMode ? (
                        <input
                          type="date"
                          value={profile.dob}
                          onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">
                          {new Date(profile.dob).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Gender
                      </label>
                      {editMode ? (
                        <select
                          value={profile.gender}
                          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.gender}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Blood Type
                      </label>
                      {editMode ? (
                        <select
                          value={profile.blood_type}
                          onChange={(e) => setProfile({ ...profile, blood_type: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.blood_type}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      {editMode ? (
                        <textarea
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          rows="2"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.address}</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Medical Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Medical Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Height
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={profile.height}
                          onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                          placeholder="e.g., 180 cm"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.height}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Weight
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={profile.weight}
                          onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                          placeholder="e.g., 75 kg"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.weight}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        Allergies
                      </label>
                      {editMode ? (
                        <textarea
                          value={profile.allergies}
                          onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                          rows="2"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                          placeholder="List any allergies..."
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.allergies || 'None'}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Chronic Conditions
                      </label>
                      {editMode ? (
                        <textarea
                          value={profile.chronic_conditions}
                          onChange={(e) => setProfile({ ...profile, chronic_conditions: e.target.value })}
                          rows="2"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                          placeholder="List any chronic conditions..."
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.chronic_conditions || 'None'}</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Emergency Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-500" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={profile.emergency_contact_name}
                          onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.emergency_contact_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      {editMode ? (
                        <input
                          type="tel"
                          value={profile.emergency_contact_phone}
                          onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.emergency_contact_phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Relation
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={profile.emergency_contact_relation}
                          onChange={(e) => setProfile({ ...profile, emergency_contact_relation: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white font-medium">{profile.emergency_contact_relation}</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Notification Preferences */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-500" />
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-800 dark:text-white font-medium capitalize">
                          {key.replace('_', ' ')}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => updateNotifications(key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default PatientProfile;
