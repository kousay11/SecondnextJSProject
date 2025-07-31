'use client'

import { useUserRole } from './useUserRole'
import { useState, useEffect } from 'react'

export function useUnreadMessages() {
  const { role, loading: roleLoading } = useUserRole()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (roleLoading) return
    if (role !== 'ADMIN') {
      setIsLoading(false)
      setUnreadCount(0)
      return
    }
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/messages/count')
        if (response.ok) {
          const data = await response.json()
          setUnreadCount(data.count)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de messages non lus:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [role, roleLoading])

  const refreshCount = async () => {
    if (role !== 'ADMIN') return
    try {
      const response = await fetch('/api/messages/count')
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count)
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error)
    }
  }

  return { unreadCount, isLoading, refreshCount }
}
