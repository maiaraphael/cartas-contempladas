import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer section">
      <div className="container footer-content grid grid-cols-4">
        <div className="footer-brand">
          <Link to="/" className="logo footer-logo">
            <ShieldCheck size={28} color="var(--brand-primary)" />
            <span>Consorcios<span style={{ color: 'var(--brand-primary)' }}> Contemplados</span></span>
          </Link>
          <p className="footer-text">
            Sua parceira de confiança para a conquista do seu patrimônio com as melhores cartas contempladas do mercado.
          </p>
        </div>

        <div className="footer-links">
          <h4 className="footer-title">Links Rápidos</h4>
          <ul>
            <li><a href="#cartas">Cartas Contempladas</a></li>
            <li><a href="#como-funciona">Como Funciona</a></li>
            <li><a href="#depoimentos">Depoimentos</a></li>
            <li><a href="#faq">Dúvidas Frequentes</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4 className="footer-title">Categorias</h4>
          <ul>
            <li>Imóveis</li>
            <li>Veículos</li>
            <li>Serviços</li>
            <li>Pesados</li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4 className="footer-title">Contato</h4>
          <ul>
            <li><MapPin size={18} /> Londrina - PR</li>
            <li><Phone size={18} /> (43) 99108-6650</li>
            <li><Mail size={18} /> raphael_maia@live.com</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <br></br>
        <br></br>
        <p>&copy; {new Date().getFullYear()} AIR Cartas Contempladas. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
