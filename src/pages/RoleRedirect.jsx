import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Redireciona para a área correta baseado no role do usuário
export default function RoleRedirect() {
  const { profile, loading } = useAuth()

  if (loading) return null

  if (!profile) return <Navigate to="/login" replace />

  if (profile.role === 'cliente') return <Navigate to="/cliente" replace />

  return <Navigate to="/admin" replace />
}
