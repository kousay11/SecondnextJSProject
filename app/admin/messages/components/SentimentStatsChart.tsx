"use client";
import { useEffect, useState } from "react";

interface SentimentStats {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  byStatus: {
    [key: string]: {
      total: number;
      positive: number;
      negative: number;
      neutral: number;
    };
  };
}

interface APIResponse {
  stats: SentimentStats;
  results: Array<{
    id: number;
    sentiment: string;
    status: string;
  }>;
  aiEnabled?: boolean;
  message?: string;
  error?: string;
}

export default function SentimentStatsChart() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Essayer d'abord l'API normale, puis le fallback
    fetch("/api/messages/sentiment-stats")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((apiData) => {
        console.log("API Response:", apiData);
        setData(apiData);
      })
      .catch((firstError) => {
        console.log("API principale échouée, essai fallback:", firstError);
        // Essayer l'API de fallback
        return fetch("/api/messages/sentiment-stats-fallback")
          .then((res) => res.json())
          .then((fallbackData) => {
            console.log("Fallback Response:", fallbackData);
            setData(fallbackData);
          });
      })
      .catch((finalError) => {
        console.error("Toutes les APIs ont échoué:", finalError);
        setError(finalError.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Analyse des sentiments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Analyse des Sentiments</h3>
        <div className="text-center py-8 text-red-500">
          <div className="text-4xl mb-2">❌</div>
          <p>Erreur: {error}</p>
          <button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Analyse des Sentiments</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">⚠️</div>
          <p>Erreur lors du chargement des statistiques</p>
        </div>
      </div>
    );
  }

  if (stats.total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Analyse des Sentiments</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>Aucun message à analyser</p>
        </div>
      </div>
    );
  }

  const getPercentage = (value: number) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Titre de la section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Statistiques & Analyse IA</h1>
        <p className="text-gray-600">Analyse des sentiments et statistiques détaillées de tous les messages</p>
      </div>

      {/* Contenu principal */}
      <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Analyse des Sentiments</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{stats.total} messages analysés</p>
          {data?.aiEnabled === false && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              ⚠️ Mode de base - IA non disponible
            </span>
          )}
          {data?.aiEnabled === true && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              🤖 Analyse IA active
            </span>
          )}
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.positive}</div>
          <div className="text-sm text-gray-600">😊 Positifs</div>
          <div className="text-xs text-gray-500">{getPercentage(stats.positive)}%</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
          <div className="text-sm text-gray-600">😞 Négatifs</div>
          <div className="text-xs text-gray-500">{getPercentage(stats.negative)}%</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.neutral}</div>
          <div className="text-sm text-gray-600">😐 Neutres</div>
          <div className="text-xs text-gray-500">{getPercentage(stats.neutral)}%</div>
        </div>
      </div>

      {/* Bar Chart Simple */}
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="w-20 text-sm text-gray-600">😊 Positif</div>
          <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-500" 
              style={{ width: `${getPercentage(stats.positive)}%` }}
            ></div>
          </div>
          <div className="text-sm font-medium text-green-600 w-12">
            {stats.positive}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-20 text-sm text-gray-600">😞 Négatif</div>
          <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
            <div 
              className="bg-red-500 h-4 rounded-full transition-all duration-500" 
              style={{ width: `${getPercentage(stats.negative)}%` }}
            ></div>
          </div>
          <div className="text-sm font-medium text-red-600 w-12">
            {stats.negative}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-20 text-sm text-gray-600">😐 Neutre</div>
          <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
            <div 
              className="bg-gray-500 h-4 rounded-full transition-all duration-500" 
              style={{ width: `${getPercentage(stats.neutral)}%` }}
            ></div>
          </div>
          <div className="text-sm font-medium text-gray-600 w-12">
            {stats.neutral}
          </div>
        </div>
      </div>

      {/* Détail par statut */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Répartition par statut</h4>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center bg-yellow-50 rounded-lg p-2">
            <div className="font-semibold text-yellow-800">⏳ En attente</div>
            <div className="text-yellow-600">
              {stats.byStatus.PENDING?.positive || 0}😊 | {stats.byStatus.PENDING?.negative || 0}😞 | {stats.byStatus.PENDING?.neutral || 0}😐
            </div>
          </div>
          <div className="text-center bg-blue-50 rounded-lg p-2">
            <div className="font-semibold text-blue-800">🔄 Traités</div>
            <div className="text-blue-600">
              {stats.byStatus.PROCESSED?.positive || 0}😊 | {stats.byStatus.PROCESSED?.negative || 0}😞 | {stats.byStatus.PROCESSED?.neutral || 0}😐
            </div>
          </div>
          <div className="text-center bg-green-50 rounded-lg p-2">
            <div className="font-semibold text-green-800">✅ Fermés</div>
            <div className="text-green-600">
              {stats.byStatus.CLOSED?.positive || 0}😊 | {stats.byStatus.CLOSED?.negative || 0}😞 | {stats.byStatus.CLOSED?.neutral || 0}😐
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
