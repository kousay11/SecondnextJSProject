import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'

export async function POST() {
  try {
    console.log('🔄 API Sync User appelée')
    
    const user = await currentUser()
    
    if (!user) {
      console.log('❌ Pas d\'utilisateur connecté')
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('👤 Utilisateur Clerk trouvé:', {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName} ${user.lastName}`
    })

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id }
    })

    if (existingUser) {
      console.log('✅ Utilisateur déjà en base:', existingUser.id)
      return Response.json({ 
        success: true, 
        action: 'exists',
        user: existingUser 
      })
    }

    // Créer nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur',
        role: 'CLIENT', // Rôle par défaut
      },
    })

    console.log('✅ NOUVEL UTILISATEUR CRÉÉ:', {
      dbId: newUser.id,
      clerkId: newUser.clerkUserId,
      email: newUser.email,
      name: newUser.name
    })

    return Response.json({ 
      success: true, 
      action: 'created',
      user: newUser 
    })

  } catch (error) {
    console.error('❌ Erreur synchronisation:', error)
    return Response.json({ 
      error: 'Sync failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
