'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export type UserRole = 'ADMIN' | 'CLIENT' | null

export function useUserRole() {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserRole() {
      if (!isLoaded || !user) {
        setLoading(false)
        return
      }

      try {
        // Récupérer le rôle de l'utilisateur depuis notre API
        const response = await fetch('/api/user/role')
        if (response.ok) {
          const data = await response.json()
          setRole(data.role)
        }
      } catch (error) {
        console.error('Erreur récupération rôle:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user, isLoaded])

  return { role, loading, isLoaded }
}
