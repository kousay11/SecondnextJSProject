import { NextRequest, NextResponse } from 'next/server'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'

export async function GET() {
  return Response.json({ 
    message: "Webhook Clerk endpoint is working!",
    timestamp: new Date().toISOString()
  })
}

export async function POST(req: NextRequest) {
  console.log('🚀 WEBHOOK SIMPLE Clerk reçu à:', new Date().toISOString())
  
  try {
    // Récupération du payload
    const payload = await req.json() as WebhookEvent
    console.log('📦 Event type reçu:', payload.type)
    
    // Handle the webhook
    const eventType = payload.type

    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = payload.data

      console.log('� INSCRIPTION DÉTECTÉE (SIMPLE):', {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        name: `${first_name} ${last_name}`
      })

      // Create user in database
      try {
        const newUser = await prisma.user.create({
          data: {
            clerkUserId: id,
            email: email_addresses[0]?.email_address || '',
            name: `${first_name || ''} ${last_name || ''}`.trim() || 'Utilisateur',
            role: 'CLIENT', // Rôle par défaut
          },
        })
        
        console.log('✅ UTILISATEUR CRÉÉ EN BASE (SIMPLE):', {
          dbId: newUser.id,
          email: newUser.email,
          clerkId: newUser.clerkUserId
        })
        
      } catch (error) {
        console.error('❌ ERREUR CRÉATION UTILISATEUR (SIMPLE):', error)
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
      }
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = payload.data

      console.log('🔄 MISE À JOUR UTILISATEUR (SIMPLE):', email_addresses[0]?.email_address)

      // Update user in database
      try {
        await prisma.user.updateMany({
          where: {
            clerkUserId: id,
          },
          data: {
            email: email_addresses[0]?.email_address || '',
            name: `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown User',
          },
        })
        
        console.log(`✅ Utilisateur mis à jour (SIMPLE): ${email_addresses[0]?.email_address}`)
      } catch (error) {
        console.error('❌ Erreur mise à jour utilisateur (SIMPLE):', error)
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 })
      }
    }

    if (eventType === 'user.deleted') {
      const { id } = payload.data

      // Delete user from database
      try {
        await prisma.user.deleteMany({
          where: {
            clerkUserId: id,
          },
        })
        
        console.log(`✅ Utilisateur supprimé (SIMPLE): ${id}`)
      } catch (error) {
        console.error('❌ Erreur suppression utilisateur (SIMPLE):', error)
        return NextResponse.json({ error: 'Error deleting user' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ ERREUR WEBHOOK SIMPLE:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
