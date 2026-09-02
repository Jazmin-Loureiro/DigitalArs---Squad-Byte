import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Protege las rutas que requieren una sesión iniciada.
 *
 * También permite restringir una ruta a determinados roles mediante la prop allowedRoles.
 */
function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  // Si no existe una sesión activa, el usuario no puede acceder al contenido protegido y es redirigido al login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta define roles permitidos, verificamos que el rol del usuario autenticado esté incluido entre ellos.
  if (
    allowedRoles &&
    !allowedRoles.includes(user?.roleName?.toLowerCase())
  ) {
    // El usuario está autenticado, pero no tiene permisos para acceder a esta ruta.
    return <Navigate to="/" replace />;
  }

  // Outlet renderiza la ruta hija que pasó las validaciones anteriores.
  return <Outlet />;
}

export default ProtectedRoute;