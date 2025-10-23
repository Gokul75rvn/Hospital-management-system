import { supabase } from '../utils/supabaseClient'
import toast from 'react-hot-toast'

// =============================================
// AUTHENTICATION SERVICES
// =============================================

export const authService = {
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }
}

// =============================================
// APPOINTMENT SERVICES
// =============================================

export const appointmentService = {
  // Get all appointments (with filters)
  async getAppointments(filters = {}) {
    try {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patient:patient_id(id, name, email),
          doctor:doctor_id(id, name, specialization)
        `)
        .order('date', { ascending: true })

      if (filters.patientId) {
        query = query.eq('patient_id', filters.patientId)
      }
      if (filters.doctorId) {
        query = query.eq('doctor_id', filters.doctorId)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.date) {
        query = query.eq('date', filters.date)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      return { data: null, error }
    }
  },

  // Create new appointment
  async createAppointment(appointmentData) {
    try {
      const user = await authService.getCurrentUser()
      if (!user || !user.id) {
        const err = new Error('No authenticated user found')
        console.error('Create appointment failed - no user:', err)
        return { data: null, error: err }
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          doctor_id: appointmentData.doctor_id,
          date: appointmentData.date,
          time: appointmentData.time,
          notes: appointmentData.reason || appointmentData.notes,
          status: 'pending'
        })
        .select(`
          *,
          patient:patient_id(id, name, email),
          doctor:doctor_id(id, name, specialization)
        `)
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        // return structured error for UI
        return { data: null, error }
      }

      toast.success('Appointment booked successfully!')
      return { data, error: null }
    } catch (error) {
      console.error('Error creating appointment:', error)
      // Provide detailed message to UI for debugging
      const err = error?.message ? new Error(error.message) : error
      toast.error('Failed to book appointment: ' + (err.message || 'Unknown error'))
      return { data: null, error: err }
    }
  },

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select()
        .single()

      if (error) throw error
      
      toast.success(`Appointment ${status}`)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast.error('Failed to update appointment')
      return { data: null, error }
    }
  },

  // Delete/Cancel appointment
  async cancelAppointment(appointmentId) {
    return await this.updateAppointmentStatus(appointmentId, 'cancelled')
  },

  // Accept appointment (for doctors)
  async acceptAppointment(appointmentId) {
    return await this.updateAppointmentStatus(appointmentId, 'accepted')
  },

  // Reject appointment (for doctors)
  async rejectAppointment(appointmentId) {
    return await this.updateAppointmentStatus(appointmentId, 'rejected')
  },

  // Complete appointment
  async completeAppointment(appointmentId) {
    return await this.updateAppointmentStatus(appointmentId, 'completed')
  },

  // Get appointment statistics
  async getAppointmentStats(userId, role) {
    try {
      let query = supabase.from('appointments').select('*')
      
      if (role === 'patient') {
        query = query.eq('patient_id', userId)
      } else if (role === 'doctor') {
        query = query.eq('doctor_id', userId)
      }

      const { data, error } = await query

      if (error) throw error

      const stats = {
        total: data.length,
        pending: data.filter(apt => apt.status === 'pending').length,
        accepted: data.filter(apt => apt.status === 'accepted').length,
        completed: data.filter(apt => apt.status === 'completed').length,
        cancelled: data.filter(apt => apt.status === 'cancelled').length,
        rejected: data.filter(apt => apt.status === 'rejected').length,
        upcoming: data.filter(apt => 
          new Date(apt.date) >= new Date() && 
          ['pending', 'accepted'].includes(apt.status)
        ).length
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Error getting appointment stats:', error)
      return { data: null, error }
    }
  }
}

// =============================================
// DOCTOR SERVICES
// =============================================

export const doctorService = {
  // Get all doctors
  async getAllDoctors() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, specialization')
        .eq('role', 'doctor')
        .order('name')

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching doctors:', error)
      return { data: null, error }
    }
  },

  // Get doctor by ID
  async getDoctorById(doctorId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', doctorId)
        .eq('role', 'doctor')
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching doctor:', error)
      return { data: null, error }
    }
  },

  // Get doctor's schedule
  async getDoctorSchedule(doctorId, date) {
    try {
      let query = supabase
        .from('schedules')
        .select('*')
        .eq('doctor_id', doctorId)

      if (date) {
        query = query.eq('date', date)
      }

      const { data, error } = await query.order('date', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching schedule:', error)
      return { data: null, error }
    }
  },

  // Create schedule slot
  async createSchedule(scheduleData) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .insert({
          doctor_id: scheduleData.doctor_id,
          date: scheduleData.date,
          start_time: scheduleData.start_time,
          end_time: scheduleData.end_time,
          slot_status: 'available'
        })
        .select()
        .single()

      if (error) throw error
      
      toast.success('Schedule created successfully!')
      return { data, error: null }
    } catch (error) {
      console.error('Error creating schedule:', error)
      toast.error('Failed to create schedule')
      return { data: null, error }
    }
  }
}

// =============================================
// PATIENT SERVICES
// =============================================

export const patientService = {
  // Get all patients
  async getAllPatients() {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          assigned_staff:assigned_staff_id(id, name),
          primary_doctor:primary_doctor_id(id, name, specialization)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching patients:', error)
      return { data: null, error }
    }
  },

  // Get patient by ID
  async getPatientById(patientId) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          assigned_staff:assigned_staff_id(id, name),
          primary_doctor:primary_doctor_id(id, name, specialization)
        `)
        .eq('id', patientId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching patient:', error)
      return { data: null, error }
    }
  },

  // Create patient record
  async createPatient(patientData) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single()

      if (error) throw error
      
      toast.success('Patient record created successfully!')
      return { data, error: null }
    } catch (error) {
      console.error('Error creating patient:', error)
      toast.error('Failed to create patient record')
      return { data: null, error }
    }
  },

  // Update patient record
  async updatePatient(patientId, patientData) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(patientData)
        .eq('id', patientId)
        .select()
        .single()

      if (error) throw error
      
      toast.success('Patient record updated successfully!')
      return { data, error: null }
    } catch (error) {
      console.error('Error updating patient:', error)
      toast.error('Failed to update patient record')
      return { data: null, error }
    }
  },

  // Delete patient record
  async deletePatient(patientId) {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId)

      if (error) throw error
      
      toast.success('Patient record deleted successfully!')
      return { error: null }
    } catch (error) {
      console.error('Error deleting patient:', error)
      toast.error('Failed to delete patient record')
      return { error }
    }
  }
}

