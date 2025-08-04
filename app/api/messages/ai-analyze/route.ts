import { prisma } from '@/prisma/client';

interface AIResponse {
  sentiment: string;
  suggestion: string;
}

export async function GET() {
  // Ne traiter que les messages non fermés
  const messages = await prisma.message.findMany({
    where: {
      status: {
        not: 'CLOSED'
      }
    }
  });

  const results = await Promise.all(messages.map(async (msg) => {
    const prompt = `Je veux que tu classes ce message comme POSITIVE ou NEGATIVE et que tu proposes une réponse adaptée.\nMessage: "${msg.message}"\nRéponds au format JSON: {"sentiment":"POSITIVE|NEGATIVE","suggestion":"..."}`;

    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt,
        stream: false
      })
    });
    const data = await res.json();
    let ai: AIResponse = { sentiment: 'INCONNU', suggestion: 'Aucune suggestion' };
    try {
      const match = data.response.match(/{[^}]*}/);
      if (match) {
        ai = JSON.parse(match[0]);
      }
    } catch {
      ai = { sentiment: 'INCONNU', suggestion: 'Aucune suggestion' };
    }
    return {
      id: msg.id,
      message: msg.message,
      sentiment: ai.sentiment,
      suggestion: ai.suggestion
    };
  }));

  return Response.json({ results });
}
