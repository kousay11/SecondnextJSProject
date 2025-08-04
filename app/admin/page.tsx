import React from 'react'
import DashboardStatistics from './messages/components/DashboardStatistics'

const AdminHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header de bienvenue */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">🎛️ Dashboard Admin</h1>
            <p className="text-blue-100 text-lg">
              Bienvenue dans votre espace d&apos;administration. Gérez vos messages, analysez les statistiques et suivez l&apos;activité de vos clients.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-500 bg-opacity-50 rounded-full text-sm">
                📊 Statistiques en temps réel
              </span>
              <span className="px-3 py-1 bg-purple-500 bg-opacity-50 rounded-full text-sm">
                🤖 Analyse IA intégrée
              </span>
              <span className="px-3 py-1 bg-indigo-500 bg-opacity-50 rounded-full text-sm">
                📈 Suivi des performances
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques du dashboard */}
        <DashboardStatistics />
      </div>
    </div>
  )
}

export default AdminHomePage