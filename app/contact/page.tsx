import React from 'react';
import { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/prisma/client';
import ContactForm from './components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact - Team Office',
  description: 'Contactez Team Office pour toutes vos questions concernant nos fournitures scolaires et services.',
};

const ContactPage = async () => {
  // Vérifier si l'utilisateur est connecté (optionnel)
  const clerkUser = await currentUser();
  
  let dbUser = null;
  if (clerkUser) {
    dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      select: { 
        id: true,
        name: true, 
        email: true 
      }
    });
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-6 animate-gradient-x">
            Contactez-nous
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Nos Coordonnées
              </h2>
              
              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Adresse</h3>
                    <p className="text-gray-600">
                      123 Avenue de l&apos;Éducation<br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">📞</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Téléphone</h3>
                    <p className="text-gray-600">
                      <a href="tel:+33123456789" className="hover:text-blue-600 transition-colors">
                        +33 1 23 45 67 89
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">✉️</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:contact@teamoffice.fr" className="hover:text-blue-600 transition-colors">
                        contact@teamoffice.fr
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🕒</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Horaires d&apos;ouverture</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Lundi - Vendredi : 8h00 - 18h00</p>
                      <p>Samedi : 9h00 - 17h00</p>
                      <p>Dimanche : Fermé</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="card p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Envoyez-nous un message
              </h2>
              
              <ContactForm 
                user={clerkUser ? {
                  firstName: clerkUser.firstName,
                  lastName: clerkUser.lastName,
                  emailAddresses: clerkUser.emailAddresses.map(e => ({ emailAddress: e.emailAddress }))
                } : null} 
                dbUser={dbUser} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Questions Fréquentes
          </h2>
          
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                🚚 Quels sont vos délais de livraison ?
              </h3>
              <p className="text-gray-600">
                Nous livrons sous 2-3 jours ouvrés en France métropolitaine. Pour les commandes passées avant 14h, 
                l&apos;expédition se fait le jour même.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                💳 Quels moyens de paiement acceptez-vous ?
              </h3>
              <p className="text-gray-600">
                Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal, virements bancaires 
                et chèques pour les commandes importantes.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                📦 Puis-je retourner un produit ?
              </h3>
              <p className="text-gray-600">
                Oui, vous disposez de 14 jours pour retourner un produit non utilisé dans son emballage d&apos;origine. 
                Les frais de retour sont à votre charge sauf en cas de défaut.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                🎓 Proposez-vous des remises pour les établissements scolaires ?
              </h3>
              <p className="text-gray-600">
                Absolument ! Nous avons des tarifs préférentiels pour les écoles, collèges, lycées et universités. 
                Contactez-nous pour obtenir un devis personnalisé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Une question urgente ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Notre équipe de support est disponible pour vous aider immédiatement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+33123456789"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              📞 Appelez-nous maintenant
            </a>
            <a
              href="mailto:contact@teamoffice.fr"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              ✉️ Envoyez un email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;