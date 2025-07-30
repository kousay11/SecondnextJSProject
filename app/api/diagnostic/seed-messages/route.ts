import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function POST() {
  try {
    console.log('🌱 Création de messages de test...');
    
    // Vérifier qu'il y a au moins un utilisateur
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      return NextResponse.json({
        error: "Aucun utilisateur trouvé. Veuillez vous connecter d'abord."
      }, { status: 400 });
    }
    
    // Utiliser le premier utilisateur pour créer des messages de test
    const testUser = users[0];
    
    const testMessages = [
      {
        userId: testUser.id,
        phone: "+33123456789",
        subject: "GENERAL_INQUIRY" as const,
        message: "Bonjour, j'aimerais avoir des informations sur vos services. Pouvez-vous m'expliquer comment fonctionne votre système de gestion des utilisateurs ?",
        status: "PENDING" as const
      },
      {
        userId: testUser.id,
        phone: "+33987654321",
        subject: "TECHNICAL_SUPPORT" as const,
        message: "J'ai un problème technique avec l'upload d'images. L'application ne semble pas accepter mes fichiers même s'ils sont en format JPG.",
        status: "PENDING" as const
      },
      {
        userId: testUser.id,
        phone: "+33555123456",
        subject: "PRODUCT_QUESTION" as const,
        message: "Est-ce que vos produits sont compatibles avec les dernières versions de navigateurs ? J'utilise Chrome et Firefox.",
        status: "PROCESSED" as const
      },
      {
        userId: testUser.id,
        phone: "+33444789123",
        subject: "SUGGESTION" as const,
        message: "Je pense qu'il serait bien d'ajouter une fonctionnalité de recherche avancée dans la liste des produits. Cela améliorerait grandement l'expérience utilisateur.",
        status: "CLOSED" as const
      }
    ];
    
    // Créer les messages de test
    const createdMessages = [];
    for (const messageData of testMessages) {
      const message = await prisma.message.create({
        data: messageData,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
      createdMessages.push(message);
    }
    
    console.log('✅ Messages de test créés:', createdMessages.length);
    
    return NextResponse.json({
      success: true,
      message: `${createdMessages.length} messages de test créés avec succès`,
      createdMessages
    });
    
  } catch (error) {
    console.error('❌ Erreur création messages test:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
