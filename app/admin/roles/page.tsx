import { isAdmin, getAllUsersWithRoles } from '@/app/lib/role-manager'
import { redirect } from 'next/navigation'
import RoleManagement from '../../components/RoleManagement'

export default async function AdminRolesPage() {
  // Vérifier que l'utilisateur est admin
  const userIsAdmin = await isAdmin()
  
  if (!userIsAdmin) {
    redirect('/dashboard?error=access-denied')
  }

  const users = await getAllUsersWithRoles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              � Utilisateurs
            </h1>
            <p className="text-gray-600">
              Gestion des utilisateurs et de leurs rôles
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">👥 Total Utilisateurs</h3>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">👑 Admins</h3>
              <p className="text-3xl font-bold">{users.filter(u => u.role === 'ADMIN').length}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">🛍️ Clients</h3>
              <p className="text-3xl font-bold">{users.filter(u => u.role === 'CLIENT').length}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">✅ Actifs</h3>
              <p className="text-3xl font-bold">{users.filter(u => u.isActive).length}</p>
            </div>
          </div>

          <RoleManagement initialUsers={users} />
        </div>
      </div>
    </div>
  )
}
