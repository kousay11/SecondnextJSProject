'use client'

import { useState, useEffect } from 'react'

interface UserInfo {
  user: {
    id: string
    email: string
    name: string
  }
  role: string
  hasAdminAccess: boolean
}

export default function UserRoleDiagnostic() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await fetch('/api/user/role')
        
        if (response.ok) {
          const data = await response.json()
          setUserInfo(data)
        } else {
          const errorData = await response.json()
          setError(`Erreur API: ${errorData.error}`)
        }
      } catch {
        setError('Erreur de connexion')
      } finally {
        setIsLoading(false)
      }
    }

    checkUserRole()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Vérification du rôle utilisateur...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            👤 Diagnostic Utilisateur
          </h1>

          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <h3 className="font-bold">Erreur</h3>
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <h3 className="font-bold mb-2">Informations utilisateur :</h3>
                <pre className="text-sm bg-white p-3 rounded border">
                  {JSON.stringify(userInfo, null, 2)}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Rôle</h4>
                  <p className="text-blue-700">
                    {userInfo?.role || 'Non défini'}
                    {userInfo?.role === 'ADMIN' ? ' ✅' : ' ❌'}
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Statut Admin</h4>
                  <p className="text-purple-700">
                    {userInfo?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur standard'}
                  </p>
                </div>
              </div>

              {userInfo?.role !== 'ADMIN' && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                  <h4 className="font-bold">⚠️ Attention</h4>
                  <p>Vous n&apos;avez pas les droits administrateur. Le bouton &quot;Ajouter un produit&quot; ne sera pas visible.</p>
                  <p className="mt-2">Pour devenir admin, rendez-vous sur <strong>/admin/promote</strong></p>
                </div>
              )}

              {userInfo?.role === 'ADMIN' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  <h4 className="font-bold">✅ Parfait</h4>
                  <p>Vous avez les droits administrateur. Vous devriez voir le bouton &quot;Ajouter un produit&quot; sur la page /products.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
