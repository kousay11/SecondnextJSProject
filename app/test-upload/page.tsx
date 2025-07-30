'use client'

import { useState } from 'react'

export default function TestUploadPage() {
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testProductCreation = async () => {
    setIsLoading(true)
    setResult('')

    try {
      const testData = {
        name: `Produit Test ${Date.now()}`,
        description: "Description de test",
        price: 19.99,
        imageProduct: "/uploads/products/product-1753799492934.jpg" // Image existante
      }

      console.log('Envoi des données:', testData)

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`✅ Succès! Produit créé: ${JSON.stringify(data, null, 2)}`)
      } else {
        setResult(`❌ Erreur: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setResult(`❌ Erreur réseau: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testImageUpload = async () => {
    setIsLoading(true)
    setResult('')

    try {
      // Créer un fichier de test (pixel transparent)
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(0, 0, 100, 100)

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setResult('❌ Impossible de créer l\'image de test')
          setIsLoading(false)
          return
        }

        const formData = new FormData()
        formData.append('file', blob, 'test-image.png')

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        })

        const data = await response.json()

        if (response.ok) {
          setResult(`✅ Upload réussi! URL: ${data.imageUrl}`)
        } else {
          setResult(`❌ Erreur upload: ${JSON.stringify(data, null, 2)}`)
        }
        setIsLoading(false)
      }, 'image/png')
    } catch (error) {
      setResult(`❌ Erreur upload: ${error}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">🧪 Test Upload et Création Produit</h1>
      
      <div className="space-y-4">
        <button
          onClick={testImageUpload}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Test en cours...' : '📤 Tester l\'upload d\'image'}
        </button>

        <button
          onClick={testProductCreation}
          disabled={isLoading}
          className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? 'Test en cours...' : '🛍️ Tester la création de produit'}
        </button>
      </div>

      {result && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Résultat:</h3>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  )
}
