'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SuccessMessage() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const created = searchParams.get('created')
    const updated = searchParams.get('updated')

    if (created === 'true') {
      setMessage('✅ Produit créé avec succès!')
      setIsVisible(true)
    } else if (updated === 'true') {
      setMessage('✅ Produit mis à jour avec succès!')
      setIsVisible(true)
    }

    if (isVisible) {
      // Masquer le message après 5 secondes
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams, isVisible])

  if (!isVisible || !message) return null

  return (
    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg animate-pulse">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-green-500 hover:text-green-700 ml-4"
        >
          ×
        </button>
      </div>
    </div>
  )
}
