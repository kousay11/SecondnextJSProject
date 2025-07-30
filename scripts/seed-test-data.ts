import { prisma } from '../prisma/client'

async function seedTestData() {
  console.log('🌱 Ajout de données de test...')

  try {
    // Créer un utilisateur de test s'il n'existe pas
    let testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    })

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Utilisateur Test',
          role: 'CLIENT',
          clerkUserId: 'test-clerk-id-123'
        }
      })
      console.log('✅ Utilisateur test créé:', testUser.name)
    } else {
      console.log('⚠️ Utilisateur test existe déjà')
    }

    // Créer des messages de test
    const testMessages = [
      {
        userId: testUser.id,
        phone: '+33123456789',
        subject: 'GENERAL_INQUIRY' as const,
        message: 'Bonjour, j\'aimerais avoir des informations sur vos services. Pouvez-vous m\'expliquer comment fonctionne votre système de gestion des utilisateurs ?',
        status: 'PENDING' as const
      },
      {
        userId: testUser.id,
        phone: '+33987654321',
        subject: 'TECHNICAL_SUPPORT' as const,
        message: 'J\'ai un problème technique avec l\'upload d\'images. L\'application ne semble pas accepter mes fichiers même s\'ils sont en format JPG.',
        status: 'PENDING' as const
      },
      {
        userId: testUser.id,
        phone: '+33555123456',
        subject: 'PRODUCT_QUESTION' as const,
        message: 'Est-ce que vos produits sont compatibles avec les dernières versions de navigateurs ? J\'utilise Chrome et Firefox.',
        status: 'PROCESSED' as const
      }
    ]

    for (const messageData of testMessages) {
      const existingMessage = await prisma.message.findFirst({
        where: { 
          userId: messageData.userId,
          message: messageData.message
        }
      })

      if (!existingMessage) {
        const message = await prisma.message.create({
          data: messageData,
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        })
        console.log('✅ Message créé:', message.subject)
      } else {
        console.log('⚠️ Message existe déjà')
      }
    }

    console.log('🎉 Données de test ajoutées avec succès!')

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données:', error)
  }
}

seedTestData()
