import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'
import Link from 'next/link'

export default async function AdminCheckPage() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Non connecté</h1>
          <p className="mb-4">Vous devez être connecté pour accéder à cette page.</p>
          <Link href="/sign-in" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    select: { 
      id: true,
      email: true,
      name: true,
      role: true,
      registeredAt: true
    }
  })

  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      registeredAt: true
    },
    orderBy: {
      registeredAt: 'asc'
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🔍 Vérification Admin</h1>
        
        {/* Informations utilisateur actuel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">👤 Votre Profil</h2>
          <div className="space-y-2">
            <p><strong>Clerk ID:</strong> {clerkUser.id}</p>
            <p><strong>Email Clerk:</strong> {clerkUser.emailAddresses[0]?.emailAddress}</p>
            {dbUser ? (
              <>
                <p><strong>ID Base:</strong> {dbUser.id}</p>
                <p><strong>Nom:</strong> {dbUser.name}</p>
                <p><strong>Email Base:</strong> {dbUser.email}</p>
                <p><strong>Rôle:</strong> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    dbUser.role === 'ADMIN' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {dbUser.role}
                  </span>
                </p>
                <p><strong>Inscription:</strong> {new Date(dbUser.registeredAt).toLocaleString()}</p>
              </>
            ) : (
              <p className="text-red-600 font-semibold">❌ Utilisateur non trouvé dans la base de données</p>
            )}
          </div>
        </div>

        {/* Actions Admin */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">⚡ Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/products" 
                  className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 text-center transition-colors">
              📚 Voir Produits
            </Link>
            
            {dbUser?.role === 'ADMIN' ? (
              <>
                <Link href="/products/add" 
                      className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 text-center transition-colors">
                  ➕ Ajouter Produit
                </Link>
                <Link href="/admin/messages" 
                      className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 text-center transition-colors">
                  💬 Gérer Messages
                </Link>
              </>
            ) : (
              <Link href="/admin/promote-first" 
                    className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 text-center transition-colors">
                👑 Devenir Admin
              </Link>
            )}
          </div>
        </div>

        {/* Secret d'administration */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">🔐 Secret d&apos;Administration</h3>
          <p className="text-yellow-700 mb-2">
            Pour devenir admin, utilisez ce secret : 
            <code className="bg-yellow-200 px-2 py-1 rounded ml-2 font-mono">super-secret-admin-key-2025</code>
          </p>
          <p className="text-sm text-yellow-600">
            Allez sur la page de promotion et entrez votre email + ce secret.
          </p>
        </div>

        {/* Liste de tous les utilisateurs */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">👥 Tous les Utilisateurs ({allUsers.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Nom</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Rôle</th>
                  <th className="px-4 py-2 text-left">Inscription</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'ADMIN' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {new Date(user.registeredAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
