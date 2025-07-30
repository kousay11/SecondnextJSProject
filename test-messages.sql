-- Insertion de quelques messages de test
-- D'abord, vérifions qu'il y a des utilisateurs

-- Pour ajouter des messages de test, vous pouvez exécuter ces requêtes SQL dans votre base de données
-- ou utiliser l'interface d'ajout de message

-- Supposons qu'il y a un utilisateur avec l'ID 1
INSERT INTO Message (userId, phone, subject, message, status, createdAt) VALUES 
(1, '+33123456789', 'GENERAL_INQUIRY', 'Bonjour, j\'aimerais avoir des informations sur vos services.', 'PENDING', NOW()),
(1, '+33987654321', 'TECHNICAL_SUPPORT', 'J\'ai un problème technique avec votre application.', 'PENDING', NOW()),
(1, '+33555666777', 'PRODUCT_QUESTION', 'Quelles sont les caractéristiques du produit XYZ?', 'PROCESSED', NOW());

-- Vérification
SELECT * FROM Message;
SELECT * FROM User;
