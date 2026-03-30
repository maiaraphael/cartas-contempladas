import { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Inventory.css';

const formatCurrency = v =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const WHATSAPP_NUMBER = '5511999999999'; // Altere para o numero real

export default function Inventory() {
  const [ordenacao, setOrdenacao] = useState('menor-entrada');
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroValor, setFiltroValor] = useState(null);
  const [filtroSegmento, setFiltroSegmento] = useState(null);
  const [filtroAdmin, setFiltroAdmin] = useState(null);
  // Captura filtros da query string do hash (ex: #cartas?valor=50k&segmento=imoveis&admin=uniao)
  useEffect(() => {
    function getFiltrosFromHash() {
      if (window.location.hash.startsWith('#cartas?')) {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        setFiltroValor(params.get('valor'));
        setFiltroSegmento(params.get('segmento'));
        setFiltroAdmin(params.get('admin'));
      } else {
        setFiltroValor(null);
        setFiltroSegmento(null);
        setFiltroAdmin(null);
      }
    }
    getFiltrosFromHash();
    window.addEventListener('hashchange', getFiltrosFromHash);
    return () => window.removeEventListener('hashchange', getFiltrosFromHash);
  }, []);

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

          <div className="filters-bar card">
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
          </div>
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
