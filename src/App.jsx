import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import BuscaCartas from './pages/BuscaCartas';
import Login from './pages/Login';
import RoleRedirect from './pages/RoleRedirect';

import Dashboard from './pages/admin/Dashboard';
import CadastroCartas from './pages/admin/CadastroCartas';
import GestaoClientes from './pages/admin/GestaoClientes';
import GestaoCartas from './pages/admin/GestaoCartas';
import Fornecedores from './pages/admin/Fornecedores';
import Usuarios from './pages/admin/Usuarios';

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import ClientDashboard from './pages/client/ClientDashboard';
import PreenchimentoFichas from './pages/client/PreenchimentoFichas';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route path="/busca-cartas" element={<BuscaCartas />} />

        <Route path="/login" element={<Login />} />
        <Route path="/redirect" element={<RoleRedirect />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="staff">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="cartas" element={<CadastroCartas />} />
          <Route path="gestao-cartas" element={<GestaoCartas />} />
          <Route path="clientes" element={<GestaoClientes />} />
          <Route path="fornecedores" element={<Fornecedores />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>

        <Route
          path="/cliente"
          element={
            <ProtectedRoute requiredRole="cliente">
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClientDashboard />} />
          <Route path="fichas" element={<PreenchimentoFichas />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
