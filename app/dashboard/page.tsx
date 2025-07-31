import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/prisma/client';
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // Obtenir les informations d'authentification
  const { userId } = await auth();
  const user = await currentUser();

  // Rediriger vers la page de connexion si non authentifié
  if (!userId) {
    redirect('/sign-in');
  }

  // Récupérer l'utilisateur de la base de données (ajouté par webhook)
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId }
  });

  return (
    <div className="container mx-auto p-6">
      <DashboardClient />
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
        
        {user && (
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
            <p><strong>Clerk User ID:</strong> {userId}</p>
            {dbUser && (
              <>
                <p><strong>Database User ID:</strong> {dbUser.id}</p>
                <p><strong>Followers:</strong> {dbUser.followers}</p>
                <p><strong>Registered At:</strong> {dbUser.registeredAt.toLocaleDateString()}</p>
                <p><strong>Status:</strong> {dbUser.isActive ? 'Active' : 'Inactive'}</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Users Management</h3>
          <p className="text-blue-600">Manage users in your application</p>
          <Link href="/users" className="inline-block mt-2 text-blue-500 hover:underline">
            Go to Users →
          </Link>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Products Management</h3>
          <p className="text-green-600">Manage products in your application</p>
          <Link href="/products" className="inline-block mt-2 text-green-500 hover:underline">
            Go to Products →
          </Link>
        </div>
      </div>
    </div>
  );
}
