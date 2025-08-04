import React, { ReactNode } from 'react'

// Interface pour définir les props du composant AdminLayout
interface Props {
  children: ReactNode; // ReactNode permet d'accepter tout élément React valide
}

// Layout spécialisé pour la section admin
// Ce composant sera automatiquement appliqué à toutes les pages dans le dossier /admin
const AdminLayout = ({ children }:Props) => {
  return (
    // Container principal sans l'ancien sidebar
    <div className="w-full">
      {/* Zone où sera rendu le contenu des pages enfants */}
      <div>{children}</div>
    </div>
  )
}

export default AdminLayout