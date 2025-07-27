import { prisma } from '@/prisma/client'

/**
 * Script pour promouvoir un utilisateur en admin
 * Utiliser avec : npm run promote-admin your-email@example.com
 */

async function promoteFirstAdmin() {
  const email = process.argv[2]
  
  if (!email) {
    console.error('❌ Veuillez fournir un email en paramètre')
    console.log('Usage: npm run promote-admin your-email@example.com')
    process.exit(1)
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })

    console.log('✅ Utilisateur promu admin avec succès:')
    console.log('📧 Email:', user.email)
    console.log('👤 Nom:', user.name)
    console.log('👑 Rôle:', user.role)
    console.log('🆔 ID:', user.id)
    
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      console.error('❌ Utilisateur non trouvé avec cet email:', email)
    } else {
      console.error('❌ Erreur lors de la promotion:', error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

promoteFirstAdmin()
