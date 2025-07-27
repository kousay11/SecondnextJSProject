'use client'

import { useState } from 'react'

interface AdminPromotionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminPromotionModal({ isOpen, onClose }: AdminPromotionModalProps) {
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
        setTimeout(() => {
          onClose()
          setMessage('')
        }, 2000)
      } else {
        setMessage(`❌ Erreur: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            👑 Créer Compte Admin
          </h2>
          <p className="text-gray-600">
            Créez le premier compte administrateur
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Entrez le secret admin"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? '⏳ Création en cours...' : '👑 Créer Admin'}
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

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Informations:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Créez un compte utilisateur normal d&apos;abord</li>
            <li>• Puis utilisez cette fonction pour le promouvoir admin</li>
            <li>• Le secret se trouve dans votre fichier .env.local</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
