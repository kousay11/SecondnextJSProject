'use client'

import { useState } from 'react'

export default function PromoteFirstAdminPage() {
  const [email, setEmail] = useState('')
  const [secret, setSecret] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const promoteAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/promote-first', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          secret
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ Succès: ${data.message}`)
        setEmail('')
        setSecret('')
      } else {
        setMessage(`❌ Erreur: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            👑 Promouvoir Premier Admin
          </h1>
          <p className="text-gray-600">
            Utilisez cette page pour promouvoir le premier administrateur
          </p>
        </div>

        <form onSubmit={promoteAdmin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email de l&apos;utilisateur
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="utilisateur@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="secret" className="block text-sm font-medium text-gray-700 mb-2">
              Secret d&apos;administration
            </label>
            <input
              type="password"
              id="secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez le secret admin"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Promotion en cours...' : '👑 Promouvoir Admin'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Informations:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Cette page ne devrait être utilisée qu&apos;une seule fois</li>
            <li>• Le secret se trouve dans votre fichier .env.local</li>
            <li>• Une fois admin, vous pouvez gérer les rôles via /admin/roles</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
