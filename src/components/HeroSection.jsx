import { useState } from 'react';
import { Search, ArrowRight, CheckCircle, ShieldCheck, Star } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('imoveis');
  const [valorCredito, setValorCredito] = useState("");
  const [administradora, setAdministradora] = useState("uniao");

  function handleBuscarCartas() {
    if (!valorCredito) {
      alert("Selecione um valor de crédito desejado.");
      return;
    }
    const params = new URLSearchParams();
    params.set('valor', valorCredito);
    params.set('segmento', activeTab);
    params.set('admin', administradora);
    window.location.href = `/busca-cartas?${params.toString()}`;
  }

  return (
    <section className="hero">
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>
      <div className="hero-blob blob-3"></div>

      {/* Grid line decorations */}
      <div className="hero-grid-lines" aria-hidden="true"></div>

      <div className="container hero-inner">
        {/* Left: Text Content */}
        <div className="hero-text">

          <div className="hero-topline">
            <span className="hero-topline-bar"></span>
            <span className="hero-topline-text">AIR Consórcios Contemplados</span>
          </div>

          <h1 className="hero-title">
            Seu Patrimônio<br />
            sem <span className="highlight">Juros</span>.<br />
            Com <span className="highlight">Segurança</span>.
          </h1>

          <p className="hero-subtitle">
            Adquira cartas de consórcio contempladas com transferência
            jurídica garantida. Economize até <strong>40%</strong> em relação ao financiamento tradicional.
          </p>

          <ul className="hero-checks">
            <li><CheckCircle size={16} /> Sem juros abusivos de financiamento</li>
            <li><CheckCircle size={16} /> Transferência jurídica 100% garantida</li>
            <li><CheckCircle size={16} /> Crédito disponível imediatamente</li>
          </ul>

          <div className="hero-actions">
            <a href="#cartas" className="btn-hero-primary">
              Ver Cartas Disponíveis <ArrowRight size={17} />
            </a>
            <a href="#como-funciona" className="btn-hero-outline">
              Como Funciona
            </a>
          </div>

          <div className="hero-proof">
            <div className="hero-proof-avatars">
              {['MA','JC','RS','PT'].map(i => <div key={i} className="hero-proof-avatar">{i}</div>)}
            </div>
            <div className="hero-proof-text">
              <strong>+200 clientes satisfeitos</strong>
              <span>97% de taxa de aprovação</span>
            </div>
            <div className="hero-proof-rating">
              <div className="hero-proof-stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#F97316" color="#F97316" />)}
              </div>
              <span>5.0</span>
            </div>
          </div>
        </div>

        {/* Right: Search Card */}
        <div className="hero-card">
          <div className="hero-card-badge">
            <ShieldCheck size={14} color="#22c55e" />
            Consulta gratuita e sem compromisso
          </div>

          <div className="hero-card-header">
            <h3>Encontre sua Carta</h3>
            <p>Filtre pelo valor e segmento ideal</p>
          </div>

          <div className="search-tabs">
            <button
              className={`tab ${activeTab === 'imoveis' ? 'active' : ''}`}
              onClick={() => setActiveTab('imoveis')}
            >
              🏠 Imóveis
            </button>
            <button
              className={`tab ${activeTab === 'veiculos' ? 'active' : ''}`}
              onClick={() => setActiveTab('veiculos')}
            >
              🚗 Veículos
            </button>
          </div>

          <form className="search-form" onSubmit={e => e.preventDefault()}>
            <div className="form-group">
              <label>Valor do Crédito Desejado</label>
              <select value={valorCredito} onChange={e => setValorCredito(e.target.value)}>
                <option value="" disabled>Selecione um valor</option>
                <option value="50k">Até R$ 50.000</option>
                <option value="100k">R$ 50.000 a R$ 100.000</option>
                <option value="300k">R$ 100.000 a R$ 300.000</option>
                <option value="500k">R$ 300.000 a R$ 500.000</option>
                <option value="1m">Acima de R$ 500.000</option>
              </select>
            </div>
            <div className="form-group">
              <label>Administradora</label>
              <select value={administradora} onChange={e => setAdministradora(e.target.value)}>
                <option value="uniao">Consórcio União</option>
                <option value="outro">Outra Administradora</option>
              </select>
            </div>
            <button type="button" className="search-btn" onClick={handleBuscarCartas}>
              <Search size={17} />
              Buscar Cartas Agora
            </button>
          </form>

          <div className="card-footer-note">
            <CheckCircle size={12} color="#22c55e" />
            <span>Atendimento personalizado em até 2h</span>
          </div>

          <div className="hero-card-stats">
            <div className="hero-card-stat">
              <span className="hero-card-stat-val">R$10M+</span>
              <span className="hero-card-stat-lbl">em créditos</span>
            </div>
            <div className="hero-card-stat-divider"></div>
            <div className="hero-card-stat">
              <span className="hero-card-stat-val">50+</span>
              <span className="hero-card-stat-lbl">cartas ativas</span>
            </div>
            <div className="hero-card-stat-divider"></div>
            <div className="hero-card-stat">
              <span className="hero-card-stat-val">15d</span>
              <span className="hero-card-stat-lbl">tempo médio</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
