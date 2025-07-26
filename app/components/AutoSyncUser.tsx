import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'

export async function AutoSyncUser() {
  try {
    const user = await currentUser()
    
    // Si pas d'utilisateur connecté, ne rien faire
    if (!user) {
      return null
    }

    console.log('🔄 Auto-sync: Utilisateur connecté détecté:', user.id)

    // Vérifier si l'utilisateur existe déjà en base
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id }
    })

    if (existingUser) {
      console.log('✅ Auto-sync: Utilisateur déjà en base:', existingUser.id)
      return null
    }

    // Créer l'utilisateur automatiquement
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur',
      },
    })

    console.log('🎉 AUTO-SYNC RÉUSSIE ! Nouvel utilisateur créé:', {
      dbId: newUser.id,
      clerkId: newUser.clerkUserId,
      email: newUser.email,
      name: newUser.name,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Erreur auto-sync:', error)
  }

  // Ce composant ne rend rien visuellement
  return null
}
