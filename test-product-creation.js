// Script de test pour la création de produit
// À exécuter avec Node.js pour tester l'API

const testProductData = {
  name: "Produit Test Upload",
  description: "Description du produit test",
  price: 29.99,
  imageProduct: "/uploads/products/product-1753799492934.jpg" // Image existante
};

console.log("Données de test:", JSON.stringify(testProductData, null, 2));

// Test du schéma Zod côté client
const testValidation = () => {
  // Simuler la validation Zod
  if (!testProductData.name || testProductData.name.length === 0) {
    console.error("❌ Nom requis");
    return false;
  }
  
  if (testProductData.name.length > 100) {
    console.error("❌ Nom trop long");
    return false;
  }
  
  if (testProductData.price < 0) {
    console.error("❌ Prix doit être positif");
    return false;
  }
  
  console.log("✅ Validation réussie");
  return true;
};

testValidation();
