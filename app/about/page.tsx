import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À Propos - Team Office',
  description: 'Découvrez Team Office, votre partenaire de confiance pour tous vos besoins en fournitures scolaires et de bureau.',
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-6 animate-gradient-x">
            À Propos de Team Office
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Votre partenaire de confiance pour tous vos besoins en fournitures scolaires et de bureau depuis plus de 10 ans.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-float">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Chez Team Office, nous nous engageons à fournir des produits de qualité supérieure 
                pour accompagner la réussite éducative et professionnelle de nos clients. Nous croyons 
                que les bons outils font la différence dans l&apos;apprentissage et le travail.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Notre équipe passionnée travaille sans relâche pour sélectionner les meilleures 
                fournitures, offrir un service client exceptionnel et maintenir des prix compétitifs.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-all duration-300">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-4">Excellence & Innovation</h3>
                <p className="text-blue-100">
                  Nous nous efforçons constamment d&apos;innover et d&apos;améliorer notre service 
                  pour répondre aux besoins évolutifs de nos clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Nos Valeurs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center p-8">
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Confiance</h3>
              <p className="text-gray-600">
                Nous bâtissons des relations durables basées sur la transparence, 
                l&apos;honnêteté et la fiabilité.
              </p>
            </div>
            
            <div className="card text-center p-8">
              <div className="text-5xl mb-6">⭐</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Qualité</h3>
              <p className="text-gray-600">
                Nous sélectionnons rigoureusement nos produits pour garantir 
                la meilleure qualité à nos clients.
              </p>
            </div>
            
            <div className="card text-center p-8">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Innovation</h3>
              <p className="text-gray-600">
                Nous adoptons les dernières technologies pour améliorer 
                constamment votre expérience d&apos;achat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Notre Équipe
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl text-white animate-pulse-glow">
                👨‍💼
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Équipe Direction</h3>
              <p className="text-gray-600">Leadership expérimenté et vision stratégique</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl text-white animate-pulse-glow">
                🛒
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Équipe Ventes</h3>
              <p className="text-gray-600">Experts en conseil et service client</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl text-white animate-pulse-glow">
                📦
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Équipe Logistique</h3>
              <p className="text-gray-600">Gestion efficace des stocks et livraisons</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Team Office en Chiffres
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-float">
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <p className="text-blue-100">Années d&apos;expérience</p>
            </div>
            <div className="animate-float">
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <p className="text-blue-100">Clients satisfaits</p>
            </div>
            <div className="animate-float">
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <p className="text-blue-100">Produits disponibles</p>
            </div>
            <div className="animate-float">
              <div className="text-4xl md:text-5xl font-bold mb-2">99%</div>
              <p className="text-blue-100">Taux de satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Rejoignez la Famille Team Office
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Découvrez notre gamme complète de produits et bénéficiez d&apos;un service exceptionnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary">
              Voir nos Produits
            </Link>
            <Link href="/contact" className="btn-secondary">
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
