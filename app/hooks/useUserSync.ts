'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export function useUserSync() {
  const { user, isLoaded } = useUser()
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')

  useEffect(() => {
    async function syncUser() {
      if (!isLoaded || !user || syncStatus !== 'idle') return

      setSyncStatus('syncing')
      
      try {
        const response = await fetch('/api/sync-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Utilisateur synchronisé:', data)
          setSyncStatus('success')
        } else {
          console.error('❌ Erreur sync utilisateur:', response.status)
          setSyncStatus('error')
        }
      } catch (error) {
        console.error('❌ Erreur réseau sync:', error)
        setSyncStatus('error')
      }
    }

    syncUser()
  }, [user, isLoaded, syncStatus])

  return { syncStatus, isLoaded, user }
}
