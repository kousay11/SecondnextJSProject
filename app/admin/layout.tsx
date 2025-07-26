import React, { ReactNode } from 'react'

// Interface pour définir les props du composant AdminLayout
interface Props {
  children: ReactNode; // ReactNode permet d'accepter tout élément React valide
}

// Layout spécialisé pour la section admin
// Ce composant sera automatiquement appliqué à toutes les pages dans le dossier /admin
const AdminLayout = ({ children }:Props) => {
  return (
    // Container principal avec flexbox pour organiser la sidebar et le contenu horizontalement
    <div className="flex">
        {/* Sidebar admin avec un style gris et du padding */}
        <aside className='bg-slate-200 p-5 mr-5'> 
          <h2>Admin Sidebar</h2>
        </aside>
        {/* Zone où sera rendu le contenu des pages enfants */}
        <div>{children}</div>
    </div>
  )
}

export default AdminLayout