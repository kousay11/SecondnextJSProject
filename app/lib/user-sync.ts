import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'

export async function syncUserToDatabase() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return null
    }

    // Check if user already exists in database
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    })

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: {
          clerkUserId: user.id,
        },
        data: {
          email: user.emailAddresses[0]?.emailAddress || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
        },
      })
      return updatedUser
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          clerkUserId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
        },
      })
      return newUser
    }
  } catch (error) {
    console.error('Error syncing user to database:', error)
    return null
  }
}

export async function getUserFromDatabase(clerkUserId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUserId,
      },
    })
    return user
  } catch (error) {
    console.error('Error getting user from database:', error)
    return null
  }
}
