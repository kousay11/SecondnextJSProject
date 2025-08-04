import { prisma } from '@/prisma/client';

interface AIResponse {
  sentiment: string;
}

export async function GET() {
  try {
    // Récupérer TOUS les messages (y compris fermés) pour les statistiques
    const messages = await prisma.message.findMany();

    const results = await Promise.all(messages.map(async (msg) => {
      const prompt = `Classe seulement ce message comme POSITIVE, NEGATIVE ou NEUTRAL selon le sentiment.\nMessage: "${msg.message}"\nRéponds au format JSON: {"sentiment":"POSITIVE|NEGATIVE|NEUTRAL"}`;

      try {
        const res = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3',
            prompt,
            stream: false
          })
        });

        if (!res.ok) {
          throw new Error('Erreur Ollama');
        }

        const data = await res.json();
        let ai: AIResponse = { sentiment: 'NEUTRAL' };
        
        try {
          const match = data.response.match(/{[^}]*}/);
          if (match) {
            ai = JSON.parse(match[0]);
          }
        } catch {
          ai = { sentiment: 'NEUTRAL' };
        }

        return {
          id: msg.id,
          sentiment: ai.sentiment,
          status: msg.status
        };
      } catch (error) {
        console.error(`Erreur analyse message ${msg.id}:`, error);
        return {
          id: msg.id,
          sentiment: 'NEUTRAL',
          status: msg.status
        };
      }
    }));

    // Calculer les statistiques globales
    const stats = {
      total: results.length,
      positive: results.filter(r => r.sentiment === 'POSITIVE').length,
      negative: results.filter(r => r.sentiment === 'NEGATIVE').length,
      neutral: results.filter(r => r.sentiment === 'NEUTRAL').length,
      // Statistiques par statut
      byStatus: {
        PENDING: {
          total: results.filter(r => r.status === 'PENDING').length,
          positive: results.filter(r => r.status === 'PENDING' && r.sentiment === 'POSITIVE').length,
          negative: results.filter(r => r.status === 'PENDING' && r.sentiment === 'NEGATIVE').length,
          neutral: results.filter(r => r.status === 'PENDING' && r.sentiment === 'NEUTRAL').length,
        },
        PROCESSED: {
          total: results.filter(r => r.status === 'PROCESSED').length,
          positive: results.filter(r => r.status === 'PROCESSED' && r.sentiment === 'POSITIVE').length,
          negative: results.filter(r => r.status === 'PROCESSED' && r.sentiment === 'NEGATIVE').length,
          neutral: results.filter(r => r.status === 'PROCESSED' && r.sentiment === 'NEUTRAL').length,
        },
        CLOSED: {
          total: results.filter(r => r.status === 'CLOSED').length,
          positive: results.filter(r => r.status === 'CLOSED' && r.sentiment === 'POSITIVE').length,
          negative: results.filter(r => r.status === 'CLOSED' && r.sentiment === 'NEGATIVE').length,
          neutral: results.filter(r => r.status === 'CLOSED' && r.sentiment === 'NEUTRAL').length,
        }
      }
    };

    return Response.json({ stats, results });

  } catch (error) {
    console.error('Erreur API stats sentiment:', error);
    return Response.json({ 
      stats: { total: 0, positive: 0, negative: 0, neutral: 0, byStatus: {} },
      results: [] 
    }, { status: 500 });
  }
}
