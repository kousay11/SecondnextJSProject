// Import du client Prisma généré automatiquement
// Le chemin d'import doit correspondre à la configuration de sortie dans schema.prisma
import { PrismaClient } from "@/app/generated/prisma"; // Adjust the import path as the same as output schema

// Extension du type global pour inclure une instance Prisma
// Cela permet de réutiliser la même instance à travers l'application
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Création d'une instance Prisma singleton
// Réutilise l'instance existante (globalForPrisma.prisma) si elle existe,
// sinon crée une nouvelle instance PrismaClient
export const prisma =
  globalForPrisma.prisma || new PrismaClient();

// En mode développement, stocke l'instance Prisma globalement
// Cela évite de créer plusieurs connexions à la base de données lors du hot reload
// En production, cette ligne ne s'exécute pas pour des raisons de performance
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
