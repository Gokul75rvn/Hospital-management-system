import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';

const StaffAttendance = () => {
  const demoMode = true;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayMarked, setTodayMarked] = useState(false);

  useEffect(() => {
    loadAttendanceData();
  }, [currentDate]);

  const loadAttendanceData = async () => {
    setLoading(true);
    
    if (demoMode) {
      // Mock attendance data
      setTimeout(() => {
        const mockData = [];
        const today = new Date();
        
        // Generate mock attendance for the past 30 days
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          // 90% attendance rate
          const isPresent = Math.random() > 0.1;
          
          mockData.push({
            id: i + 1,
            date: date.toISOString().split('T')[0],
            status: isPresent ? 'Present' : 'Absent',
            check_in_time: isPresent ? `${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM` : null,
            check_out_time: isPresent ? `${5 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM` : null,
            total_hours: isPresent ? `${8 + Math.floor(Math.random() * 2)}.${Math.floor(Math.random() * 6)}` : '0'
          });
        }
        
        setAttendanceData(mockData);
        
        // Check if today's attendance is marked
        const todayStr = today.toISOString().split('T')[0];
        const todayAttendance = mockData.find(a => a.date === todayStr);
        setTodayMarked(todayAttendance?.status === 'Present');
        
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setAttendanceData(data || []);
      
      // Check today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = data?.find(a => a.date === today);
      setTodayMarked(todayAttendance?.status === 'present');
    } catch (error) {
      console.error('Error loading attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    if (demoMode) {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      
      const newAttendance = {
        id: attendanceData.length + 1,
        date: today,
        status: 'Present',
        check_in_time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        check_out_time: null,
        total_hours: '0'
      };
      
      setAttendanceData([newAttendance, ...attendanceData]);
      setTodayMarked(true);
      toast.success('Attendance marked successfully!');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('attendance')
        .insert({
          date: today,
          status: 'present',
          check_in_time: new Date().toISOString()
        });

      if (error) throw error;

      loadAttendanceData();
      toast.success('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
      if (error.code === '23505') {
        toast.error('Attendance already marked for today');
      } else {
        toast.error('Failed to mark attendance');
      }
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentDate);

  const getAttendanceForDate = (day) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];
    
    return attendanceData.find(a => a.date === dateStr);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const stats = {
    totalDays: attendanceData.length,
    present: attendanceData.filter(a => a.status.toLowerCase() === 'present').length,
    absent: attendanceData.filter(a => a.status.toLowerCase() === 'absent').length,
    percentage: attendanceData.length > 0 
      ? Math.round((attendanceData.filter(a => a.status.toLowerCase() === 'present').length / attendanceData.length) * 100)
      : 0
  };

  const thisMonthData = attendanceData.filter(a => {
    const aDate = new Date(a.date);
    return aDate.getMonth() === currentDate.getMonth() && 
           aDate.getFullYear() === currentDate.getFullYear();
  });

  const monthStats = {
    present: thisMonthData.filter(a => a.status.toLowerCase() === 'present').length,
    absent: thisMonthData.filter(a => a.status.toLowerCase() === 'absent').length,
    avgHours: thisMonthData.length > 0
      ? (thisMonthData.reduce((sum, a) => sum + (parseFloat(a.total_hours) || 0), 0) / thisMonthData.length).toFixed(1)
      : '0'
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
                Attendance History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your attendance and working hours
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
                <h3 className="text-3xl font-bold mb-1">{stats.totalDays}</h3>
                <p className="text-blue-100">Total Days</p>
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
                <h3 className="text-3xl font-bold mb-1">{stats.present}</h3>
                <p className="text-green-100">Days Present</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <XCircle className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.absent}</h3>
                <p className="text-red-100">Days Absent</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.percentage}%</h3>
                <p className="text-purple-100">Attendance Rate</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar View */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => changeMonth(-1)}
                        className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => changeMonth(1)}
                        className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Day Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 text-sm py-2">
                        {day}
                      </div>
                    ))}
                    
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDay }).map((_, index) => (
                      <div key={`empty-${index}`} className="aspect-square" />
                    ))}
                    
                    {/* Calendar days */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                      const day = index + 1;
                      const attendance = getAttendanceForDate(day);
                      const isToday = 
                        day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear();
                      
                      return (
                        <motion.div
                          key={day}
                          whileHover={{ scale: 1.05 }}
                          className={`
                            aspect-square flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer
                            ${isToday ? 'ring-2 ring-blue-500' : ''}
                            ${attendance?.status.toLowerCase() === 'present' 
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200' 
                              : attendance?.status.toLowerCase() === 'absent'
                              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                          `}
                          title={attendance ? `${attendance.status} - ${attendance.total_hours}h` : 'No record'}
                        >
                          <div className="text-center">
                            <div className={isToday ? 'font-bold' : ''}>{day}</div>
                            {attendance && (
                              <div className="text-xs mt-1">
                                {attendance.status.toLowerCase() === 'present' ? (
                                  <CheckCircle className="w-3 h-3 mx-auto" />
                                ) : (
                                  <XCircle className="w-3 h-3 mx-auto" />
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 dark:bg-red-900 rounded" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">No Record</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Mark Attendance Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`bg-gradient-to-br ${todayMarked ? 'from-green-500 to-emerald-500' : 'from-orange-500 to-red-500'} rounded-xl shadow-lg p-6 text-white`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <UserCheck className="w-8 h-8" />
                    <Activity className="w-6 h-6 opacity-70" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {todayMarked ? 'Attendance Marked' : 'Mark Attendance'}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {todayMarked ? 'You have marked your attendance for today' : 'Mark your presence for today'}
                  </p>
                  {!todayMarked && (
                    <button
                      onClick={markAttendance}
                      className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark Present
                    </button>
                  )}
                  {todayMarked && (
                    <div className="flex items-center gap-2 text-white/90">
                      <CheckCircle className="w-5 h-5" />
                      <span>Marked at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </motion.div>

                {/* Month Statistics */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    This Month
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Present Days</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{monthStats.present}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Absent Days</span>
                      <span className="font-bold text-red-600 dark:text-red-400">{monthStats.absent}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Avg Hours/Day</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{monthStats.avgHours}h</span>
                    </div>
                  </div>
                </motion.div>

                {/* Recent Attendance */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    Recent Records
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {attendanceData.slice(0, 10).map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white text-sm">
                            {new Date(record.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          {record.check_in_time && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {record.check_in_time} - {record.check_out_time || 'In Progress'}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{record.total_hours}h</span>
                          {record.status.toLowerCase() === 'present' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
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

export default StaffAttendance;
