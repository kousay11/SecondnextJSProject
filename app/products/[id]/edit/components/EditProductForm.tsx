'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '../../../add/components/ImageUpload'

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  imageProduct: string | null
}

interface EditProductFormProps {
  product: Product
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    price: product.price.toString(),
    imageProduct: product.imageProduct || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Données à envoyer pour mise à jour:', {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        imageProduct: formData.imageProduct || null
      })

      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          price: parseFloat(formData.price),
          imageProduct: formData.imageProduct || null
        })
      })

      const data = await response.json()
      console.log('Réponse API:', data)

      if (response.ok) {
        router.push(`/products/${product.id}?updated=true`)
      } else {
        console.error('Erreur détaillée:', data)
        if (data.details && Array.isArray(data.details)) {
          // Erreur de validation Zod
          const errorMessages = data.details.map((detail: { path: string[]; message: string }) => 
            `${detail.path.join('.')}: ${detail.message}`
          ).join(', ')
          setError(`Validation: ${errorMessages}`)
        } else {
          setError(data.error || 'Erreur lors de la mise à jour du produit')
        }
      }
    } catch (error) {
      setError('Erreur de connexion')
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Fonction pour gérer l'upload d'image
  const handleImageUpload = (imageUrl: string) => {
    console.log('Image uploadée:', imageUrl)
    setFormData(prev => ({
      ...prev,
      imageProduct: imageUrl
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Nom du produit */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Nom du produit *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Ex: iPhone 15 Pro Max"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
          placeholder="Décrivez votre produit..."
        />
      </div>

      {/* Prix */}
      <div>
        <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
          Prix (€) *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          required
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Ex: 1299.99"
        />
      </div>

      {/* Upload d'image */}
      <ImageUpload 
        onImageUpload={handleImageUpload}
        currentImageUrl={formData.imageProduct}
      />

      {/* Boutons */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isLoading || !formData.name || !formData.price}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Modification...
            </span>
          ) : (
            '💾 Enregistrer les modifications'
          )}
        </button>
        
        <button
          type="button"
          onClick={() => router.push(`/products/${product.id}`)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
