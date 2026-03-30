import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCircle, Menu, X } from 'lucide-react';
import './Header.css';

const WHATSAPP_NUMBER = '5511999999999'; // Altere para o número real

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <ShieldCheck size={30} color="#F97316" />
          <span><span style={{ color: '#F97316' }}>AIR</span>Consorcios <span style={{ color: '#F97316' }}>Contemplados</span></span>
        </Link>
        
        {/* Nav Desktop */}
        <nav className="nav desktop-only">
          <ul>
            <li><a href="#cartas">Cartas Contempladas</a></li>
            <li><a href="#como-funciona">Como Funciona</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </nav>
        
        {/* Actions Desktop */}
        <div className="header-actions desktop-only">
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem', display: 'flex', gap: '5px' }}>
            <UserCircle size={18} /> Login
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de falar com um especialista sobre cartas contempladas.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: '0.4rem 1rem' }}
          >
            Falar com Especialista
          </a>
        </div>

        {/* Hamburger Button (Mobile Only) */}
        <button className="mobile-toggle-btn" onClick={toggleMenu} aria-label="Toggle Menu">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#cartas" onClick={toggleMenu}>Cartas Contempladas</a>
          <a href="#como-funciona" onClick={toggleMenu}>Como Funciona</a>
          <a href="#contato" onClick={toggleMenu}>Contato</a>
        </nav>
        
        <div className="mobile-actions">
          <Link to="/login" className="btn btn-outline mobile-btn" onClick={toggleMenu}>
            <UserCircle size={20} /> Login
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de falar com um especialista.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mobile-btn"
            onClick={toggleMenu}
          >
            Falar com Especialista
          </a>
        </div>
      </div>
    </header>
  );
}
