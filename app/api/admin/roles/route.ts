import { NextRequest, NextResponse } from 'next/server'
import { isAdmin, updateUserRole, promoteToAdmin, getAllUsersWithRoles } from '@/app/lib/role-manager'
import { UserRole } from '@/app/generated/prisma'

export async function GET() {
  try {
    // Vérifier que l'utilisateur est admin
    const userIsAdmin = await isAdmin()
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Accès refusé. Seuls les admins peuvent voir cette liste.' }, { status: 403 })
    }

    const users = await getAllUsersWithRoles()
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Erreur récupération utilisateurs avec rôles:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin
    const userIsAdmin = await isAdmin()
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Accès refusé. Seuls les admins peuvent modifier les rôles.' }, { status: 403 })
    }

    const body = await request.json()
    const { action, userId, email, newRole } = body

    if (action === 'update-role' && userId && newRole) {
      // Vérifier que le nouveau rôle est valide
      if (!Object.values(UserRole).includes(newRole)) {
        return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 })
      }

      const success = await updateUserRole(userId, newRole)
      if (success) {
        return NextResponse.json({ message: `Rôle mis à jour vers ${newRole}` })
      } else {
        return NextResponse.json({ error: 'Erreur lors de la mise à jour du rôle' }, { status: 500 })
      }
    }

    if (action === 'promote-admin' && email) {
      const success = await promoteToAdmin(email)
      if (success) {
        return NextResponse.json({ message: `${email} promu admin avec succès` })
      } else {
        return NextResponse.json({ error: 'Erreur lors de la promotion' }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Action invalide ou paramètres manquants' }, { status: 400 })

  } catch (error) {
    console.error('Erreur gestion rôles:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
