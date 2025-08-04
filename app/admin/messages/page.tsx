import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/client'
import AdminSidebar from './components/AdminSidebar'

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
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
    </div>
  )
}
