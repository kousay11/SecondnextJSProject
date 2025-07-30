"use client";

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import AdminPromotionModal from './components/AdminPromotionModal';
import { useUserRole } from './hooks/useUserRole';
import { useUnreadMessages } from './hooks/useUnreadMessages';

// Composant AuthDropdown
const AuthDropdown = ({ onShowAdminModal }: { onShowAdminModal: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
      >
        Se Connecter
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="py-2">
            <Link
              href="/sign-in"
              className="flex px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">👤</span>
              <div>
                <div className="font-medium">Se Connecter</div>
                <div className="text-sm text-gray-500">Compte existant</div>
              </div>
            </Link>
            
            <div className="border-t border-gray-100"></div>
            
            <button
              onClick={() => {
                setIsOpen(false)
                onShowAdminModal()
              }}
              className="flex px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 items-center gap-3 w-full text-left"
            >
              <span className="text-lg">👑</span>
              <div>
                <div className="font-medium">Créer Compte Admin</div>
                <div className="text-sm text-gray-500">Premier administrateur</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const { role } = useUserRole();
  const { unreadCount } = useUnreadMessages();

  return (
    <>
      <nav className='bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 shadow-lg sticky top-0 z-50'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo avec animation */}
            <div className='flex items-center'>
              <Link href="/" className='group'>
                <span className='text-2xl font-bold text-white animate-pulse hover:animate-none transition-all duration-300 group-hover:scale-110'>
                  <span className='bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x'>
                    Team Office
                  </span>
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className='hidden md:flex items-center space-x-1'>
              <Link href="/" className='nav-link'>
                🏠 Accueil
              </Link>
              <Link href="/products" className='nav-link'>
                📚 Produits
              </Link>
              <Link href="/about" className='nav-link'>
                ℹ️ À Propos
              </Link>
              
              {/* Contact visible pour tous sauf les admins */}
              {role !== 'ADMIN' && (
                <Link href="/contact" className='nav-link'>
                  📞 Contact
                </Link>
              )}
              
              <SignedIn>
                <Link href="/dashboard" className='nav-link'>
                  📊 Dashboard
                </Link>
                {/* Afficher "Utilisateurs" seulement pour les ADMIN */}
                {role === 'ADMIN' && (
                  <Link href="/admin-check" className='nav-link'>
                    🔍 Admin Check
                  </Link>
                )}
              </SignedIn>
            </div>
            
            {/* Authentication */}
            <div className='flex items-center space-x-4'>
              <SignedOut>
                <AuthDropdown onShowAdminModal={() => setShowAdminModal(true)} />
              </SignedOut>
              
              <SignedIn>
                {/* Icône de messages pour les admins */}
                {role === 'ADMIN' && (
                  <Link 
                    href="/admin/messages" 
                    className="relative p-2 text-white hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
                  >
                    <span className="text-xl">📧</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                )}
                
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-white ring-offset-2 ring-offset-transparent"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      <AdminPromotionModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
    </>
  );
};

export default Navbar;