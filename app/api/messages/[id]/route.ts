import { NextRequest, NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from "@/prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier que l'utilisateur est connecté et admin
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      select: { role: true }
    });

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: "Accès refusé - Admin requis" }, { status: 403 });
    }

    const messageId = parseInt(params.id);
    
    if (isNaN(messageId)) {
      return NextResponse.json({ error: "ID message invalide" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!['PENDING', 'PROCESSED', 'CLOSED'].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    // Mettre à jour le statut du message
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        status,
        processedAt: status !== 'PENDING' ? new Date() : null
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
      message: updatedMessage 
    });

  } catch (error) {
    console.error('Erreur mise à jour message:', error);
    return NextResponse.json({ 
      error: "Erreur serveur lors de la mise à jour du message" 
    }, { status: 500 });
  }
}
