'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  imageProduct: string | null
  createdAt: Date
}

interface ProductCardProps {
  product: Product
  isAdmin: boolean
}

export default function ProductCard({ product, isAdmin }: ProductCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Actualiser la page
        router.refresh()
      } else {
        const data = await response.json()
        alert(`Erreur lors de la suppression: ${data.error}`)
      }
    } catch (error) {
      alert('Erreur de connexion lors de la suppression')
      console.error('Erreur:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Fonction pour limiter la description à un nombre de caractères
  const truncateDescription = (text: string | null, maxLength: number = 100) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      {/* Image du produit */}
      <div className="relative h-48 bg-gray-100">
        {product.imageProduct ? (
          <Image
            src={product.imageProduct}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <span className="text-gray-500 text-sm">Pas d&apos;image</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenu de la carte */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-4" style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.4em',
            height: '2.8em' // 2 lignes × 1.4em
          }}>
            {truncateDescription(product.description, 100)}
          </p>
        )}

        <div className="mb-4">
          <div className="text-2xl font-bold text-blue-600">
            {product.price.toFixed(2)}€
          </div>
        </div>

        {/* Boutons en bas */}
        <div className="space-y-3">
          {/* Bouton Voir détails - toujours affiché en bas */}
          <Link 
            href={`/products/${product.id}`}
            className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-center"
          >
            👁️ Voir détails
          </Link>

          {/* Boutons admin */}
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-1">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ...
                  </span>
                ) : (
                  '🗑️ Supprimer'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Date d'ajout */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Ajouté le {new Date(product.createdAt).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>
    </div>
  )
}
