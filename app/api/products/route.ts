import { NextRequest, NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';
import schema from "./schema";
import { prisma } from "@/prisma/client";

export async function GET() {
   const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    }
   });
  
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
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

    // Valider les données
    const body = await request.json();
    console.log('Données reçues:', body);
    
    const validation = schema.safeParse(body);
    
    if (!validation.success) {
      console.error('Validation échouée:', validation.error.issues);
      return NextResponse.json({ 
        error: "Données invalides", 
        details: validation.error.issues 
      }, { status: 400 });
    }

    console.log('Validation réussie, données validées:', validation.data);

    // Vérifier si un produit avec ce nom existe déjà
    const existingProduct = await prisma.product.findFirst({
      where: { name: body.name },
    });
    
    if (existingProduct) {
      return NextResponse.json({ error: "Un produit avec ce nom existe déjà" }, { status: 409 });
    }

    // Créer le nouveau produit
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: body.price,
        imageProduct: body.imageProduct || null,
      }
    });

    return NextResponse.json({ 
      success: true, 
      product: newProduct 
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur création produit:', error);
    return NextResponse.json({ 
      error: "Erreur serveur lors de la création du produit" 
    }, { status: 500 });
  }
}