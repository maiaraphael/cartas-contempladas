import { useState } from 'react';
import { Search, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('imoveis');

  const [valorCredito, setValorCredito] = useState("");
  const [administradora, setAdministradora] = useState("uniao");

  // Segmento: imoveis ou veiculos
  // Usa activeTab

  function handleBuscarCartas() {
    if (!valorCredito) {
      alert("Selecione um valor de crédito desejado.");
      return;
    }
    // Monta query string com todos filtros
    const params = new URLSearchParams();
    params.set('valor', valorCredito);
    params.set('segmento', activeTab);
    params.set('admin', administradora);
    window.location.href = `/busca-cartas?${params.toString()}`;
  }

  return (
    <section className="hero">
      {/* Animated background blobs */}
      <br></br>
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>
      <div className="hero-blob blob-3"></div>

      <div className="container hero-inner">
        {/* Left: Text Content */}
        <div className="hero-text">
          <div className="hero-topline">
            <span className="hero-topline-bar"></span>
            <span className="hero-topline-text">AIR Consórcios Contemplados</span>
          </div>

          <div className="hero-badge">
            <ShieldCheck size={14} />
            <span>Processo 100% Jurídico e Transparente</span>
          </div>

          <h1 className="hero-title">
            Seu <span className="highlight">Patrimônio</span>{' '}
            sem Juros.<br />Com Segurança.
          </h1>

          <div className="hero-divider"></div>

          <p className="hero-subtitle">
            Adquira cartas de consórcio contempladas com transferência
            jurídica garantida. Economize até 40% em relação ao
            financiamento tradicional.
          </p>

          <ul className="hero-checks">
            <li><CheckCircle size={17} /> Sem juros abusivos de financiamento</li>
            <li><CheckCircle size={17} /> Transferência jurídica garantida</li>
            <li><CheckCircle size={17} /> Crédito disponível imediatamente</li>
          </ul>

          <div className="hero-actions">
            <a href="#cartas" className="btn btn-hero-primary">
              Ver Cartas Disponíveis <ArrowRight size={18} />
            </a>
            <a href="#como-funciona" className="btn btn-hero-outline">
              Como Funciona
            </a>
          </div>

          <div className="hero-proof">
            <div className="hero-proof-avatars">
              <div className="hero-proof-avatar">MA</div>
              <div className="hero-proof-avatar">JC</div>
              <div className="hero-proof-avatar">RS</div>
              <div className="hero-proof-avatar">PT</div>
              <br></br>
            </div>
            <div className="hero-proof-text">
              <strong>+200 clientes satisfeitos</strong>
              97% de taxa de aprovação
            </div>
          </div>
        </div>

        {/* Right: Search Card */}
        <div className="hero-card">
          <div className="hero-card-header">
            <h3>Buscar Carta Contemplada</h3>
            <p>Consulta gratuita e sem compromisso</p>
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
            {/* Segmento já está nos tabs (activeTab) */}
            <button type="button" className="btn btn-hero-primary search-btn" onClick={handleBuscarCartas}>
              <Search size={18} />
              Buscar Cartas Agora
            </button>
          </form>

          <div className="card-footer-note">
            <CheckCircle size={13} color="#22c55e" />
            <span>Atendimento personalizado em até 2h</span>
          </div>
        </div>
      </div>
    </section>
  );
}
