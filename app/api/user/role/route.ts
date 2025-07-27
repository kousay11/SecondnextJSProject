import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'

export async function GET() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Récupérer l'utilisateur dans la base de données
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
      select: { id: true, role: true, email: true, name: true }
    })

    if (!dbUser) {
      return Response.json({ error: 'User not found in database' }, { status: 404 })
    }

    return Response.json({ 
      role: dbUser.role,
      user: dbUser
    })

  } catch (error) {
    console.error('❌ Erreur récupération rôle:', error)
    return Response.json({ 
      error: 'Failed to fetch user role',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
