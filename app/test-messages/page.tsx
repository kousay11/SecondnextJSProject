'use client'

import { useState, useEffect } from 'react'

export default function TestMessages() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Tentative de récupération des messages...')
        setIsLoading(true)
        const response = await fetch('/api/messages')
        
        console.log('Réponse status:', response.status)
        console.log('Réponse OK:', response.ok)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Données reçues:', data)
          setMessages(data)
        } else {
          const errorData = await response.json()
          console.error('Erreur API:', errorData)
          setError(`Erreur API: ${errorData.error || 'Erreur inconnue'}`)
        }
      } catch (error) {
        console.error('Erreur de connexion:', error)
        setError('Erreur de connexion')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Chargement des messages...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <h3 className="font-bold">Erreur</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📧 Test Messages - Debug
          </h1>
          <p className="text-gray-600">
            Messages récupérés: {messages.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Données brutes:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(messages, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
