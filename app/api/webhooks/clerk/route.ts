import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'

export async function POST(req: Request) {
  console.log('🎯 Webhook Clerk reçu à:', new Date().toISOString())
  
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('❌ WEBHOOK_SECRET manquant')
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    console.log('🚀 INSCRIPTION DÉTECTÉE:', {
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
        },
      })
      
      console.log('✅ UTILISATEUR CRÉÉ EN BASE:', {
        dbId: newUser.id,
        email: newUser.email,
        clerkId: newUser.clerkUserId
      })
      
    } catch (error) {
      console.error('❌ ERREUR CRÉATION UTILISATEUR:', error)
      return new Response('Error creating user', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data

    console.log('🔄 Webhook received: user.updated for', email_addresses[0]?.email_address)

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
      
      console.log(`✅ User updated in database: ${email_addresses[0]?.email_address}`)
    } catch (error) {
      console.error('❌ Error updating user in database:', error)
      return new Response('Error updating user', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    // Delete user from database
    try {
      await prisma.user.deleteMany({
        where: {
          clerkUserId: id,
        },
      })
      
      console.log(`User deleted from database: ${id}`)
    } catch (error) {
      console.error('Error deleting user from database:', error)
      return new Response('Error deleting user', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
}
