import { ArrowRight, MessageCircle, Zap } from 'lucide-react';
import './CtaSection.css';

export default function CtaSection() {
  return (
    <section id="contato" className="cta-section">
      <div className="cta-blob cta-blob-1"></div>
      <div className="cta-blob cta-blob-2"></div>
      <div className="container cta-inner">
        <div className="cta-text">
          <div className="cta-label">
            <Zap size={13} />
            Fale com um especialista
          </div>
          <h2 className="cta-title">
            Pronto para Realizar<br />seu <span>Sonho?</span>
          </h2>
          <p className="cta-subtitle">
            Fale agora com um especialista e descubra qual carta contemplada
            é perfeita para o seu momento atual. Atendimento personalizado em até 2h.
          </p>
          <div className="cta-actions">
            <a href="#cartas" className="btn-hero-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.9375rem', background: '#F97316', color: 'white' }}>
              Ver Cartas Disponíveis <ArrowRight size={18} />
            </a>
            <a
              href="https://wa.me/5543991086650"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta-whatsapp"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="cta-image-block">
          <div className="cta-floating-card">
            <p className="floating-label">Economia vs. financiamento</p>
            <p className="floating-value">Até <span>R$ 185.000</span></p>
          </div>
          <div className="cta-floating-card">
            <p className="floating-label">Tempo médio de aprovação</p>
            <p className="floating-value"><span>10 a 15</span> dias</p>
          </div>
          <div className="cta-floating-card">
            <p className="floating-label">Taxa de aprovação dos clientes</p>
            <p className="floating-value"><span>97%</span> aprovados</p>
          </div>
        </div>
      </div>
    </section>
  );
}
