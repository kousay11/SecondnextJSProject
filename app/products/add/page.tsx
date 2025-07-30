import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'
import Link from 'next/link'
import AddProductForm from './components/AddProductForm'

export default async function AddProductPage() {
  // Vérifier que l'utilisateur est connecté et admin
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    redirect('/sign-in?redirect=/products/add')
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    select: { role: true, name: true }
  })

  if (!dbUser || dbUser.role !== 'ADMIN') {
    redirect('/products?error=access-denied')
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
            <li className="text-gray-800 font-medium">Ajouter un produit</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ➕ Ajouter un nouveau produit
            </h1>
            <p className="text-gray-600">
              Bonjour {dbUser.name}, ajoutez un nouveau produit à votre catalogue
            </p>
          </div>

          <AddProductForm />
        </div>
      </div>
    </div>
  )
}
