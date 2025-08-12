// // middleware-security.ts - À implémenter URGENT
// import { NextRequest, NextResponse } from 'next/server'
// import { rateLimit } from '@/app/lib/rate-limit'

// // Rate limiting par IP
// const limiter = rateLimit({
//   interval: 60 * 1000, // 1 minute
//   uniqueTokenPerInterval: 500, // 500 IPs différentes
// })

// // Fonction pour extraire l'IP de la requête
// function getClientIP(request: NextRequest): string {
//   // Vérifier les headers de proxy en priorité
//   const forwarded = request.headers.get('x-forwarded-for');
//   if (forwarded) {
//     return forwarded.split(',')[0].trim();
//   }
  
//   const realIP = request.headers.get('x-real-ip');
//   if (realIP) {
//     return realIP;
//   }
  
//   // Fallback vers l'IP de connexion (disponible en production)
//   return request.headers.get('x-forwarded-for') || 
//          request.headers.get('remote-addr') || 
//          '127.0.0.1';
// }

// export async function securityMiddleware(request: NextRequest) {
//   const ip = getClientIP(request);
  
//   try {
//     // Limiter les requêtes par IP
//     await limiter.check(10, ip) // 10 requêtes max par minute
    
//     // Ajouter headers de sécurité
//     const response = NextResponse.next()
    
//     response.headers.set('X-Frame-Options', 'DENY')
//     response.headers.set('X-Content-Type-Options', 'nosniff')
//     response.headers.set('X-XSS-Protection', '1; mode=block')
//     response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
//     response.headers.set('X-Powered-By', '') // Masquer la technologie utilisée
    
//     return response
    
//   } catch {
//     return NextResponse.json(
//       { error: 'Rate limit exceeded' },
//       { status: 429 }
//     )
//   }
// }
