import { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Inventory.css';

const formatCurrency = v =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const WHATSAPP_NUMBER = '5543991086650'; // Altere para o numero real

export default function Inventory({ filtros = {}, enableFiltros = false }) {
  const [ordenacao, setOrdenacao] = useState('menor-entrada');
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroValor, setFiltroValor] = useState(filtros.valor || null);
  const [filtroSegmento, setFiltroSegmento] = useState(filtros.segmento || null);
  const [filtroAdmin, setFiltroAdmin] = useState(filtros.admin || null);
  // Atualiza filtros se vierem via props (ex: página de busca)
  useEffect(() => {
    if (filtros.valor !== undefined) setFiltroValor(filtros.valor);
    if (filtros.segmento !== undefined) setFiltroSegmento(filtros.segmento);
    if (filtros.admin !== undefined) setFiltroAdmin(filtros.admin);
  }, [filtros.valor, filtros.segmento, filtros.admin]);

  useEffect(() => {
    async function fetchCartas() {
      const { data } = await supabase
        .from('cartas')
        .select('*')
        .eq('status', 'disponivel');
      setCartas(data || []);
      setLoading(false);
    }
    fetchCartas();
  }, []);


  // Filtros combinados
  function filtrarCarta(carta) {
    // Valor
    if (filtroValor) {
      const v = Number(carta.credito);
      switch (filtroValor) {
        case '50k':
          if (!(v > 0 && v <= 50000)) return false;
          break;
        case '100k':
          if (!(v > 50000 && v <= 100000)) return false;
          break;
        case '300k':
          if (!(v > 100000 && v <= 300000)) return false;
          break;
        case '500k':
          if (!(v > 300000 && v <= 500000)) return false;
          break;
        case '1m':
          if (!(v > 500000)) return false;
          break;
        default:
          break;
      }
    }
    // Segmento
    if (filtroSegmento && carta.segmento !== filtroSegmento) return false;
    // Administradora
    if (filtroAdmin && filtroAdmin !== 'outro' && carta.administradora.toLowerCase().indexOf('união') === -1) return false;
    if (filtroAdmin === 'outro' && carta.administradora.toLowerCase().indexOf('união') !== -1) return false;
    return true;
  }

  const sortedCartas = [...cartas]
    .filter(filtrarCarta)
    .sort((a, b) => {
      if (ordenacao === 'menor-entrada') return a.entrada - b.entrada;
      if (ordenacao === 'maior-credito') return b.credito - a.credito;
      return 0;
    });

  function handleInteresse(carta) {
    const msg = encodeURIComponent(
      `Ola! Tenho interesse na carta contemplada de ${formatCurrency(carta.credito)} (${carta.administradora}). Poderia me passar mais informacoes?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  }

  return (
    <section id="cartas" className="section inventory-bg">
      <div className="container">
        <div className="inventory-header">
          <div>
            <h2 className="title section-title">Cartas Contempladas Disponíveis</h2>
            <p className="subtitle">Ofertas verificadas prontas para transferência imediata.</p>
          </div>
          {enableFiltros && (
            <div className="filters-bar card" style={{marginTop: 16}}>
              <div className="filter-label">
                <SlidersHorizontal size={20} />
                <span>Ordenar por:</span>
              </div>
              <select
                className="filter-select"
                value={ordenacao}
                onChange={e => setOrdenacao(e.target.value)}
              >
                <option value="menor-entrada">Menor Valor de Entrada</option>
                <option value="maior-credito">Maior Crédito</option>
              </select>
              {/* Filtros dinâmicos */}
              <div style={{marginLeft: 24, display: 'flex', gap: 12}}>
                <select value={filtroValor || ''} onChange={e => setFiltroValor(e.target.value)}>
                  <option value="">Todos os valores</option>
                  <option value="50k">Até R$ 50.000</option>
                  <option value="100k">R$ 50.000 a R$ 100.000</option>
                  <option value="300k">R$ 100.000 a R$ 300.000</option>
                  <option value="500k">R$ 300.000 a R$ 500.000</option>
                  <option value="1m">Acima de R$ 500.000</option>
                </select>
                <select value={filtroSegmento || ''} onChange={e => setFiltroSegmento(e.target.value)}>
                  <option value="">Todos os segmentos</option>
                  <option value="imoveis">Imóveis</option>
                  <option value="veiculos">Veículos</option>
                </select>
                <select value={filtroAdmin || ''} onChange={e => setFiltroAdmin(e.target.value)}>
                  <option value="">Todas administradoras</option>
                  <option value="uniao">Consórcio União</option>
                  <option value="outro">Outra</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '3rem 0' }}>Carregando cartas...</p>
        ) : sortedCartas.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '3rem 0' }}>
            Nenhuma carta disponível no momento.
          </p>
        ) : (
          <div className="grid grid-cols-3 inventory-grid">
            {sortedCartas.map(carta => (
              <div key={carta.id} className="card inventory-card">
                <div className="card-header">
                  <span className="badge badge-contemplada">Contemplada</span>
                  <span className="admin-name">{carta.administradora}</span>
                </div>

                <div className="card-body">
                  <div className="credit-value">
                    <span className="label">Valor do Crédito</span>
                    <p className="value">{formatCurrency(carta.credito)}</p>
                  </div>

                  <div className="financial-details">
                    <div className="detail-item">
                      <span className="label">Entrada</span>
                      <p className="detail-value">{formatCurrency(carta.entrada)}</p>
                    </div>
                    <div className="detail-item">
                      <span className="label">Parcela</span>
                      <p className="detail-value">{carta.prazo}x {formatCurrency(carta.parcela)}</p>
                    </div>
                  </div>

                  {carta.economia > 0 && (
                    <div className="economy-section">
                      <p className="economy-label">Economia Real vs. Financiamento:</p>
                      <p className="economy-value">
                        Você economiza aprox. <strong>{formatCurrency(carta.economia)}</strong>
                      </p>
                      <div className="progress-bar">
                        <div className="progress" style={{ width: '60%' }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button className="btn btn-primary w-100" onClick={() => handleInteresse(carta)}>
                    Tenho Interesse <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
