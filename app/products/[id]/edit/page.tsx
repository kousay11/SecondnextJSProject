import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'
import Link from 'next/link'
import EditProductForm from './components/EditProductForm'

interface EditProductPageProps {
  params: { id: string }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // Vérifier que l'utilisateur est connecté et admin
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    redirect('/sign-in?redirect=/products')
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    select: { role: true, name: true }
  })

  if (!dbUser || dbUser.role !== 'ADMIN') {
    redirect('/products?error=access-denied')
  }

  // Récupérer le produit à modifier
  const productId = parseInt(params.id)
  
  if (isNaN(productId)) {
    redirect('/products?error=invalid-product-id')
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    redirect('/products?error=product-not-found')
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
            <li><Link href={`/products/${product.id}`} className="hover:text-blue-600">{product.name}</Link></li>
            <li>/</li>
            <li className="text-gray-800 font-medium">Modifier</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ✏️ Modifier le produit
            </h1>
            <p className="text-gray-600">
              Bonjour {dbUser.name}, modifiez les informations du produit &quot;{product.name}&quot;
            </p>
          </div>

          <EditProductForm product={product} />
        </div>
      </div>
    </div>
  )
}
