import { prisma } from '@/prisma/client';

export async function GET() {
  try {
    // Récupérer TOUS les messages pour les statistiques de base
    const messages = await prisma.message.findMany();

    if (messages.length === 0) {
      return Response.json({ 
        stats: { total: 0, positive: 0, negative: 0, neutral: 0, byStatus: {} },
        results: [] 
      });
    }

    // Statistiques de base par statut (sans analyse IA)
    const basicStats = {
      total: messages.length,
      positive: 0, // Sera mis à jour si Ollama fonctionne
      negative: 0,
      neutral: messages.length, // Par défaut, tout est considéré comme neutre
      byStatus: {
        PENDING: {
          total: messages.filter(m => m.status === 'PENDING').length,
          positive: 0,
          negative: 0,
          neutral: messages.filter(m => m.status === 'PENDING').length,
        },
        PROCESSED: {
          total: messages.filter(m => m.status === 'PROCESSED').length,
          positive: 0,
          negative: 0,
          neutral: messages.filter(m => m.status === 'PROCESSED').length,
        },
        CLOSED: {
          total: messages.filter(m => m.status === 'CLOSED').length,
          positive: 0,
          negative: 0,
          neutral: messages.filter(m => m.status === 'CLOSED').length,
        }
      }
    };

    // Essayer l'analyse IA avec Ollama (avec timeout)
    try {
      console.log('Tentative d\'analyse IA pour', messages.length, 'messages...');
      
      const analysisPromises = messages.slice(0, 10).map(async (msg) => { // Limiter à 10 messages pour éviter timeout
        try {
          const prompt = `Classe ce message comme POSITIVE, NEGATIVE ou NEUTRAL.\nMessage: "${msg.message.substring(0, 200)}"\nRéponds juste: POSITIVE, NEGATIVE ou NEUTRAL`;

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes timeout

          const res = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'llama3',
              prompt,
              stream: false
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!res.ok) {
            throw new Error('Ollama response not ok');
          }

          const data = await res.json();
          
          // Analyse simple de la réponse
          const response = data.response?.toUpperCase() || 'NEUTRAL';
          let sentiment = 'NEUTRAL';
          
          if (response.includes('POSITIVE')) {
            sentiment = 'POSITIVE';
          } else if (response.includes('NEGATIVE')) {
            sentiment = 'NEGATIVE';
          }

          return {
            id: msg.id,
            sentiment,
            status: msg.status
          };
        } catch {
          console.log(`Erreur analyse message ${msg.id}, utilisation fallback`);
          return {
            id: msg.id,
            sentiment: 'NEUTRAL',
            status: msg.status
          };
        }
      });

      const results = await Promise.all(analysisPromises);
      
      // Calculer les vraies statistiques basées sur l'analyse IA
      const aiStats = {
        total: messages.length,
        positive: results.filter(r => r.sentiment === 'POSITIVE').length,
        negative: results.filter(r => r.sentiment === 'NEGATIVE').length,
        neutral: results.filter(r => r.sentiment === 'NEUTRAL').length,
        byStatus: {
          PENDING: {
            total: messages.filter(m => m.status === 'PENDING').length,
            positive: results.filter(r => r.status === 'PENDING' && r.sentiment === 'POSITIVE').length,
            negative: results.filter(r => r.status === 'PENDING' && r.sentiment === 'NEGATIVE').length,
            neutral: results.filter(r => r.status === 'PENDING' && r.sentiment === 'NEUTRAL').length,
          },
          PROCESSED: {
            total: messages.filter(m => m.status === 'PROCESSED').length,
            positive: results.filter(r => r.status === 'PROCESSED' && r.sentiment === 'POSITIVE').length,
            negative: results.filter(r => r.status === 'PROCESSED' && r.sentiment === 'NEGATIVE').length,
            neutral: results.filter(r => r.status === 'PROCESSED' && r.sentiment === 'NEUTRAL').length,
          },
          CLOSED: {
            total: messages.filter(m => m.status === 'CLOSED').length,
            positive: results.filter(r => r.status === 'CLOSED' && r.sentiment === 'POSITIVE').length,
            negative: results.filter(r => r.status === 'CLOSED' && r.sentiment === 'NEGATIVE').length,
            neutral: results.filter(r => r.status === 'CLOSED' && r.sentiment === 'NEUTRAL').length,
          }
        }
      };

      console.log('Analyse IA réussie:', aiStats);
      return Response.json({ stats: aiStats, results, aiEnabled: true });

    } catch (aiError) {
      console.log('Ollama non disponible, utilisation des statistiques de base:', aiError instanceof Error ? aiError.message : 'Erreur inconnue');
      
      // Retourner les statistiques de base si l'IA ne fonctionne pas
      return Response.json({ 
        stats: basicStats, 
        results: [], 
        aiEnabled: false,
        message: 'Statistiques de base - IA non disponible'
      });
    }

  } catch (error) {
    console.error('Erreur API sentiment-stats:', error);
    return Response.json({ 
      stats: { total: 0, positive: 0, negative: 0, neutral: 0, byStatus: {} },
      results: [],
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}
