import { prisma } from '@/prisma/client';

export default async function UsersListPage() {
  // Get all users from database
  const allUsers = await prisma.user.findMany({
    orderBy: { registeredAt: 'desc' }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Liste des Utilisateurs Synchronisés</h1>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          Utilisateurs en Base de Données ({allUsers.length})
        </h2>
        <p className="text-sm text-blue-600">
          Cette liste se met à jour automatiquement quand un utilisateur s&apos;inscrit via Clerk
        </p>
      </div>

      <div className="space-y-3">
        {allUsers.length === 0 ? (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800">
              Aucun utilisateur synchronisé pour le moment. 
              Inscrivez-vous via <a href="/sign-up" className="underline">Sign Up</a> pour tester !
            </p>
          </div>
        ) : (
          allUsers.map((user) => (
            <div key={user.id} className="p-4 bg-white rounded-lg border shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Inscrit le : {user.registeredAt.toLocaleDateString('fr-FR')} à {user.registeredAt.toLocaleTimeString('fr-FR')}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>ID DB: {user.id}</p>
                  <p>Clerk ID: {user.clerkUserId?.substring(0, 8)}...</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">🔄 Comment ça marche :</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Quand un utilisateur s&apos;inscrit via Clerk</li>
          <li>• Le webhook envoie automatiquement les données à votre API</li>
          <li>• L&apos;utilisateur est immédiatement ajouté à la base de données</li>
          <li>• Rafraîchissez cette page pour voir les nouveaux utilisateurs</li>
        </ul>
      </div>
    </div>
  );
}
