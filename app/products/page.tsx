import { prisma } from '@/prisma/client'
import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'
import ProductCard from './components/ProductCard'

export default async function ProductsPage() {
  // Récupérer l'utilisateur connecté
  const clerkUser = await currentUser()
  let userRole = null
  
  if (clerkUser) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      select: { role: true }
    })
    userRole = dbUser?.role
  }

  // Récupérer tous les produits depuis la base de données
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                📚 Nos Produits
              </h1>
              <p className="text-gray-600">
                Découvrez notre gamme complète de produits
              </p>
            </div>
            
            {/* Bouton admin pour ajouter un produit */}
            {userRole === 'ADMIN' && (
              <div className="flex-shrink-0 ml-8">
                <Link
                  href="/products/add"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <span className="text-xl">➕</span>
                  Ajouter un produit
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white text-center">
              <h3 className="text-lg font-semibold mb-2">📦 Total Produits</h3>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white text-center">
              <h3 className="text-lg font-semibold mb-2">💰 Prix Moyen</h3>
              <p className="text-3xl font-bold">
                {products.length > 0 
                  ? `${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0)}€`
                  : '0€'
                }
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white text-center">
              <h3 className="text-lg font-semibold mb-2">⭐ Disponibles</h3>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun produit disponible</h2>
            <p className="text-gray-600">
              Les produits seront bientôt ajoutés à notre catalogue
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isAdmin={userRole === 'ADMIN'} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
