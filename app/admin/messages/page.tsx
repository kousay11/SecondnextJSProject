import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'
import MessagesManager from './components/MessagesManager'

export default async function AdminMessagesPage() {
  // Vérifier que l'utilisateur est connecté et admin
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    redirect('/sign-in?redirect=/admin/messages')
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    select: { role: true, name: true }
  })

  if (!dbUser || dbUser.role !== 'ADMIN') {
    redirect('/?error=access-denied')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📧 Gestion des Messages
          </h1>
          <p className="text-gray-600">
            Bonjour {dbUser.name}, voici tous les messages reçus de vos utilisateurs.
          </p>
        </div>

        <MessagesManager />
      </div>
    </div>
  )
}
