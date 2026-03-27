import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './ClientLayout.css';

export default function ClientLayout() {
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
    : 'C';

  return (
    <div className="client-layout">
      {/* Top Navigation */}
      <header className="client-header">
        <div className="client-container header-inner">
          <Link to="/" className="logo">
            <ShieldCheck size={28} color="var(--brand-primary)" />
            <span>Portal do <span style={{ color: 'var(--brand-primary)' }}>Cliente</span></span>
          </Link>

          <div className="client-profile">
            <div className="avatar">{initials}</div>
            <div className="user-details">
              <span className="user-name">{profile?.full_name || 'Cliente'}</span>
              <span className="user-email">{profile?.email || ''}</span>
            </div>
            <button title="Sair" className="logout-btn" onClick={handleLogout} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center'}}>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="client-container layout-body">
        
        {/* Sidebar Navigation */}
        <aside className="client-sidebar">
          <nav className="client-nav">
            <ul>
              <li>
                <Link to="/cliente" className={`nav-item ${isActive('/cliente')}`}>
                  <Home size={20} /> Início / Status
                </Link>
              </li>
              <li>
                <Link to="/cliente/fichas" className={`nav-item ${isActive('/cliente/fichas')}`}>
                  <ClipboardList size={20} /> Preencher Fichas
                </Link>
              </li>
            </ul>
          </nav>

          <div className="sidebar-contact-card">
            <h4>Precisa de Ajuda?</h4>
            <p>Fale com seu consultor especialista agora mesmo.</p>
            <button className="btn btn-outline" style={{width: '100%', marginTop: '0.5rem'}}>WhatsApp</button>
          </div>
        </aside>

        {/* Dynamic Content */}
        <main className="client-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
