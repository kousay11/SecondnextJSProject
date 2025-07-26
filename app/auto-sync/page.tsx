import { prisma } from '@/prisma/client';

export default async function AutoSyncUsersPage() {
  // Récupérer tous les utilisateurs ajoutés automatiquement par webhook
  const allUsers = await prisma.user.findMany({
    orderBy: { registeredAt: 'desc' }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">👥 Utilisateurs Auto-Synchronisés</h1>
      
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          ✅ Synchronisation Automatique Active
        </h2>
        <p className="text-green-700 mb-2">
          Les utilisateurs sont automatiquement ajoutés lors de l&apos;inscription Clerk
        </p>
        <div className="text-sm text-green-600">
          <p>📊 Total utilisateurs : <strong>{allUsers.length}</strong></p>
          <p>🔄 Dernière mise à jour : {new Date().toLocaleString('fr-FR')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {allUsers.length === 0 ? (
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              🚀 Prêt pour le test !
            </h3>
            <p className="text-blue-700 mb-4">
              Aucun utilisateur trouvé. Testez la synchronisation automatique :
            </p>
            <div className="space-x-4">
              <a 
                href="/sign-up" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                📝 S&apos;inscrire
              </a>
              <button 
                onClick={() => window.location.reload()} 
                className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                🔄 Actualiser
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {allUsers.map((user, index) => (
                <div key={user.id} className="p-4 bg-white rounded-lg border shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">👤</span>
                        <h3 className="font-semibold text-gray-800 text-lg">{user.name}</h3>
                        {index === 0 && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-1">📧 {user.email}</p>
                      <p className="text-sm text-gray-500">
                        🕒 Inscrit le {user.registeredAt.toLocaleDateString('fr-FR')} à {user.registeredAt.toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p className="mb-1">🆔 DB: {user.id}</p>
                      <p className="mb-2">🔑 Clerk: {user.clerkUserId?.substring(0, 8)}...</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? '✅ Actif' : '❌ Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 text-gray-800">🔄 Comment ça fonctionne :</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="space-y-2">
                  <p>1. 📝 Utilisateur s&apos;inscrit via Clerk</p>
                  <p>2. 🔗 Clerk envoie un webhook à votre API</p>
                </div>
                <div className="space-y-2">
                  <p>3. 💾 API ajoute automatiquement en base</p>
                  <p>4. ✅ Synchronisation terminée !</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
