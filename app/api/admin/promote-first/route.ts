import { NextRequest, NextResponse } from 'next/server'
import { promoteToAdmin } from '@/app/lib/role-manager'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, secret } = body

    // Simple protection avec un secret dans les variables d'environnement
    if (secret !== process.env.ADMIN_PROMOTION_SECRET) {
      return NextResponse.json({ error: 'Secret invalide' }, { status: 403 })
    }

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    const success = await promoteToAdmin(email)
    
    if (success) {
      return NextResponse.json({ 
        message: `${email} promu admin avec succès`,
        success: true 
      })
    } else {
      return NextResponse.json({ 
        error: 'Erreur lors de la promotion admin' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Erreur promotion admin:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
