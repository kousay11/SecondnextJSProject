'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  currentImageUrl?: string
}

export default function ImageUpload({ onImageUpload, currentImageUrl }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier côté client
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Type de fichier non supporté. Utilisez: JPG, PNG, WebP')
      return
    }

    // Vérifier la taille côté client
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setUploadError('Fichier trop volumineux. Taille maximum: 5MB')
      return
    }

    setIsUploading(true)
    setUploadError('')

    try {
      // Créer un aperçu local immédiatement
      const localPreview = URL.createObjectURL(file)
      setPreviewUrl(localPreview)

      // Préparer FormData pour l'upload
      const formData = new FormData()
      formData.append('file', file)

      // Envoyer à l'API
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewUrl(data.imageUrl)
        onImageUpload(data.imageUrl)
        
        // Nettoyer l'URL locale
        URL.revokeObjectURL(localPreview)
      } else {
        const errorData = await response.json()
        setUploadError(errorData.error || 'Erreur lors de l\'upload')
        setPreviewUrl('')
      }
    } catch (error) {
      setUploadError('Erreur de connexion lors de l\'upload')
      setPreviewUrl('')
      console.error('Erreur upload:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl('')
    onImageUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile && fileInputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(imageFile)
      fileInputRef.current.files = dt.files
      
      // Déclencher l'événement change
      const event = new Event('change', { bubbles: true })
      fileInputRef.current.dispatchEvent(event)
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Image du produit
      </label>

      {/* Zone d'upload */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isUploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-blue-600 font-medium">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-gray-600 mb-1">
              <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                Cliquez pour sélectionner
              </span>{' '}
              ou glissez-déposez une image
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WebP jusqu&apos;à 5MB</p>
          </div>
        )}
      </div>

      {/* Erreur d'upload */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {uploadError}
        </div>
      )}

      {/* Aperçu de l'image */}
      {previewUrl && (
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Aperçu
          </label>
          <div className="relative h-48 w-48 border border-gray-300 rounded-lg overflow-hidden">
            <Image
              src={previewUrl}
              alt="Aperçu du produit"
              fill
              className="object-cover"
              onError={() => {
                setPreviewUrl('')
                setUploadError('Erreur de chargement de l\'image')
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
