// gerer les rôles des utilisateurs
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'
import { UserRole } from '@/app/generated/prisma'

/**
 * Vérifie si l'utilisateur connecté a le rôle spécifié
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  try {
    const user = await currentUser()
    if (!user) return false

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
      select: { role: true }
    })

    return dbUser?.role === requiredRole
  } catch (error) {
    console.error('Erreur vérification rôle:', error)
    return false
  }
}

/**
 * Vérifie si l'utilisateur connecté est admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole(UserRole.ADMIN)
}

/**
 * Vérifie si l'utilisateur connecté est client
 */
export async function isClient(): Promise<boolean> {
  return hasRole(UserRole.CLIENT)
}

/**
 * Récupère le rôle de l'utilisateur connecté
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const user = await currentUser()
    if (!user) return null

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
      select: { role: true }
    })

    return dbUser?.role || null
  } catch (error) {
    console.error('Erreur récupération rôle:', error)
    return null
  }
}

/**
 * Met à jour le rôle d'un utilisateur (réservé aux admins)
 */
export async function updateUserRole(userId: number, newRole: UserRole): Promise<boolean> {
  try {
    // Vérifier que l'utilisateur actuel est admin
    const isCurrentUserAdmin = await isAdmin()
    if (!isCurrentUserAdmin) {
      console.error('Seuls les admins peuvent modifier les rôles')
      return false
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    })

    console.log(`✅ Rôle mis à jour pour l'utilisateur ${userId}: ${newRole}`)
    return true
  } catch (error) {
    console.error('Erreur mise à jour rôle:', error)
    return false
  }
}

/**
 * Promouvoir un utilisateur en admin (via email)
 */
export async function promoteToAdmin(email: string): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { email },
      data: { role: UserRole.ADMIN }
    })

    console.log(`✅ ${email} promu admin avec succès`)
    return true
  } catch (error) {
    console.error('Erreur promotion admin:', error)
    return false
  }
}

/**
 * Récupère tous les utilisateurs avec leur rôle
 */
export async function getAllUsersWithRoles() {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        registeredAt: true,
        clerkUserId: true
      },
      orderBy: {
        registeredAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error)
    return []
  }
}
