import { z } from "zod";

// Schéma de validation pour les utilisateurs
const schema = z.object({
  name: z.string().min(3, "Name is required").max(100, "Name is too long"),
  price: z.number().min(10, "Price must be a positive number"),
});

export default schema;
