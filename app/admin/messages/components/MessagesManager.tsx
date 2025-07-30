'use client'

import { useState, useEffect } from 'react'
import { useUnreadMessages } from '@/app/hooks/useUnreadMessages'

interface User {
  name: string
  email: string
}

interface Message {
  id: number
  phone: string
  subject: string
  message: string
  status: 'PENDING' | 'PROCESSED' | 'CLOSED'
  createdAt: string
  processedAt: string | null
  user: User
}

const subjectLabels: Record<string, string> = {
  'GENERAL_INQUIRY': 'Demande générale',
  'TECHNICAL_SUPPORT': 'Support technique',
  'BILLING_QUESTION': 'Question de facturation',
  'PRODUCT_QUESTION': 'Question sur un produit',
  'COMPLAINT': 'Réclamation',
  'SUGGESTION': 'Suggestion',
  'OTHER': 'Autre'
}

const statusLabels: Record<string, string> = {
  'PENDING': 'En attente',
  'PROCESSED': 'Traité',
  'CLOSED': 'Fermé'
}

const statusColors: Record<string, string> = {
  'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'PROCESSED': 'bg-blue-100 text-blue-800 border-blue-200',
  'CLOSED': 'bg-green-100 text-green-800 border-green-200'
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PROCESSED' | 'CLOSED'>('ALL')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const { refreshCount } = useUnreadMessages()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true)
        setError('')
        
        const response = await fetch('/api/messages')
        
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        } else {
          const errorData = await response.json()
          setError(`Erreur API: ${errorData.error || 'Erreur inconnue'}`)
        }
      } catch {
        setError('Erreur de connexion')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, []) // Pas de dépendance pour éviter les boucles infinies

  const updateMessageStatus = async (messageId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Mettre à jour le message dans la liste
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, status: newStatus as Message['status'], processedAt: newStatus !== 'PENDING' ? new Date().toISOString() : null }
              : msg
          )
        )
        // Rafraîchir le compteur après mise à jour
        refreshCount()
      } else {
        setError('Erreur lors de la mise à jour du statut')
      }
    } catch (error) {
      setError('Erreur de connexion')
      console.error('Erreur:', error)
    }
  }

  const filteredMessages = messages.filter(message => {
    if (filter === 'ALL') return true
    return message.status === filter
  })

  const getMessageCounts = () => {
    return {
      total: messages.length,
      pending: messages.filter(m => m.status === 'PENDING').length,
      processed: messages.filter(m => m.status === 'PROCESSED').length,
      closed: messages.filter(m => m.status === 'CLOSED').length
    }
  }

  const counts = getMessageCounts()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Chargement des messages...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">📨 Total</h3>
          <p className="text-3xl font-bold text-blue-600">{counts.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">⏳ En attente</h3>
          <p className="text-3xl font-bold text-yellow-600">{counts.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🔄 Traités</h3>
          <p className="text-3xl font-bold text-blue-600">{counts.processed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">✅ Fermés</h3>
          <p className="text-3xl font-bold text-green-600">{counts.closed}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtrer par statut :</h3>
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'PENDING', 'PROCESSED', 'CLOSED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'ALL' ? 'Tous' : statusLabels[status]}
              {status !== 'ALL' && (
                <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                  {counts[status.toLowerCase() as keyof typeof counts]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des messages */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Messages ({filteredMessages.length})
          </h3>
        </div>
        
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📪</div>
            <p>Aucun message trouvé pour ce filtre</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{message.user.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[message.status]}`}>
                        {statusLabels[message.status]}
                      </span>
                      <span className="text-sm text-gray-500">
                        📋 {subjectLabels[message.subject]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📧 {message.user.email}</p>
                      <p>📱 {message.phone}</p>
                      <p>📅 {new Date(message.createdAt).toLocaleString('fr-FR')}</p>
                      {message.processedAt && (
                        <p>✅ Traité le {new Date(message.processedAt).toLocaleString('fr-FR')}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      {selectedMessage?.id === message.id ? 'Masquer' : 'Voir détails'}
                    </button>
                    
                    {message.status === 'PENDING' && (
                      <button
                        onClick={() => updateMessageStatus(message.id, 'PROCESSED')}
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        Marquer traité
                      </button>
                    )}
                    
                    {message.status === 'PROCESSED' && (
                      <button
                        onClick={() => updateMessageStatus(message.id, 'CLOSED')}
                        className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                      >
                        Fermer
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Détails du message */}
                {selectedMessage?.id === message.id && (
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h5 className="font-semibold text-gray-800 mb-2">Message complet :</h5>
                    <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
