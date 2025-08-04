"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SentimentStatsChart from "./SentimentStatsChart";
import MessagesTable from "./MessagesTable";
import MessagesManager from "./MessagesManager";
import DashboardStatistics from "./DashboardStatistics";

export default function AdminSidebar() {
  const [selectedView, setSelectedView] = useState<"chart" | "table" | "manager" | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();

  // Vérifier immédiatement au montage
  useEffect(() => {
    const checkUrlParams = () => {
      const messageId = searchParams?.get('messageId');
      const action = searchParams?.get('action');
      const shouldOpenMessages = localStorage.getItem('shouldOpenMessages');
      
      console.log('AdminSidebar - Initial check:', { messageId, action, shouldOpenMessages }); // Debug
      
      if ((messageId && action === 'reply') || shouldOpenMessages === 'true') {
        console.log('Opening Messages section automatically (initial)'); // Debug
        setSelectedView('manager');
        setIsMenuOpen(false);
        
        if (shouldOpenMessages === 'true') {
          localStorage.removeItem('shouldOpenMessages');
        }
      }
    };

    // Vérifier immédiatement et avec un délai
    checkUrlParams();
    setTimeout(checkUrlParams, 100);
  }, [searchParams]); // Ajouter searchParams comme dépendance

  // Détecter les paramètres URL pour ouvrir automatiquement la section Messages
  useEffect(() => {
    const messageId = searchParams?.get('messageId');
    const action = searchParams?.get('action');
    const shouldOpenMessages = localStorage.getItem('shouldOpenMessages');
    
    console.log('AdminSidebar - URL params:', { messageId, action, shouldOpenMessages }); // Debug
    
    if ((messageId && action === 'reply') || shouldOpenMessages === 'true') {
      console.log('Opening Messages section automatically'); // Debug
      // Ouvrir automatiquement la section Messages
      setSelectedView('manager');
      setIsMenuOpen(false);
      
      // Nettoyer le flag localStorage
      if (shouldOpenMessages === 'true') {
        localStorage.removeItem('shouldOpenMessages');
      }
    }
  }, [searchParams]);

  const handleMenuSelect = (view: "chart" | "table" | "manager") => {
    setSelectedView(view);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white min-h-screen p-4 fixed left-0 top-0">
        <h2 className="text-xl font-bold mb-6">📊 Admin Dashboard</h2>
        
        {/* Menu déroulant Messages */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="flex items-center">
              📧 Gestion des Messages
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Sous-menu */}
          {isMenuOpen && (
            <div className="mt-2 ml-4 space-y-2">
              <button
                onClick={() => handleMenuSelect("manager")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedView === "manager" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                💬 Messages
              </button>
              <button
                onClick={() => handleMenuSelect("chart")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedView === "chart" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                📊 Statistiques & Charts
              </button>
              <button
                onClick={() => handleMenuSelect("table")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedView === "table" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                📋 Suggestions IA
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen">
        {selectedView === null && (
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Dashboard Admin
              </h3>
              <p className="text-gray-600">
                Bienvenue ! Voici un aperçu de l
                activité des messages et des clients.
              </p>
            </div>
            <DashboardStatistics />
          </div>
        )}
        
        {/* Indicateur quand suggestion appliquée */}
        {searchParams?.get('messageId') && searchParams?.get('action') === 'reply' && selectedView === 'manager' && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">🤖</span>
              <span className="text-blue-700 font-medium">
                Suggestion IA appliquée pour le message #{searchParams.get('messageId')} - Voir ci-dessous
              </span>
            </div>
          </div>
        )}
        
        {selectedView === "chart" && <SentimentStatsChart />}
        {selectedView === "table" && <MessagesTable />}
        {selectedView === "manager" && <MessagesManager />}
      </div>
    </div>
  );
}
