import { NextRequest, NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from "@/prisma/client";
import schema from "../schema";


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID produit invalide" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Erreur récupération produit:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

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

    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID produit invalide" }, { status: 400 });
    }

    // Vérifier que le produit existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }

    // Valider les données
    const body = await request.json();
    console.log('Données reçues pour mise à jour:', body);
    
    const validation = schema.safeParse(body);
    
    if (!validation.success) {
      console.error('Validation échouée:', validation.error.issues);
      return NextResponse.json({ 
        error: "Données invalides", 
        details: validation.error.issues 
      }, { status: 400 });
    }

    // Vérifier si un autre produit avec ce nom existe déjà
    const duplicateProduct = await prisma.product.findFirst({
      where: { 
        name: body.name,
        id: { not: productId }
      },
    });
    
    if (duplicateProduct) {
      return NextResponse.json({ error: "Un autre produit avec ce nom existe déjà" }, { status: 409 });
    }

    // Mettre à jour le produit
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name,
        description: body.description || null,
        price: body.price,
        imageProduct: body.imageProduct || null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      product: updatedProduct 
    });

  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    return NextResponse.json({ 
      error: "Erreur serveur lors de la mise à jour du produit" 
    }, { status: 500 });
  }
}

export async function DELETE(
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

    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID produit invalide" }, { status: 400 });
    }

    // Vérifier que le produit existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    }

    // Supprimer le produit
    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Produit supprimé avec succès" 
    });

  } catch (error) {
    console.error('Erreur suppression produit:', error);
    return NextResponse.json({ 
      error: "Erreur serveur lors de la suppression du produit" 
    }, { status: 500 });
  }
}
