import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import toast from 'react-hot-toast'
import { 
  FileText, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  BarChart3,
  Activity
} from 'lucide-react'

export default function Reports() {
  const [reportType, setReportType] = useState('overview')
  const [dateRange, setDateRange] = useState('month')
  const [loading, setLoading] = useState(false)

  const demoMode = true

  // Mock data for various reports
  const overviewStats = {
    totalAppointments: 156,
    appointmentGrowth: '+12%',
    totalPatients: 89,
    patientGrowth: '+8%',
    totalDoctors: 12,
    doctorGrowth: '+2',
    totalRevenue: '$45,320',
    revenueGrowth: '+18%',
  }

  const appointmentsByMonth = [
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 52 },
    { month: 'Mar', count: 48 },
    { month: 'Apr', count: 61 },
    { month: 'May', count: 58 },
    { month: 'Jun', count: 67 },
    { month: 'Jul', count: 72 },
    { month: 'Aug', count: 68 },
    { month: 'Sep', count: 75 },
    { month: 'Oct', count: 156 },
  ]

  const doctorPerformance = [
    { name: 'Dr. Sarah Johnson', specialization: 'Cardiologist', appointments: 45, rating: 4.8 },
    { name: 'Dr. James Chen', specialization: 'Neurologist', appointments: 38, rating: 4.7 },
    { name: 'Dr. Maria Garcia', specialization: 'Pediatrician', appointments: 42, rating: 4.9 },
    { name: 'Dr. David Kumar', specialization: 'Orthopedic', appointments: 31, rating: 4.6 },
  ]

  const appointmentsByStatus = [
    { status: 'Completed', count: 98, percentage: 63 },
    { status: 'Accepted', count: 32, percentage: 20 },
    { status: 'Pending', count: 18, percentage: 12 },
    { status: 'Rejected', count: 8, percentage: 5 },
  ]

  const patientDemographics = [
    { ageGroup: '0-18', count: 23, percentage: 26 },
    { ageGroup: '19-35', count: 31, percentage: 35 },
    { ageGroup: '36-50', count: 22, percentage: 25 },
    { ageGroup: '51+', count: 13, percentage: 14 },
  ]

  const handleExportReport = () => {
    toast.success('Report exported successfully! (Demo Mode)')
  }

  const maxAppointments = Math.max(...appointmentsByMonth.map(m => m.count))

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
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  Reports & Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  View comprehensive reports and insights
                </p>
              </div>
              <button
                onClick={handleExportReport}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                Export Report
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="overview">System Overview</option>
                    <option value="appointments">Appointments Analysis</option>
                    <option value="doctors">Doctor Performance</option>
                    <option value="patients">Patient Demographics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 3 Months</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Appointments', value: overviewStats.totalAppointments, growth: overviewStats.appointmentGrowth, color: 'from-blue-500 to-blue-600', icon: Calendar },
                { label: 'Total Patients', value: overviewStats.totalPatients, growth: overviewStats.patientGrowth, color: 'from-green-500 to-green-600', icon: Users },
                { label: 'Active Doctors', value: overviewStats.totalDoctors, growth: overviewStats.doctorGrowth, color: 'from-purple-500 to-purple-600', icon: Activity },
                { label: 'Revenue', value: overviewStats.totalRevenue, growth: overviewStats.revenueGrowth, color: 'from-orange-500 to-orange-600', icon: TrendingUp },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-8 h-8 opacity-80" />
                      <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                        {stat.growth}
                      </span>
                    </div>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm opacity-90">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>

            {/* Appointments Trend Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Appointments Trend
                </h2>
                <BarChart3 className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-3">
                {appointmentsByMonth.map((data, index) => (
                  <motion.div
                    key={data.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {data.month}
                    </span>
                    <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.count / maxAppointments) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-end pr-3"
                      >
                        <span className="text-white text-sm font-semibold">{data.count}</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Doctor Performance */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                  Doctor Performance
                </h2>
                <div className="space-y-4">
                  {doctorPerformance.map((doctor, index) => (
                    <motion.div
                      key={doctor.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {doctor.specialization}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {doctor.appointments}
                          </div>
                          <div className="text-xs text-gray-500">appointments</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(doctor.rating / 5) * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {doctor.rating}⭐
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Appointments by Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                  Appointments by Status
                </h2>
                <div className="space-y-4">
                  {appointmentsByStatus.map((item, index) => (
                    <motion.div
                      key={item.status}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {item.status}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className={`h-full ${
                            item.status === 'Completed' ? 'bg-green-500' :
                            item.status === 'Accepted' ? 'bg-blue-500' :
                            item.status === 'Pending' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Patient Demographics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Patient Demographics by Age
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {patientDemographics.map((demo, index) => (
                  <motion.div
                    key={demo.ageGroup}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl"
                  >
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {demo.count}
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {demo.ageGroup} years
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {demo.percentage}% of total
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  )
}
