import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from "@/prisma/client";

export async function GET() {
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

    // Compter les messages non traités
    const unreadCount = await prisma.message.count({
      where: {
        status: 'PENDING'
      }
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error('Erreur comptage messages:', error);
    return NextResponse.json({ 
      error: "Erreur serveur" 
    }, { status: 500 });
  }
}
