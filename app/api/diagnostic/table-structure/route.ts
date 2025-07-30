import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    console.log('🔍 Test de la structure de la table Message...');
    
    // Test de connexion direct à la base
    const dbTest = await prisma.$queryRaw`SHOW COLUMNS FROM Message`;
    console.log('📊 Structure de la table Message:', dbTest);
    
    // Test simple de count
    const messageCount = await prisma.message.count();
    console.log('📈 Nombre de messages:', messageCount);
    
    // Test de requête simple sans include
    const simpleMessages = await prisma.message.findMany({
      take: 1
    });
    console.log('📄 Premier message (simple):', simpleMessages);
    
    return NextResponse.json({
      success: true,
      tableStructure: dbTest,
      messageCount,
      simpleMessages
    });
    
  } catch (error) {
    console.error('❌ Erreur test structure:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
