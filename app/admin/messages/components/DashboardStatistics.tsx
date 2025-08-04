"use client";
import { useEffect, useState } from "react";

interface TopClient {
  id: number;
  name: string;
  email: string;
  messageCount: number;
  lastMessageDate: string | null;
}

interface WeeklyMessage {
  day: string;
  date: string;
  count: number;
}

interface DashboardStats {
  totalMessages: number;
  totalActiveUsers: number;
  avgMessagesPerUser: number;
  weekStartDate: string;
  weekEndDate: string;
}

interface DashboardData {
  topClients: TopClient[];
  weeklyMessages: WeeklyMessage[];
  stats: DashboardStats;
}

export default function DashboardStatistics() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    x: number;
    y: number;
    data: WeeklyMessage;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard-stats")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((dashboardData) => {
        console.log("Dashboard Data:", dashboardData);
        setData(dashboardData);
      })
      .catch((error) => {
        console.error("Erreur dashboard stats:", error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des statistiques...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-8 text-red-500">
            <div className="text-4xl mb-2">❌</div>
            <p>Erreur: {error || "Données non disponibles"}</p>
          </div>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.weeklyMessages.map(d => d.count), 0);
  
  // Créer une échelle simple et claire pour les ordonnées (0, 1, 2, 3...)
  const maxForScale = Math.max(maxCount, 3); // Au minimum 3 pour avoir une bonne échelle
  const yAxisLabels = [];
  for (let i = maxForScale; i >= 0; i--) {
    yAxisLabels.push(i);
  }
  
  // Debug: afficher les informations
  console.log('Données du graphique:', {
    maxCount,
    maxForScale,
    yAxisLabels,
    weeklyData: data.weeklyMessages.map(d => ({ day: d.day, count: d.count, date: d.date }))
  });

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{data.stats.totalMessages}</div>
          <div className="text-gray-600">📨 Messages Total</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{data.stats.totalActiveUsers}</div>
          <div className="text-gray-600">👥 Clients Actifs</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{data.stats.avgMessagesPerUser}</div>
          <div className="text-gray-600">📊 Moy. Messages/Client</div>
        </div>
      </div>

      {/* Tableau des clients les plus interactifs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <h2 className="text-2xl font-bold">👑 Clients les Plus Interactifs</h2>
          <p className="text-green-100 mt-1">
            Top {data.topClients.length} clients par nombre de messages
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernier Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.topClients.map((client, index) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                      {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                      {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                      {index > 2 && <span className="text-gray-500 font-medium mr-2">#{index + 1}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {client.messageCount} messages
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {client.lastMessageDate 
                      ? new Date(client.lastMessageDate).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      : 'Aucun'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphique en barres des messages par jour */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">� Messages par Jour (7 Derniers Jours)</h2>
          <p className="text-gray-600">
            Du {new Date(data.stats.weekStartDate).toLocaleDateString('fr-FR')} 
            au {new Date(data.stats.weekEndDate).toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Bar Chart moderne */}
        <div className="relative">
          {/* Axe Y (valeurs) - Échelle simple */}
          <div className="absolute left-0 top-0 bottom-12 w-10 flex flex-col justify-between text-xs text-gray-500">
            {yAxisLabels.map((value: number, index: number) => (
              <span key={index} className="text-right pr-2">{value}</span>
            ))}
          </div>

          {/* Zone du graphique */}
          <div className="ml-12 mr-4">
            {/* Grille de fond avec échelle simple */}
            <div className="relative h-64 border-l border-b border-gray-200">
              {/* Lignes horizontales de la grille */}
              <div className="absolute inset-0">
                {yAxisLabels.map((value: number, index: number) => {
                  const percent = (index / (yAxisLabels.length - 1)) * 100;
                  return (
                    <div
                      key={index}
                      className="absolute w-full border-t border-gray-100"
                      style={{ bottom: `${percent}%` }}
                    />
                  );
                })}
              </div>

              {/* Barres */}
              <div className="absolute inset-0 flex items-end justify-between px-2">
                {data.weeklyMessages.map((item, index) => {
                  // Calcul précis de la hauteur basé sur l'échelle des ordonnées
                  // Utiliser maxForScale (au minimum 3) pour une échelle correcte
                  const barHeight = maxForScale > 0 ? (item.count / maxForScale) * 100 : 0;
                  
                  const isToday = new Date(item.date).toDateString() === new Date(2025, 7, 4).toDateString();
                  
                  console.log(`Barre ${item.day}: count=${item.count}, maxForScale=${maxForScale}, height=${barHeight}%`);
                  
                  return (
                    <div key={index} className="flex flex-col items-center group relative" style={{ width: `${100 / data.weeklyMessages.length}%` }}>
                      {/* Barre */}
                      <div
                        className={`w-full max-w-16 mx-1 rounded-t-lg transition-all duration-300 group-hover:scale-105 ${
                          item.count > 0 
                            ? (isToday 
                                ? 'bg-gradient-to-t from-green-500 to-green-400 shadow-lg' 
                                : 'bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500')
                            : 'bg-gray-200'
                        }`}
                        style={{ 
                          height: `${barHeight}%`,
                          minHeight: item.count > 0 ? '2px' : '0px', // Hauteur minimale très petite
                          boxShadow: isToday && item.count > 0 ? '0 4px 12px rgba(34, 197, 94, 0.4)' : item.count > 0 ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredPoint({
                            index,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                            data: item
                          });
                        }}
                        onMouseLeave={() => setHoveredPoint(null)}
                      >
                        {/* Valeur au-dessus de la barre */}
                        {item.count > 0 && (
                          <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-bold ${
                            isToday ? 'text-green-600' : 'text-gray-700'
                          }`}>
                            {item.count}
                          </div>
                        )}
                        
                        {/* Indicateur "Aujourd'hui" */}
                        {isToday && (
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">
                            Aujourd&apos;hui
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tooltip amélioré */}
              {hoveredPoint && (
                <div
                  className="fixed z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm pointer-events-none transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: hoveredPoint.x,
                    top: hoveredPoint.y - 15,
                  }}
                >
                  <div className="font-semibold text-blue-300">{hoveredPoint.data.day}</div>
                  <div className="text-gray-300 text-xs">
                    {new Date(hoveredPoint.data.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-white font-medium">
                    {hoveredPoint.data.count} message{hoveredPoint.data.count !== 1 ? 's' : ''}
                  </div>
                  {/* Flèche du tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>

            {/* Axe X (jours) avec amélioration visuelle */}
            <div className="flex justify-between mt-4">
              {data.weeklyMessages.map((item, index) => {
                const isToday = new Date(item.date).toDateString() === new Date(2025, 7, 4).toDateString();
                return (
                  <div key={index} className={`text-center flex-1 ${isToday ? 'font-bold' : ''}`}>
                    <div className={`text-sm ${isToday ? 'text-green-600' : 'text-gray-700'}`}>
                      {item.day.substring(0, 3)}
                    </div>
                    <div className={`text-xs ${isToday ? 'text-green-500' : 'text-gray-400'}`}>
                      {new Date(item.date).getDate()}/{new Date(item.date).getMonth() + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Légende améliorée */}
        <div className="mt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm"></div>
            <span className="text-sm text-gray-600">Messages reçus</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-t from-green-500 to-green-400 rounded-sm"></div>
            <span className="text-sm text-gray-600">Aujourd&apos;hui</span>
          </div>
        </div>
      </div>
    </div>
  );
}
