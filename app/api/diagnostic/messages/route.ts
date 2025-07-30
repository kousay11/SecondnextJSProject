import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    console.log('🔍 Test de diagnostic API Messages...');
    
    // Test de connexion Prisma
    console.log('📊 Test connexion Prisma...');
    const testConnection = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Connexion Prisma OK:', testConnection);
    
    // Vérifier si la table Message existe
    console.log('🗃️ Vérification table Message...');
    const messageCount = await prisma.message.count();
    console.log('📈 Nombre de messages en base:', messageCount);
    
    // Vérifier les utilisateurs
    console.log('👥 Vérification utilisateurs...');
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        clerkUserId: true
      }
    });
    console.log('👤 Nombre d\'utilisateurs:', userCount);
    console.log('📋 Liste utilisateurs:', users);
    
    // Essayer de récupérer les messages avec détails
    console.log('💬 Tentative récupération messages...');
    const messages = await prisma.message.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('📨 Messages récupérés:', messages.length);
    console.log('📄 Détails messages:', JSON.stringify(messages, null, 2));
    
    return NextResponse.json({
      success: true,
      diagnostics: {
        prismaConnection: 'OK',
        messageCount,
        userCount,
        users,
        messages,
        messagesWithUser: messages.length
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur diagnostic:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
