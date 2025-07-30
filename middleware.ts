import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// Définir les routes qui nécessitent une authentification
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin/roles(.*)',
  '/products/add(.*)',
  '/api/users(.*)',
  '/api/products(.*)',
  '/api/admin/roles(.*)',
  '/api/sync-user(.*)',
  '/api/user/role(.*)',
  '/api/upload/image(.*)'
]);

// Définir les routes publiques dans admin (pas de protection)
const isPublicAdminRoute = createRouteMatcher([
  '/admin/promote-first'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Permettre l'accès aux routes publiques admin sans authentification
  if (isPublicAdminRoute(req)) {
    return; // Laisser passer sans protection
  }
  
  // Protéger les autres routes définies ci-dessus
  if (isProtectedRoute(req)) {
    await auth.protect();
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
