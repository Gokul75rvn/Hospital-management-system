import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function TestConnection() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      // Test 1: Basic connection
      setResult('Step 1: Testing basic connection...\n')
      const { data, error } = await supabase.from('profiles').select('count')
      
      if (error) {
        if (error.code === '42P01') {
          setResult(prev => prev + `\n❌ TABLES DON'T EXIST!\n\nYou need to:\n1. Go to: https://supabase.com/dashboard/project/mebxqdtfukdcmjcpvdvr/editor/sql\n2. Copy all code from supabase_schema.sql\n3. Paste and click Run\n\nError: ${error.message}`)
        } else {
          setResult(prev => prev + `\n❌ Error: ${error.message}\nCode: ${error.code}`)
        }
        setLoading(false)
        return
      }
      
      setResult(prev => prev + '✅ Connected to Supabase!\n')
      setResult(prev => prev + '✅ Profiles table exists!\n')
      
      // Test 2: Auth
      setResult(prev => prev + '\nStep 2: Testing auth...\n')
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setResult(prev => prev + `✅ Logged in as: ${session.user.email}\n`)
      } else {
        setResult(prev => prev + '⚠️ Not logged in\n')
      }
      
      // Test 3: Test signup
      setResult(prev => prev + '\nStep 3: Testing registration (with test@test.com)...\n')
      const testEmail = `test${Date.now()}@test.com`
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456'
      })
      
      if (signupError) {
        setResult(prev => prev + `❌ Signup failed: ${signupError.message}\n`)
      } else {
        setResult(prev => prev + `✅ Signup works! User ID: ${signupData.user?.id}\n`)
        
        // Try to create profile
        if (signupData.user?.id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: signupData.user.id,
              email: testEmail,
              role: 'patient',
              name: 'Test User'
            })
          
          if (profileError) {
            setResult(prev => prev + `❌ Profile creation failed: ${profileError.message}\n`)
          } else {
            setResult(prev => prev + '✅ Profile created successfully!\n')
            setResult(prev => prev + '\n🎉 EVERYTHING WORKS! Try to register now.')
          }
        }
      }
      
    } catch (err) {
      setResult(prev => prev + `\n❌ Exception: ${err.message}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Connection Test</h1>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 mb-4"
        >
          {loading ? 'Testing...' : 'Run Test'}
        </button>
        
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap dark:text-gray-300">
          {result || 'Click "Run Test" to check your setup'}
        </pre>
        
        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  )
}
