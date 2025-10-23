import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Database, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DatabaseCheck() {
  const [checking, setChecking] = useState(false)
  const [results, setResults] = useState(null)

  const checkDatabase = async () => {
    setChecking(true)
    const checks = {
      connection: { status: 'pending', message: '' },
      auth: { status: 'pending', message: '' },
      profiles: { status: 'pending', message: '' },
      appointments: { status: 'pending', message: '' },
      patients: { status: 'pending', message: '' }
    }

    try {
      // 1. Check connection
      const { data: connTest, error: connError } = await supabase.from('profiles').select('count')
      if (connError) {
        if (connError.code === '42P01') {
          checks.connection.status = 'warning'
          checks.connection.message = '✅ Connected but tables missing'
          checks.profiles.status = 'error'
          checks.profiles.message = '❌ Table does not exist'
          checks.appointments.status = 'error'
          checks.appointments.message = '❌ Table does not exist'
          checks.patients.status = 'error'
          checks.patients.message = '❌ Table does not exist'
        } else {
          checks.connection.status = 'error'
          checks.connection.message = `❌ ${connError.message}`
        }
      } else {
        checks.connection.status = 'success'
        checks.connection.message = '✅ Connected to Supabase'
        checks.profiles.status = 'success'
        checks.profiles.message = '✅ Profiles table exists'
      }

      // 2. Check auth
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        checks.auth.status = 'success'
        checks.auth.message = `✅ Logged in as ${session.user.email}`
      } else {
        checks.auth.status = 'warning'
        checks.auth.message = '⚠️ Not logged in'
      }

      // 3. Check appointments table
      if (checks.profiles.status === 'success') {
        const { error: apptError } = await supabase.from('appointments').select('count')
        if (apptError) {
          checks.appointments.status = 'error'
          checks.appointments.message = `❌ ${apptError.message}`
        } else {
          checks.appointments.status = 'success'
          checks.appointments.message = '✅ Appointments table exists'
        }
      }

      // 4. Check patients table
      if (checks.profiles.status === 'success') {
        const { error: patError } = await supabase.from('patients').select('count')
        if (patError) {
          checks.patients.status = 'error'
          checks.patients.message = `❌ ${patError.message}`
        } else {
          checks.patients.status = 'success'
          checks.patients.message = '✅ Patients table exists'
        }
      }

    } catch (error) {
      checks.connection.status = 'error'
      checks.connection.message = `❌ ${error.message}`
    }

    setResults(checks)
    setChecking(false)
  }

  const getStatusIcon = (status) => {
    if (status === 'success') return <CheckCircle className="w-5 h-5 text-green-500" />
    if (status === 'error') return <XCircle className="w-5 h-5 text-red-500" />
    if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    return <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <Database className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Database Diagnostics</h1>
          </div>

          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This tool checks if your Supabase database is properly configured. If you see errors, you need to run the SQL schema.
            </p>
          </div>

          <button
            onClick={checkDatabase}
            disabled={checking}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-8"
          >
            {checking ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Database className="w-5 h-5 mr-2" />
                Run Database Check
              </>
            )}
          </button>

          {results && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Results:</h2>
              
              {Object.entries(results).map(([key, result]) => (
                <div key={key} className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="mr-3 mt-0.5">{getStatusIcon(result.status)}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white capitalize">{key}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{result.message}</p>
                  </div>
                </div>
              ))}

              {results.profiles?.status === 'error' && (
                <div className="mt-6 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                  <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-3 flex items-center">
                    <XCircle className="w-6 h-6 mr-2" />
                    Database Tables Not Found!
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    You need to create the database tables first. Follow these steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-red-700 dark:text-red-300 text-sm">
                    <li>Go to <a href="https://supabase.com/dashboard/project/mebxqdtfukdcmjcpvdvr/editor/sql" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Supabase SQL Editor</a></li>
                    <li>Open <code className="bg-red-200 dark:bg-red-800 px-2 py-1 rounded">supabase_schema.sql</code> from your project</li>
                    <li>Copy ALL the SQL code</li>
                    <li>Paste it in the SQL Editor and click "Run"</li>
                    <li>Come back here and run the check again</li>
                  </ol>
                  <div className="mt-4">
                    <a
                      href="https://supabase.com/dashboard/project/mebxqdtfukdcmjcpvdvr/editor/sql"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Open SQL Editor →
                    </a>
                  </div>
                </div>
              )}

              {results.profiles?.status === 'success' && (
                <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2 flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Database is Ready!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    All tables are created. You can now register and login.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              ← Back to Home
            </Link>
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors font-semibold"
            >
              Go to Register →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
