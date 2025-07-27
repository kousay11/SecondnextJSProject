'use client'

const DebugPage = () => {
  const handleDebug = async () => {
    try {
      const response = await fetch(`/api/debug-users?action=debug&email=kousay.najar147@gmail.com`)
      const data = await response.json()
      console.log('🔍 Debug result:', data)
      alert(JSON.stringify(data, null, 2))
    } catch (err) {
      console.error('Debug error:', err)
      alert('Erreur lors du debug')
    }
  }

  const handleClean = async () => {
    try {
      const response = await fetch('/api/debug-users?action=clean')
      const data = await response.json()
      console.log('🧹 Clean result:', data)
      alert(JSON.stringify(data, null, 2))
    } catch (err) {
      console.error('Clean error:', err)
      alert('Erreur lors du nettoyage')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🔧 Debug Utilisateurs</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions de Debug</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleDebug}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              🔍 Debug Email kousay.najar147@gmail.com
            </button>
            
            <button
              onClick={handleClean}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
            >
              🧹 Nettoyer Utilisateurs Orphelins
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">� Instructions pour résoudre le problème</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Cliquez sur Debug Email pour voir si utilisateur existe en base</li>
            <li>Si des utilisateurs orphelins existent, cliquez sur Nettoyer</li>
            <li>Allez sur <a href="https://dashboard.clerk.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Clerk Dashboard</a></li>
            <li>Supprimez utilisateur kousay.najar147@gmail.com si il existe</li>
            <li>Utilisez un <strong>mot de passe différent et sécurisé</strong> (pas de mots de passe compromis)</li>
            <li>Essayez de vous réinscrire</li>
          </ol>
          
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
            <h4 className="font-bold text-yellow-800">⚠️ Problème détecté :</h4>
            <ul className="mt-2 text-yellow-700">
              <li>• Email déjà pris dans Clerk (même si pas en base locale)</li>
              <li>• Mot de passe compromis détecté par Clerk</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DebugPage
