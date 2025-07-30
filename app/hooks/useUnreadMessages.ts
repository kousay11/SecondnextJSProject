'use client'

import { useState, useEffect } from 'react'

export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [])

  const refreshCount = async () => {
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
