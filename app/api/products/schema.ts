import { z } from "zod";

// Schéma de validation pour les produits
const schema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  description: z.string().optional().nullable().or(z.literal("")),
  price: z.number().min(0, "Le prix doit être positif"),
  imageProduct: z.string().optional().nullable().or(z.literal("")),
});

export default schema;
