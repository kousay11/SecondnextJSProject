
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
      {/* Hero Section with Video */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-30"
          >
            <source src="/Animated_commercial_in_202505301558.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas les vidéos HTML5.
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-purple-900/60 to-orange-900/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-blue-400 to-green-400 bg-clip-text text-transparent animate-pulse">
                Team Office
              </span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-orange-200">
              📚 Votre Librairie de Fournitures Scolaires 📚
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Découvrez notre collection complète de fournitures scolaires, livres, et matériel éducatif pour tous les niveaux. 
              Qualité, prix attractifs et service client exceptionnel !
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/products"
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-bounce"
              >
                🛒 Voir Nos Produits
              </Link>
              <Link 
                href="/about"
                className="border-3 border-blue-400 bg-blue-400/20 backdrop-blur-sm text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-blue-500 hover:border-blue-500 transition-all duration-300"
              >
                📖 En Savoir Plus
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating School Elements */}
        <div className="absolute top-20 left-10 text-6xl animate-bounce">📚</div>
        <div className="absolute top-40 right-20 text-5xl animate-pulse">✏️</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-ping">🎒</div>
        <div className="absolute bottom-40 right-1/3 text-5xl animate-bounce">📐</div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-4">
            🎯 Nos Catégories Principales
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16">
            Tout ce dont vous avez besoin pour une rentrée scolaire réussie !
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Catégorie 1 */}
            <div className="group bg-gradient-to-br from-orange-100 to-orange-200 p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 border-orange-300">
              <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                📚
              </div>
              <h3 className="text-2xl font-bold text-orange-800 mb-4 text-center">Livres Scolaires</h3>
              <p className="text-orange-700 text-center">Manuels scolaires pour tous les niveaux, de la maternelle au lycée. Éditions récentes et programmes officiels.</p>
              <div className="mt-6 text-center">
                <Link href="/products?category=books" className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors">
                  Voir les livres
                </Link>
              </div>
            </div>

            {/* Catégorie 2 */}
            <div className="group bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 border-blue-300">
              <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                ✏️
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">Fournitures</h3>
              <p className="text-blue-700 text-center">Stylos, crayons, cahiers, classeurs... Tout le matériel nécessaire pour écrire et organiser vos cours.</p>
              <div className="mt-6 text-center">
                <Link href="/products?category=supplies" className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
                  Voir les fournitures
                </Link>
              </div>
            </div>

            {/* Catégorie 3 */}
            <div className="group bg-gradient-to-br from-green-100 to-green-200 p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 border-green-300">
              <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                🎒
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">Sacs & Accessoires</h3>
              <p className="text-green-700 text-center">Cartables, sacs à dos, trousses et accessoires scolaires de qualité pour transporter vos affaires.</p>
              <div className="mt-6 text-center">
                <Link href="/products?category=bags" className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors">
                  Voir les sacs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            🏆 Team Office en Chiffres
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-xl opacity-90">📚 Livres disponibles</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">15K+</div>
              <div className="text-xl opacity-90">✏️ Étudiants satisfaits</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-xl opacity-90">⭐ Taux de satisfaction</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
              <div className="text-xl opacity-90">🎒 Références produits</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-blue-50 to-green-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 text-4xl animate-spin opacity-20">📚</div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce opacity-20">✏️</div>
        <div className="absolute bottom-10 left-1/4 text-5xl animate-pulse opacity-20">🎒</div>
        <div className="absolute bottom-20 right-1/3 text-4xl animate-ping opacity-20">📐</div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              Prêt pour la Rentrée ? 🎓
            </span>
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Rejoignez des milliers d&apos;étudiants qui font confiance à Team Office pour leurs fournitures scolaires. 
            Qualité garantie, livraison rapide et prix imbattables !
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/products"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-full font-semibold text-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 inline-block"
            >
              🛒 Commander Maintenant
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-blue-500 bg-blue-500/10 text-blue-600 px-12 py-4 rounded-full font-semibold text-xl hover:bg-blue-500 hover:text-white transition-all duration-300 inline-block"
            >
              📞 Nous Contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
