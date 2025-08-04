import { prisma } from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Récupérer les clients les plus interactifs (avec le plus de messages)
    const topClients = await prisma.user.findMany({
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        messages: {
          _count: 'desc'
        }
      },
      take: 10, // Top 10 clients
      where: {
        messages: {
          some: {} // Seulement les clients qui ont au moins un message
        }
      }
    });

    const clientsData = topClients.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      messageCount: user.messages.length,
      lastMessageDate: user.messages.length > 0 ? user.messages[0].createdAt : null
    }));

    // 2. Récupérer les messages des 7 derniers jours (incluant aujourd'hui)
    // Aujourd'hui = 4 août 2025 (lundi)
    const today = new Date('2025-08-04T23:59:59.999Z'); // Fin du 4 août 2025
    const startDate = new Date('2025-07-29T00:00:00.000Z'); // Début du 29 juillet 2025 (7 jours avant)

    console.log('Période de recherche:', {
      startDate: startDate.toISOString(),
      today: today.toISOString()
    });

    const messagesLast7Days = await prisma.message.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: today
        }
      },
      select: {
        createdAt: true
      }
    });

    console.log('Nombre de messages trouvés:', messagesLast7Days.length);

    // 3. Créer un tableau des 7 derniers jours (du plus ancien au plus récent)
    const last7DaysData = [];
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    // Parcourir les 7 derniers jours (du 29/07 au 04/08)
    for (let i = 6; i >= 0; i--) {
      const currentDate = new Date('2025-08-04'); // 4 août 2025
      currentDate.setDate(currentDate.getDate() - i);
      
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Compter les messages de ce jour
      const messagesCount = messagesLast7Days.filter(message => {
        const messageDate = new Date(message.createdAt);
        return messageDate >= dayStart && messageDate <= dayEnd;
      }).length;

      const dayName = dayNames[currentDate.getDay()];
      
      console.log(`${dayName} ${currentDate.toLocaleDateString('fr-FR')}:`, messagesCount, 'messages');

      last7DaysData.push({
        day: dayName,
        date: currentDate.toISOString().split('T')[0], // Format YYYY-MM-DD
        count: messagesCount
      });
    }

    // 4. Statistiques générales
    const totalMessages = await prisma.message.count();
    const totalUsers = await prisma.user.count({
      where: {
        messages: {
          some: {}
        }
      }
    });

    const avgMessagesPerUser = totalUsers > 0 ? Math.round(totalMessages / totalUsers) : 0;

    const response = {
      topClients: clientsData,
      weeklyMessages: last7DaysData,
      stats: {
        totalMessages,
        totalActiveUsers: totalUsers,
        avgMessagesPerUser,
        weekStartDate: startDate.toISOString().split('T')[0],
        weekEndDate: today.toISOString().split('T')[0]
      }
    };

    console.log('Réponse API:', JSON.stringify(response, null, 2));

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erreur API dashboard stats:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération des statistiques',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      topClients: [],
      weeklyMessages: [],
      stats: {
        totalMessages: 0,
        totalActiveUsers: 0,
        avgMessagesPerUser: 0,
        weekStartDate: '',
        weekEndDate: ''
      }
    }, { status: 500 });
  }
}