// =============================================
// USER MANAGEMENT SERVICES
// =============================================

export const userService = {
  // Get all users
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching users:', error)
      return { data: null, error }
    }
  },

  // Get users by role
  async getUsersByRole(role) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role)
        .order('name')

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching users by role:', error)
      return { data: null, error }
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      
      toast.success('Profile updated successfully!')
      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
      return { data: null, error }
    }
  }
}

// =============================================
// ATTENDANCE SERVICES
// =============================================

export const attendanceService = {
  // Get attendance records
  async getAttendance(filters = {}) {
    try {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          staff:staff_id(id, name, role)
        `)
        .order('date', { ascending: false })

      if (filters.staffId) {
        query = query.eq('staff_id', filters.staffId)
      }
      if (filters.date) {
        query = query.eq('date', filters.date)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching attendance:', error)
      return { data: null, error }
    }
  },

  // Mark attendance
  async markAttendance(staffId, date, status) {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .upsert({
          staff_id: staffId,
          date: date,
          status: status
        }, {
          onConflict: 'staff_id,date'
        })
        .select()
        .single()

      if (error) throw error
      
      toast.success('Attendance marked successfully!')
      return { data, error: null }
    } catch (error) {
      console.error('Error marking attendance:', error)
      toast.error('Failed to mark attendance')
      return { data: null, error }
    }
  }
}

// =============================================
// NOTICE SERVICES
// =============================================

export const noticeService = {
  // Get all notices
  async getAllNotices() {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select(`
          *,
          creator:created_by(id, name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching notices:', error)
      return { data: null, error }
    }
  },

  // Create notice
  async createNotice(noticeData) {
    try {
      const user = await authService.getCurrentUser()
      
      const { data, error } = await supabase
        .from('notices')
        .insert({
          title: noticeData.title,
          message: noticeData.message,
          created_by: user.id
        })
        .select()
        .single()

      if (error) throw error
      
      toast.success('Notice created successfully!')
      return { data, error: null }
    } catch (error) {
      console.error('Error creating notice:', error)
      toast.error('Failed to create notice')
      return { data: null, error }
    }
  },

  // Delete notice
  async deleteNotice(noticeId) {
    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', noticeId)

      if (error) throw error
      
      toast.success('Notice deleted successfully!')
      return { error: null }
    } catch (error) {
      console.error('Error deleting notice:', error)
      toast.error('Failed to delete notice')
      return { error }
    }
  }
}

