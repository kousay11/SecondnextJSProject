import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

interface AIResponse {
  sentiment: string;
  suggestion: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messageId } = await request.json();
    
    if (!messageId) {
      return NextResponse.json({ error: 'ID du message requis' }, { status: 400 });
    }

    // Récupérer le message spécifique
    const message = await prisma.message.findUnique({
      where: { 
        id: parseInt(messageId),
        status: {
          not: 'CLOSED'
        }
      }
    });

    if (!message) {
      return NextResponse.json({ error: 'Message non trouvé ou fermé' }, { status: 404 });
    }

    // Générer une nouvelle suggestion avec un prompt différent
    const prompt = `Génère une nouvelle réponse alternative pour ce message client. Sois créatif et propose une approche différente.\nMessage: "${message.message}"\nRéponds au format JSON: {"sentiment":"POSITIVE|NEGATIVE","suggestion":"..."}`;

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
    let ai: AIResponse = { sentiment: 'INCONNU', suggestion: 'Nouvelle suggestion non disponible' };
    
    try {
      const match = data.response.match(/{[^}]*}/);
      if (match) {
        ai = JSON.parse(match[0]);
      }
    } catch {
      ai = { sentiment: 'INCONNU', suggestion: 'Erreur lors de la génération de la nouvelle suggestion' };
    }

    return NextResponse.json({
      id: message.id,
      message: message.message,
      sentiment: ai.sentiment,
      suggestion: ai.suggestion
    });

  } catch (error) {
    console.error('Erreur régénération suggestion:', error);
    return NextResponse.json({ error: 'Erreur lors de la régénération' }, { status: 500 });
  }
}
