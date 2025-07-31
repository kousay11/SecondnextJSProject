'use client'

import { useState } from 'react'

interface DiagnosticResult {
  success: boolean
  apiTest?: string
  seedTest?: string
  tableTest?: string
  diagnostics?: {
    prismaConnection: string
    messageCount: number
    userCount: number
    users: Array<{
      id: number
      email: string
      name: string
      role: string
      clerkUserId: string | null
    }>
    messages: Array<{
      id: number
      phone: string
      subject: string
      message: string
      status: string
      createdAt: string
      user: {
        name: string
        email: string
      }
    }>
    messagesWithUser: number
  }
  data?: unknown
  message?: string
  createdMessages?: unknown[]
}

export default function MessageDiagnosticPage() {
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const runDiagnostic = async () => {
    setIsLoading(true)
    setError('')
    setDiagnosticResult(null)

    try {
      const response = await fetch('/api/diagnostic/messages')
      const data = await response.json()
      
      if (response.ok) {
        setDiagnosticResult(data)
      } else {
        setError(`Erreur: ${data.error}`)
      }
    } catch (err) {
      setError(`Erreur de connexion: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testMessagesAPI = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/messages')
      const data = await response.json()
      
      if (response.ok) {
        setDiagnosticResult({
          success: true,
          apiTest: 'Messages API OK',
          data
        })
      } else {
        setError(`Erreur API Messages: ${data.error}`)
      }
    } catch (err) {
      setError(`Erreur connexion API Messages: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const createTestMessages = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/diagnostic/seed-messages', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (response.ok) {
        setDiagnosticResult({
          success: true,
          seedTest: 'Messages de test créés',
          data
        })
      } else {
        setError(`Erreur création messages test: ${data.error}`)
      }
    } catch (err) {
      setError(`Erreur: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testTableStructure = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/diagnostic/table-structure')
      const data = await response.json()
      
      if (response.ok) {
        setDiagnosticResult({
          success: true,
          tableTest: 'Structure de table testée',
          data
        })
      } else {
        setError(`Erreur test structure: ${data.error}`)
      }
    } catch (err) {
      setError(`Erreur: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🔍 Diagnostic Messages</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🧪 Tests Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={runDiagnostic}
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? '🔄 Test en cours...' : '🔍 Diagnostic Complet'}
            </button>
            
            <button
              onClick={testTableStructure}
              disabled={isLoading}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ? '🔄 Test en cours...' : '🗃️ Test Structure Table'}
            </button>
            
            <button
              onClick={testMessagesAPI}
              disabled={isLoading}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50"
            >
              {isLoading ? '🔄 Test en cours...' : '📨 Test API Messages'}
            </button>
            
            <button
              onClick={createTestMessages}
              disabled={isLoading}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? '🔄 Création...' : '🌱 Créer Messages Test'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <h3 className="font-bold">❌ Erreur</h3>
            <p>{error}</p>
          </div>
        )}

        {diagnosticResult && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">📊 Résultats</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(diagnosticResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