// =============================================
// DASHBOARD STATISTICS
// =============================================

export const dashboardService = {
  // Get admin dashboard stats
  async getAdminStats() {
    try {
      const [users, appointments, patients] = await Promise.all([
        supabase.from('profiles').select('id, role'),
        supabase.from('appointments').select('id, status, date'),
        supabase.from('patients').select('id')
      ])

      const stats = {
        totalUsers: users.data?.length || 0,
        totalDoctors: users.data?.filter(u => u.role === 'doctor').length || 0,
        totalStaff: users.data?.filter(u => u.role === 'staff').length || 0,
        totalPatients: patients.data?.length || 0,
        totalAppointments: appointments.data?.length || 0,
        pendingAppointments: appointments.data?.filter(a => a.status === 'pending').length || 0,
        todayAppointments: appointments.data?.filter(a => 
          new Date(a.date).toDateString() === new Date().toDateString()
        ).length || 0
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      return { data: null, error }
    }
  },

  // Get doctor dashboard stats
  async getDoctorStats(doctorId) {
    try {
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorId)

      const today = new Date().toDateString()
      
      const stats = {
        totalAppointments: appointments?.length || 0,
        todayAppointments: appointments?.filter(a => 
          new Date(a.date).toDateString() === today
        ).length || 0,
        pendingAppointments: appointments?.filter(a => a.status === 'pending').length || 0,
        completedAppointments: appointments?.filter(a => a.status === 'completed').length || 0
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Error fetching doctor stats:', error)
      return { data: null, error }
    }
  },

  // Get patient dashboard stats
  async getPatientStats(patientId) {
    try {
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)

      const stats = {
        totalAppointments: appointments?.length || 0,
        upcomingAppointments: appointments?.filter(a => 
          new Date(a.date) >= new Date() && ['pending', 'accepted'].includes(a.status)
        ).length || 0,
        completedAppointments: appointments?.filter(a => a.status === 'completed').length || 0
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Error fetching patient stats:', error)
      return { data: null, error }
    }
  }
}

// =============================================
// REALTIME SUBSCRIPTIONS
// =============================================

export const realtimeService = {
  // Subscribe to appointments changes
  subscribeToAppointments(callback) {
    const subscription = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        callback
      )
      .subscribe()

    return subscription
  },

  // Subscribe to notices changes
  subscribeToNotices(callback) {
    const subscription = supabase
      .channel('notices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notices'
        },
        callback
      )
      .subscribe()

    return subscription
  },

  // Unsubscribe
  unsubscribe(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription)
    }
  }
}

export default {
  auth: authService,
  appointments: appointmentService,
  doctors: doctorService,
  patients: patientService,
  users: userService,
  attendance: attendanceService,
  notices: noticeService,
  dashboard: dashboardService,
  realtime: realtimeService
}
