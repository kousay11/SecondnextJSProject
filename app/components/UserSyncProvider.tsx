'use client'

import { useUserSync } from '@/app/hooks/useUserSync'
import { SignedIn } from '@clerk/nextjs'

export default function UserSyncProvider() {
  const { syncStatus } = useUserSync()

  // Optionnel: afficher un indicateur de synchronisation
  if (syncStatus === 'syncing') {
    return (
      <SignedIn>
        <div className="fixed top-20 right-4 bg-blue-500 text-white px-3 py-1 rounded-md text-sm animate-pulse z-50">
          Synchronisation...
        </div>
      </SignedIn>
    )
  }

  return null
}
