import { Route, Routes } from 'react-router-dom';

import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MovementsPage from './pages/MovementsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import DepositPage from './pages/DepositPage';
import TransferPage from './pages/TransferPage';

/**
 * Define la estructura de rutas de Digital ARS.
 *
 * /login es una ruta pública.
 *
 * Las rutas principales requieren una sesión autenticada y comparten
 * AppLayout como estructura de navegación.
 *
 * Algunas rutas pueden aplicar además restricciones específicas por rol.
 */
function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas disponibles para cualquier usuario autenticado */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/depositar" element={<DepositPage />} />
          <Route path="/transferir" element={<TransferPage />} />
          <Route path="/movimientos" element={<MovementsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />

          {/*
           * Área exclusiva para administradores.
           * Este segundo ProtectedRoute agrega la validación del rol
           * además de la autenticación que ya exige el nivel superior.
           */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          
          {/* Ruta de recuperación para URLs inexistentes */}
          <Route path="*" element={<NotFoundPage />} />

        </Route>
      </Route>
    </Routes>
  );
}

export default App;