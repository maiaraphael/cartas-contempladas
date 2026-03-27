import { useState } from 'react';
import { Search, ArrowRight, TrendingDown, CheckCircle } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('imoveis');

  return (
    <section className="hero">
      {/* Animated background blobs */}
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>
      <div className="hero-blob blob-3"></div>

      <div className="container hero-inner">
        {/* Left: Text Content */}
        <div className="hero-text">
          <div className="hero-badge">
            <TrendingDown size={16} />
            <span>Economize até 40% vs. financiamento tradicional</span>
          </div>

          <h1 className="hero-title">
            Conquiste seu <span className="highlight">Patrimônio</span> com
            Consórcio Contemplado
          </h1>

          <p className="hero-subtitle">
            Cartas de consórcio contempladas com transferência segura, processo
            100% transparente e os melhores valores do Brasil.
          </p>

          <ul className="hero-checks">
            <li><CheckCircle size={18} /> Sem juros abusivos de financiamento</li>
            <li><CheckCircle size={18} /> Transferência jurídica garantida</li>
            <li><CheckCircle size={18} /> Crédito disponível imediatamente</li>
          </ul>

          <div className="hero-actions">
            <a href="#cartas" className="btn btn-hero-primary">
              Ver Cartas Disponíveis <ArrowRight size={20} />
            </a>
            <a href="#como-funciona" className="btn btn-hero-outline">
              Como Funciona
            </a>
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

          <form className="search-form">
            <div className="form-group">
              <label>Valor do Crédito Desejado</label>
              <select defaultValue="">
                <option value="" disabled>Selecione um valor</option>
                <option value="100k">Até R$ 100.000</option>
                <option value="300k">R$ 100.000 a R$ 300.000</option>
                <option value="500k">R$ 300.000 a R$ 500.000</option>
                <option value="1m">Acima de R$ 500.000</option>
              </select>
            </div>
            <div className="form-group">
              <label>Administradora</label>
              <select defaultValue="uniao">
                <option value="uniao">Consórcio União</option>
              </select>
            </div>
            <button type="button" className="btn btn-hero-primary search-btn">
              <Search size={20} />
              Buscar Cartas Agora
            </button>
          </form>

          <div className="card-footer-note">
            <CheckCircle size={14} color="#22c55e" />
            <span>Atendimento personalizado em até 2h</span>
          </div>
        </div>
      </div>

      {/* Floating scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-dot"></div>
      </div>
    </section>
  );
}
