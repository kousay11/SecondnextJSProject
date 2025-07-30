import { prisma } from '../prisma/client'

async function seedProducts() {
  console.log('🌱 Début du seeding des produits de librairie...')

  const products = [
    {
      name: 'Le Petit Prince',
      description: 'Classique intemporel d\'Antoine de Saint-Exupéry, une fable poétique et philosophique qui nous rappelle l\'importance de l\'enfance et de l\'imagination.',
      price: 8.90,
      imageProduct: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop'
    },
    {
      name: '1984',
      description: 'Chef-d\'œuvre dystopique de George Orwell qui dépeint une société totalitaire et explore les thèmes de la surveillance et de la liberté.',
      price: 12.50,
      imageProduct: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&h=500&fit=crop'
    },
    {
      name: 'L\'Étranger',
      description: 'Roman emblématique d\'Albert Camus qui explore l\'absurdité de l\'existence à travers l\'histoire de Meursault.',
      price: 10.20,
      imageProduct: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop'
    },
    {
      name: 'Harry Potter à l\'École des Sorciers',
      description: 'Premier tome de la saga magique de J.K. Rowling qui suit les aventures du jeune sorcier Harry Potter à Poudlard.',
      price: 15.90,
      imageProduct: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop'
    },
    {
      name: 'Les Misérables',
      description: 'Œuvre monumentale de Victor Hugo qui dépeint la France du XIXe siècle à travers l\'histoire de Jean Valjean et de sa quête de rédemption.',
      price: 18.50,
      imageProduct: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop'
    },
    {
      name: 'Sapiens : Une brève histoire de l\'humanité',
      description: 'Essai captivant de Yuval Noah Harari qui retrace l\'évolution de l\'Homo sapiens et analyse les grandes révolutions de l\'humanité.',
      price: 22.90,
      imageProduct: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=500&h=500&fit=crop'
    },
    {
      name: 'Le Seigneur des Anneaux - La Communauté de l\'Anneau',
      description: 'Premier tome de l\'épopée fantasy de J.R.R. Tolkien, une aventure épique dans la Terre du Milieu.',
      price: 16.80,
      imageProduct: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop'
    },
    {
      name: 'Cahier d\'écriture créative',
      description: 'Carnet avec exercices et prompts pour développer votre créativité littéraire et améliorer votre style d\'écriture.',
      price: 13.20,
      imageProduct: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=500&h=500&fit=crop'
    },
    {
      name: 'Atlas du Monde 2024',
      description: 'Atlas géographique complet avec cartes détaillées, statistiques actualisées et informations sur tous les pays du monde.',
      price: 29.90,
      imageProduct: 'https://images.unsplash.com/photo-1597149830851-6d9b5e9c7905?w=500&h=500&fit=crop'
    },
    {
      name: 'Dictionnaire Larousse Illustré 2024',
      description: 'Dictionnaire de référence avec 63 000 mots, expressions et locutions, enrichi d\'illustrations et de cartes.',
      price: 34.50,
      imageProduct: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop'
    }
  ]

  for (const product of products) {
    try {
      const existingProduct = await prisma.product.findFirst({
        where: { name: product.name }
      })

      if (!existingProduct) {
        const createdProduct = await prisma.product.create({
          data: product
        })
        console.log(`✅ Produit créé: ${createdProduct.name} (ID: ${createdProduct.id})`)
      } else {
        console.log(`⚠️ Produit déjà existant: ${product.name}`)
      }
    } catch (error) {
      console.error(`❌ Erreur création produit ${product.name}:`, error)
    }
  }

  console.log('🎉 Seeding des produits de librairie terminé!')
}

seedProducts()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
