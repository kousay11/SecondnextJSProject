import { NextRequest, NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from "@/prisma/client";
import { z } from "zod";

// Schéma de validation pour les messages
const messageSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 caractères"),
  subject: z.enum([
    'GENERAL_INQUIRY',
    'TECHNICAL_SUPPORT', 
    'BILLING_QUESTION',
    'PRODUCT_QUESTION',
    'COMPLAINT',
    'SUGGESTION',
    'OTHER'
  ]),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000, "Le message ne peut pas dépasser 2000 caractères"),
});

export async function GET() {
  try {
    console.log('🔍 [API Messages] Début de la requête GET');
    
    // Vérifier que l'utilisateur est connecté et admin
    const clerkUser = await currentUser();
    console.log('👤 [API Messages] Utilisateur Clerk:', clerkUser ? `${clerkUser.id} (${clerkUser.emailAddresses[0]?.emailAddress})` : 'Non connecté');
    
    if (!clerkUser) {
      console.log('❌ [API Messages] Utilisateur non authentifié');
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      select: { role: true, id: true, email: true }
    });
    console.log('🗃️ [API Messages] Utilisateur en base:', dbUser);

    if (!dbUser || dbUser.role !== 'ADMIN') {
      console.log('❌ [API Messages] Accès refusé - Rôle:', dbUser?.role);
      return NextResponse.json({ error: "Accès refusé - Admin requis" }, { status: 403 });
    }

    console.log('✅ [API Messages] Utilisateur autorisé, récupération des messages...');
    
    // Récupérer tous les messages avec les informations utilisateur
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
    
    console.log('📨 [API Messages] Messages récupérés:', messages.length);
    console.log('📄 [API Messages] Détails des messages:', JSON.stringify(messages, null, 2));

    return NextResponse.json(messages);
  } catch (error) {
    console.error('❌ [API Messages] Erreur récupération messages:', error);
    console.error('📊 [API Messages] Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
    
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est connecté
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      select: { id: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Valider les données
    const body = await request.json();
    console.log('Données reçues pour message:', body);
    
    const validation = messageSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('Validation échouée:', validation.error.issues);
      return NextResponse.json({ 
        error: "Données invalides", 
        details: validation.error.issues 
      }, { status: 400 });
    }

    // Créer le nouveau message
    const newMessage = await prisma.message.create({
      data: {
        userId: dbUser.id,
        phone: validation.data.phone,
        subject: validation.data.subject,
        message: validation.data.message,
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: newMessage 
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur création message:', error);
    return NextResponse.json({ 
      error: "Erreur serveur lors de l'envoi du message" 
    }, { status: 500 });
  }
}
