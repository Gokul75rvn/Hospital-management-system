import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Demo mode - skip authentication
  const demoMode = true

  useEffect(() => {
    if (demoMode) {
      setLoading(false)
      return
    }

    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const u = session?.user ?? null
        setUser(u)
        if (u) {
          await loadProfile(u.id)
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null
      setUser(u)
      
      if (u && event === 'SIGNED_IN') {
        await loadProfile(u.id)
      } else if (!u) {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const loadProfile = async (id) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
      if (error) {
        console.error('Profile load error:', error)
        setProfile(null)
        if (error.code === '42P01') {
          toast.error('Database tables not set up. Please run the schema SQL file.')
        }
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Profile exception:', err)
      setProfile(null)
    }
  }

  const signUp = async ({ email, password, name, role, specialization }) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        toast.error(error.message)
        setLoading(false)
        return { error }
      }
      
      const userId = data.user?.id
      if (userId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: userId, email, role, name, specialization })
        
        if (profileError) {
          if (profileError.code === '42P01') {
            toast.error('Database not set up. Please run the schema SQL file.')
          } else {
            toast.error('Error creating profile: ' + profileError.message)
          }
          setLoading(false)
          return { error: profileError }
        }
        
        toast.success('Registration successful!')
        setLoading(false)
        return { data }
      }
    } catch (err) {
      toast.error('Registration failed: ' + err.message)
      setLoading(false)
      return { error: err }
    }
  }

  const signIn = async ({ email, password }) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message)
        setLoading(false)
        return { error }
      }
      
      if (data.user) {
        await loadProfile(data.user.id)
      }
      
      toast.success('Logged in successfully!')
      setLoading(false)
      return { data }
    } catch (err) {
      toast.error('Login failed: ' + err.message)
      setLoading(false)
      return { error: err }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (err) {
      toast.error('Error logging out')
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, loadProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
