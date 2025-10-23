import React from 'react'

export default function DashboardCard({ title, value, children }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow-sm hover:shadow-md transition-all">
      <div className="text-xs text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold dark:text-white">{value}</div>
      {children}
    </div>
  )
}
