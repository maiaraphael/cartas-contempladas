import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole === 'staff' && !['admin', 'vendedor', 'financeiro'].includes(profile?.role)) {
    return <Navigate to="/cliente" replace />
  }

  if (requiredRole === 'cliente' && profile?.role !== 'cliente') {
    return <Navigate to="/admin" replace />
  }

  return children
}
