'use client'

import { useState } from 'react'
import { UserRole } from '@/app/generated/prisma'

interface User {
  id: number
  email: string
  name: string
  role: UserRole
  isActive: boolean
  registeredAt: Date
  clerkUserId: string | null
}

interface RoleManagementProps {
  initialUsers: User[]
}

export default function RoleManagement({ initialUsers }: RoleManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [loading, setLoading] = useState<number | null>(null)
  const [message, setMessage] = useState<string>('')

  const updateUserRole = async (userId: number, newRole: UserRole) => {
    setLoading(userId)
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-role',
          userId,
          newRole
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Mettre à jour l'état local
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ))
        setMessage(data.message)
        setTimeout(() => setMessage(''), 3000)
      } else {
        alert(`Erreur: ${data.error}`)
      }
    } catch (error) {
      console.error('Erreur mise à jour rôle:', error)
      alert('Erreur lors de la mise à jour du rôle')
    } finally {
      setLoading(null)
    }
  }

  const getRoleBadge = (role: UserRole) => {
    if (role === 'ADMIN') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          👑 Admin
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        🛍️ Client
      </span>
    )
  }

  return (
    <div>
      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle Actuel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? '✅ Actif' : '❌ Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.registeredAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {user.role === 'CLIENT' ? (
                      <button
                        onClick={() => updateUserRole(user.id, 'ADMIN')}
                        disabled={loading === user.id}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs disabled:opacity-50"
                      >
                        {loading === user.id ? '⏳' : '👑 Promouvoir Admin'}
                      </button>
                    ) : (
                      <button
                        onClick={() => updateUserRole(user.id, 'CLIENT')}
                        disabled={loading === user.id}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs disabled:opacity-50"
                      >
                        {loading === user.id ? '⏳' : '🛍️ Rétrograder Client'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  )
}
