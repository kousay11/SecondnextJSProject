// // Rate limiting simple pour Next.js
// interface RateLimitConfig {
//   interval: number; // Fenêtre de temps en ms
//   uniqueTokenPerInterval: number; // Nombre d'IPs uniques autorisées
// }

// interface RateLimitResult {
//   check: (limit: number, token: string) => Promise<void>;
// }

// // Cache en mémoire pour le rate limiting (simple, pour production utiliser Redis)
// const requestCounts = new Map<string, { count: number; resetTime: number }>();

// export function rateLimit(config: RateLimitConfig): RateLimitResult {
//   return {
//     async check(limit: number, token: string): Promise<void> {
//       const now = Date.now();
      
//       // Nettoyer les anciennes entrées
//       for (const [key, value] of requestCounts.entries()) {
//         if (value.resetTime < now) {
//           requestCounts.delete(key);
//         }
//       }
      
//       // Récupérer ou créer l'entrée pour ce token (IP)
//       let tokenData = requestCounts.get(token);
      
//       if (!tokenData || tokenData.resetTime < now) {
//         // Nouvelle fenêtre de temps
//         tokenData = {
//           count: 0,
//           resetTime: now + config.interval
//         };
//       }
      
//       // Vérifier si la limite est dépassée
//       if (tokenData.count >= limit) {
//         throw new Error(`Rate limit exceeded: ${limit} requests per ${config.interval}ms`);
//       }
      
//       // Incrémenter le compteur
//       tokenData.count++;
//       requestCounts.set(token, tokenData);
//     }
//   };
// }
