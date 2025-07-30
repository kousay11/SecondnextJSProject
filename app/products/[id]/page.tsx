import { prisma } from '@/prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import SuccessMessage from './components/SuccessMessage'

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = parseInt(params.id)
  
  if (isNaN(productId)) {
    notFound()
  }

  // Récupérer l'utilisateur connecté pour vérifier le rôle
  const clerkUser = await currentUser()
  let userRole = null
  
  if (clerkUser) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      select: { role: true }
    })
    userRole = dbUser?.role
  }

  // Récupérer le produit par ID
  const product = await prisma.product.findUnique({
    where: {
      id: productId
    }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Accueil</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-blue-600">Produits</Link></li>
            <li>/</li>
            <li className="text-gray-800 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Message de succès */}
        <SuccessMessage />

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image du produit */}
            <div className="space-y-4">
              <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
                {product.imageProduct ? (
                  <Image
                    src={product.imageProduct}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📦</div>
                      <span className="text-gray-500">Pas d&apos;image disponible</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informations du produit */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>
                <div className="text-4xl font-bold text-blue-600">
                  {product.price.toFixed(2)}€
                </div>
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Informations supplémentaires */}
              <div className="space-y-4">
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Informations</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">ID Produit:</span>
                      <span className="ml-2 font-medium">#{product.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ajouté le:</span>
                      <span className="ml-2 font-medium">
                        {product.createdAt.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {product.updatedAt && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Dernière mise à jour:</span>
                        <span className="ml-2 font-medium">
                          {product.updatedAt.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-4">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  🛒 Ajouter au panier
                </button>

                {/* Bouton modifier pour les admins */}
                {userRole === 'ADMIN' && (
                  <Link 
                    href={`/products/${product.id}/edit`}
                    className="block w-full text-center bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
                  >
                    ✏️ Modifier ce produit
                  </Link>
                )}
                
                <Link 
                  href="/products"
                  className="block w-full text-center bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  ← Retour aux produits
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires ou recommandations */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Autres produits</h2>
          <RecommendedProducts currentProductId={product.id} />
        </div>
      </div>
    </div>
  )
}

// Composant pour afficher des produits recommandés
async function RecommendedProducts({ currentProductId }: { currentProductId: number }) {
  const products = await prisma.product.findMany({
    where: {
      id: {
        not: currentProductId
      }
    },
    take: 3,
    orderBy: {
      createdAt: 'desc'
    }
  })

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun autre produit disponible pour le moment
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="relative h-32 bg-gray-100">
            {product.imageProduct ? (
              <Image
                src={product.imageProduct}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-2xl">📦</div>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
              {product.name}
            </h3>
            <div className="text-blue-600 font-bold">
              {product.price.toFixed(2)}€
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
