import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// Définir les routes qui nécessitent une authentification
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/api/users(.*)',
  '/api/products(.*)'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Protéger les routes définies ci-dessus
  if (isProtectedRoute(req)) {
    const { userId } = await auth.protect();
    
    // Si l'utilisateur est connecté et que ce n'est pas une API route, synchroniser
    if (userId && !req.nextUrl.pathname.startsWith('/api/')) {
      try {
        // Faire un appel à notre API de synchronisation
        const baseUrl = req.nextUrl.origin;
        await fetch(`${baseUrl}/api/sync-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userId}`
          },
          body: JSON.stringify({ userId })
        });
      } catch (error) {
        console.log('Sync error (non-blocking):', error);
        // Ne pas bloquer la navigation même si la sync échoue
      }
    }
  }
});

export const config = {
  matcher: [
    // Ignorer les fichiers Next.js internes et les ressources statiques
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Toujours exécuter pour les routes API
    '/(api|trpc)(.*)',
  ],
};
