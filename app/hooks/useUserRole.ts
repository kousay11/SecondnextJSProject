'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export type UserRole = 'ADMIN' | 'CLIENT' | null

export function useUserRole() {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return
    if (!user) {
      setRole(null) // ou 'CLIENT' si tu veux afficher Contact pour tous les non-admins
      setLoading(false)
      return
    }
    async function fetchUserRole() {
      try {
        const response = await fetch('/api/user/role', { cache: 'no-store' })
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
