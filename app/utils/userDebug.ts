import { prisma } from '@/prisma/client'

export async function debugUserData(email: string) {
  try {
    console.log('\n=== 🔍 DEBUG USER DATA ===')
    console.log('Email recherché:', email)
    
    // Rechercher par email
    const userByEmail = await prisma.user.findUnique({
      where: { email: email }
    })
    
    console.log('Utilisateur trouvé par email:', userByEmail)
    
    // Lister tous les utilisateurs
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        name: true,
        registeredAt: true
      }
    })
    
    console.log('Tous les utilisateurs en base:', allUsers)
    console.log('Total utilisateurs:', allUsers.length)
    
    // Chercher les utilisateurs sans clerkUserId (orphelins)
    const orphanUsers = allUsers.filter(user => !user.clerkUserId)
    console.log('Utilisateurs orphelins (sans clerkUserId):', orphanUsers)
    
    return {
      userByEmail,
      allUsers,
      orphanUsers,
      totalUsers: allUsers.length
    }
    
  } catch (error) {
    console.error('Erreur lors du debug:', error)
    return null
  }
}

export async function cleanOrphanUsers() {
  try {
    console.log('\n=== 🧹 NETTOYAGE UTILISATEURS ORPHELINS ===')
    
    // Supprimer les utilisateurs sans clerkUserId
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        clerkUserId: null
      }
    })
    
    console.log('Utilisateurs orphelins supprimés:', deletedUsers.count)
    return deletedUsers.count
    
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error)
    return 0
  }
}

export async function forceCreateUser(clerkUserId: string, email: string, name: string) {
  try {
    console.log('\n=== 🔧 CRÉATION FORCÉE UTILISATEUR ===')
    
    // Supprimer d'abord tout utilisateur existant avec cet email
    await prisma.user.deleteMany({
      where: { email: email }
    })
    
    // Créer le nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        clerkUserId,
        email,
        name: name || 'Utilisateur'
      }
    })
    
    console.log('Utilisateur créé avec succès:', newUser)
    return newUser
    
  } catch (error) {
    console.error('Erreur lors de la création forcée:', error)
    return null
  }
}
