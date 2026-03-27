import { Link } from 'react-router-dom';
import { ShieldCheck, UserCircle } from 'lucide-react';
import './Header.css';

const WHATSAPP_NUMBER = '5511999999999'; // Altere para o número real

export default function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <ShieldCheck size={30} color="#F97316" />
          <span>Consorcios <span style={{ color: '#F97316' }}>Contemplados</span></span>
        </Link>
        <nav className="nav">
          <ul>
            <li><a href="#cartas">Cartas Contempladas</a></li>
            <li><a href="#como-funciona">Como Funciona</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem', display: 'flex', gap: '5px' }}>
            <UserCircle size={18} /> Área do Cliente
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
      </div>
    </header>
  );
}
