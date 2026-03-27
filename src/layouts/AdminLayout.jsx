import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, LogOut, ShieldCheck, Truck, UserCog } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'A';

  const roleLabel = {
    admin: 'Administrador',
    vendedor: 'Vendedor',
    financeiro: 'Financeiro',
  }[profile?.role] || 'Staff';

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <ShieldCheck size={28} color="var(--brand-primary)" />
            <span>Painel<span style={{color: 'var(--brand-primary)'}}>Admin</span></span>
          </Link>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>
                <LayoutDashboard size={20} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/cartas" className={`nav-item ${isActive('/admin/cartas')}`}>
                <FileText size={20} /> Cadastrar Cartas
              </Link>
            </li>
            <li>
              <Link to="/admin/clientes" className={`nav-item ${isActive('/admin/clientes')}`}>
                <Users size={20} /> Gestão de Clientes
              </Link>
            </li>
            <li>
              <Link to="/admin/fornecedores" className={`nav-item ${isActive('/admin/fornecedores')}`}>
                <Truck size={20} /> Fornecedores
              </Link>
            </li>
            {profile?.role === 'admin' && (
              <li>
                <Link to="/admin/usuarios" className={`nav-item ${isActive('/admin/usuarios')}`}>
                  <UserCog size={20} /> Usuários
                </Link>
              </li>
            )}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleLogout} style={{background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'left'}}>
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-info">
            <h2>Portal do Administrador</h2>
          </div>
          <div className="admin-profile">
            <div className="avatar">{initials}</div>
            <div style={{display:'flex',flexDirection:'column',lineHeight:1.2}}>
              <span style={{fontWeight:600,fontSize:'0.875rem'}}>{profile?.full_name || 'Usuário'}</span>
              <span style={{fontSize:'0.75rem',color:'#64748b'}}>{roleLabel}</span>
            </div>
          </div>
        </header>
        
        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
