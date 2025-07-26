import Link from 'next/link';
import React from 'react';
import { UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

const Navbar = () => {
  return (
    <div className='flex justify-between items-center bg-amber-800 p-3'>
      <div className='flex items-center'>
        <span className='text-white mr-5'>Navbar</span>
        <Link href="/" className='text-white mr-5 hover:underline'>Next.js</Link>
        <Link href="/users" className='text-white mr-5 hover:underline'>Users</Link>
        <Link href="/products" className='text-white mr-5 hover:underline'>Products</Link>
        <Link href="/auto-sync" className='text-white mr-5 hover:underline'>Auto-Sync</Link>
      </div>
      
      <div className='flex items-center space-x-4'>
        {/* Afficher le bouton de connexion si l'utilisateur n'est pas connecté */}
        <SignedOut>
          <SignInButton>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        
        {/* Afficher le bouton utilisateur si l'utilisateur est connecté */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;