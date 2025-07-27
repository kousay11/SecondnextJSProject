import { NextRequest, NextResponse } from 'next/server'
import { debugUserData, cleanOrphanUsers, forceCreateUser } from '@/app/utils/userDebug'
import { currentUser } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const email = searchParams.get('email')
  
  try {
    if (action === 'debug' && email) {
      const result = await debugUserData(email)
      return NextResponse.json({ success: true, data: result })
    }
    
    if (action === 'clean') {
      const count = await cleanOrphanUsers()
      return NextResponse.json({ success: true, message: `${count} utilisateurs orphelins supprimés` })
    }
    
    if (action === 'force-create') {
      const user = await currentUser()
      if (!user) {
        return NextResponse.json({ success: false, error: 'Utilisateur non connecté' })
      }
      
      const result = await forceCreateUser(
        user.id,
        user.emailAddresses[0]?.emailAddress || '',
        `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur'
      )
      
      return NextResponse.json({ success: true, data: result })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Action non reconnue',
      availableActions: ['debug', 'clean', 'force-create'],
      examples: [
        '/api/debug-users?action=debug&email=kousaynajar147@gmail.com',
        '/api/debug-users?action=clean',
        '/api/debug-users?action=force-create'
      ]
    })
    
  } catch (error) {
    console.error('Erreur API debug-users:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, clerkUserId, name } = body
    
    if (action === 'force-create' && clerkUserId && email) {
      const result = await forceCreateUser(clerkUserId, email, name || 'Utilisateur')
      return NextResponse.json({ success: true, data: result })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Paramètres manquants pour la création forcée' 
    })
    
  } catch (error) {
    console.error('Erreur POST debug-users:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    })
  }
}
