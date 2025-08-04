"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MessageAnalysis {
  id: number;
  message: string;
  sentiment: string;
  suggestion: string;
}

export default function MessagesTable() {
  const [data, setData] = useState<MessageAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/messages/ai-analyze")
      .then((res) => res.json())
      .then((res) => setData(res.results || []))
      .finally(() => setLoading(false));
  }, []);

  const handleApplySuggestion = (messageId: number, suggestion: string) => {
    // Stocker la suggestion dans le localStorage pour la récupérer sur la page des messages
    localStorage.setItem(`suggestion_${messageId}`, suggestion);
    localStorage.setItem('shouldOpenMessages', 'true');
    console.log('MessagesTable - Applying suggestion for message:', messageId); // Debug
    
    // Rediriger vers la page des messages avec l'ID du message
    const targetUrl = `/admin/messages?messageId=${messageId}&action=reply`;
    
    // Utiliser router.push avec un délai pour s'assurer que les données localStorage sont écrites
    setTimeout(() => {
      router.push(targetUrl);
    }, 100);
  };

  const handleRejectSuggestion = async (messageId: number) => {
    setRegeneratingId(messageId);
    try {
      const response = await fetch('/api/messages/ai-analyze/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId })
      });

      if (response.ok) {
        const newSuggestion = await response.json();
        // Mettre à jour la suggestion dans les données
        setData(prev => prev.map(item => 
          item.id === messageId 
            ? { ...item, suggestion: newSuggestion.suggestion, sentiment: newSuggestion.sentiment }
            : item
        ));
      } else {
        console.error('Erreur lors de la régénération');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setRegeneratingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg">Analyse IA en cours...</span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-3xl font-bold">📋 Messages et Suggestions IA</h2>
          <p className="text-blue-100 mt-2">
            Analyse IA des messages ouverts
          </p>
        </div>
        
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <div className="text-gray-600 text-xl font-semibold mb-2">
            Tous les messages sont fermés
          </div>
          <div className="text-gray-500 text-sm max-w-md mx-auto">
            Les suggestions IA ne sont affichées que pour les messages avec le statut PENDING ou PROCESSED. 
            Tous les messages actuels ont le statut CLOSED.
          </div>
        </div>
      </div>
    );
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "POSITIVE":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            😊 Positif
          </span>
        );
      case "NEGATIVE":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            😞 Négatif
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            😐 Neutre
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h2 className="text-3xl font-bold">📋 Messages et Suggestions IA</h2>
        <p className="text-blue-100 mt-2">
          {data.length} messages ouverts analysés avec suggestions de réponse
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sentiment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Suggestion IA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((message, index) => (
              <tr 
                key={message.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-25"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{message.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="truncate" title={message.message}>
                    {message.message.length > 100 
                      ? `${message.message.substring(0, 100)}...` 
                      : message.message
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getSentimentBadge(message.sentiment)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-blue-400">🤖</span>
                      </div>
                      <div className="ml-2 text-sm">
                        {message.suggestion || "Aucune suggestion disponible"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApplySuggestion(message.id, message.suggestion)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center"
                      title="Appliquer cette suggestion"
                    >
                      ✅ Apply
                    </button>
                    <button
                      onClick={() => handleRejectSuggestion(message.id)}
                      disabled={regeneratingId === message.id}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center"
                      title="Générer une nouvelle suggestion"
                    >
                      {regeneratingId === message.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-1 border-white mr-1"></div>
                          ...
                        </>
                      ) : (
                        <>🔄 Reject</>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer avec stats */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Total: {data.length} messages ouverts
          </div>
          <div className="flex space-x-4">
            <span className="text-green-600">
              ✅ {data.filter(m => m.sentiment === "POSITIVE").length} positifs
            </span>
            <span className="text-red-600">
              ❌ {data.filter(m => m.sentiment === "NEGATIVE").length} négatifs
            </span>
            <span className="text-gray-600">
              ⚪ {data.filter(m => !["POSITIVE", "NEGATIVE"].includes(m.sentiment)).length} neutres
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
