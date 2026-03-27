import { ArrowRight, MessageCircle } from 'lucide-react';
import './CtaSection.css';

export default function CtaSection() {
  return (
    <section id="contato" className="cta-section">
      <div className="cta-blob cta-blob-1"></div>
      <div className="cta-blob cta-blob-2"></div>
      <div className="container cta-inner">
        <div className="cta-text">
          <h2 className="cta-title">Pronto para Realizar seu <span>Sonho?</span></h2>
          <p className="cta-subtitle">
            Fale agora com um especialista e descubra qual carta contemplada é perfeita para o seu momento atual.
          </p>
          <div className="cta-actions">
            <a href="#cartas" className="btn-hero-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              Ver Cartas Disponíveis <ArrowRight size={20} />
            </a>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta-whatsapp"
            >
              <MessageCircle size={20} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="cta-image-block">
          <div className="cta-floating-card">
            <p className="floating-label">💰 Economia vs. financiamento:</p>
            <p className="floating-value">Até R$ 185.000</p>
          </div>
          <div className="cta-floating-card card-2">
            <p className="floating-label">⚡ Tempo médio de aprovação:</p>
            <p className="floating-value">10 a 15 dias</p>
          </div>
          <div className="cta-floating-card card-3">
            <p className="floating-label">✅ Taxa de aprovação:</p>
            <p className="floating-value">97% dos clientes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
