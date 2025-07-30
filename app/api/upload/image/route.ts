import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      select: { role: true }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé - Admin requis' }, { status: 403 })
    }

    // Récupérer le fichier depuis FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Type de fichier non supporté. Utilisez: JPG, PNG, WebP' 
      }, { status: 400 })
    }

    // Vérifier la taille (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'Fichier trop volumineux. Taille maximum: 5MB' 
      }, { status: 400 })
    }

    // Créer un nom de fichier unique
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const filename = `product-${timestamp}${extension}`

    // Créer le dossier uploads s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch {
      // Le dossier existe déjà, continuer
    }

    // Sauvegarder le fichier
    const filepath = path.join(uploadDir, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filepath, buffer)

    // Retourner l'URL publique
    const publicUrl = `/uploads/products/${filename}`
    
    return NextResponse.json({ 
      success: true,
      imageUrl: publicUrl,
      filename: filename
    })

  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur lors de l\'upload' 
    }, { status: 500 })
  }
}
