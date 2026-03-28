import { useState, useEffect } from 'react';
import {
  Search, Filter, X, UserCheck, EyeOff, Eye,
  CheckCircle, AlertCircle, ShoppingBag, Tag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './GestaoCartas.css';

const fmtBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

const segmentoLabel = { imoveis: 'Imóveis', veiculos: 'Veículos', servicos: 'Serviços', pesados: 'Pesados' };

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'disponivel', label: 'Disponível' },
  { value: 'reservada', label: 'Reservada' },
  { value: 'vendida', label: 'Vendida' },
  { value: 'indisponivel', label: 'Indisponível' },
];

export default function GestaoCartas() {
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Modal de venda
  const [modalVenda, setModalVenda] = useState(null); // carta selecionada
  const [vendedores, setVendedores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vendaForm, setVendaForm] = useState({ vendedor_id: '', cliente_id: '', obs_venda: '' });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => { fetchCartas(); }, [statusFilter]);
  useEffect(() => { if (modalVenda) { fetchVendedores(); fetchClientes(); } }, [modalVenda]);

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  async function fetchCartas() {
    setLoading(true);
    let query = supabase
      .from('cartas')
      .select(`
        *,
        vendedor:vendedor_id(id, full_name),
        cliente_comprador:cliente_comprador_id(id, full_name)
      `)
      .order('created_at', { ascending: false });

    if (statusFilter) query = query.eq('status', statusFilter);

    const { data, error } = await query;
    if (!error) setCartas(data || []);
    setLoading(false);
  }

  async function fetchVendedores() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .in('role', ['admin', 'vendedor', 'financeiro'])
      .order('full_name');
    setVendedores(data || []);
  }

  async function fetchClientes() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'cliente')
      .order('full_name');
    setClientes(data || []);
  }

  async function handleToggleDisponibilidade(carta) {
    const novoStatus = carta.status === 'indisponivel' ? 'disponivel' : 'indisponivel';
    const label = novoStatus === 'indisponivel' ? 'indisponível' : 'disponível';

    if (!window.confirm(`Deseja marcar esta carta como ${label}?`)) return;

    const { error } = await supabase
      .from('cartas')
      .update({ status: novoStatus, updated_at: new Date().toISOString() })
      .eq('id', carta.id);

    if (error) { showToast('error', error.message); return; }
    showToast('success', `Carta marcada como ${label} com sucesso.`);
    fetchCartas();
  }

  function abrirModalVenda(carta) {
    setVendaForm({
      vendedor_id: carta.vendedor_id || '',
      cliente_comprador_id: carta.cliente_comprador_id || '',
      obs_venda: carta.obs_venda || '',
    });
    setModalVenda(carta);
  }

  async function handleSalvarVenda(e) {
    e.preventDefault();
    setSalvando(true);

    const payload = {
      status: 'vendida',
      vendedor_id: vendaForm.vendedor_id || null,
      cliente_comprador_id: vendaForm.cliente_comprador_id || null,
      obs_venda: vendaForm.obs_venda || null,
      data_venda: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('cartas')
      .update(payload)
      .eq('id', modalVenda.id);

    setSalvando(false);
    if (error) { showToast('error', error.message); return; }
    showToast('success', 'Venda registrada com sucesso!');
    setModalVenda(null);
    fetchCartas();
  }

  const cartasFiltradas = cartas.filter(c => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      c.administradora?.toLowerCase().includes(s) ||
      fmtBRL(c.credito).includes(s) ||
      segmentoLabel[c.segmento]?.toLowerCase().includes(s)
    );
  });

  function StatusBadge({ status }) {
    const map = {
      disponivel:    { cls: 'badge-success',  label: 'Disponível' },
      reservada:     { cls: 'badge-warning',  label: 'Reservada' },
      vendida:       { cls: 'badge-info',     label: 'Vendida' },
      indisponivel:  { cls: 'badge-danger',   label: 'Indisponível' },
    };
    const s = map[status] || { cls: '', label: status };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
  }

  return (
    <div className="gestao-cartas">
      <div className="gc-header">
        <div>
          <h1 className="admin-page-title">Gestão de Cartas</h1>
          <p className="admin-page-subtitle">
            Gerencie disponibilidade, registre vendas e vincule vendedores e clientes.
          </p>
        </div>
      </div>

      {toast && (
        <div className={`toast-msg toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Toolbar */}
      <div className="gc-toolbar card">
        <div className="gc-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por administradora, valor, segmento..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="gc-filters">
          <Filter size={16} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Counters */}
      <div className="gc-counters">
        {[
          { label: 'Disponíveis',   value: cartas.filter(c => c.status === 'disponivel').length,   cls: 'cnt-green' },
          { label: 'Reservadas',    value: cartas.filter(c => c.status === 'reservada').length,    cls: 'cnt-yellow' },
          { label: 'Vendidas',      value: cartas.filter(c => c.status === 'vendida').length,      cls: 'cnt-blue' },
          { label: 'Indisponíveis', value: cartas.filter(c => c.status === 'indisponivel').length, cls: 'cnt-red' },
        ].map(ct => (
          <div key={ct.label} className={`gc-counter-card ${ct.cls}`}>
            <span className="gc-counter-val">{ct.value}</span>
            <span className="gc-counter-lbl">{ct.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card gc-table-card">
        <div className="table-responsive">
          {loading ? (
            <p style={{ padding: '2rem', color: '#64748b', textAlign: 'center' }}>Carregando cartas...</p>
          ) : cartasFiltradas.length === 0 ? (
            <p style={{ padding: '2rem', color: '#64748b', textAlign: 'center' }}>Nenhuma carta encontrada.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Carta / Segmento</th>
                  <th>Crédito</th>
                  <th>Entrada</th>
                  <th>Parcela</th>
                  <th>Status</th>
                  <th>Vendedor</th>
                  <th>Cliente</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cartasFiltradas.map(c => (
                  <tr key={c.id} className={c.status === 'indisponivel' ? 'row-indisponivel' : ''}>
                    <td>
                      <p className="gc-cell-main">{c.administradora}</p>
                      <p className="gc-cell-sub">{segmentoLabel[c.segmento] || c.segmento}</p>
                    </td>
                    <td><strong>{fmtBRL(c.credito)}</strong></td>
                    <td>{fmtBRL(c.entrada)}</td>
                    <td>{fmtBRL(c.parcela)}/mês</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <p className="gc-cell-sub">
                        {c.vendedor?.full_name || <span className="gc-empty">—</span>}
                      </p>
                    </td>
                    <td>
                      <p className="gc-cell-sub">
                        {c.cliente_comprador?.full_name || <span className="gc-empty">—</span>}
                      </p>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {/* Registrar venda */}
                        <button
                          className="icon-btn gc-btn-venda"
                          title="Registrar / Editar Venda"
                          onClick={() => abrirModalVenda(c)}
                        >
                          <ShoppingBag size={16} />
                        </button>

                        {/* Disponível / Indisponível */}
                        <button
                          className={`icon-btn ${c.status === 'indisponivel' ? 'gc-btn-enable' : 'gc-btn-disable'}`}
                          title={c.status === 'indisponivel' ? 'Tornar Disponível' : 'Tornar Indisponível'}
                          onClick={() => handleToggleDisponibilidade(c)}
                        >
                          {c.status === 'indisponivel' ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Venda */}
      {modalVenda && (
        <div className="modal-overlay" onClick={() => setModalVenda(null)}>
          <div className="modal-box gc-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Registrar Venda</h3>
                <p className="modal-sub">
                  {modalVenda.administradora} · {fmtBRL(modalVenda.credito)} · {segmentoLabel[modalVenda.segmento]}
                </p>
              </div>
              <button className="icon-btn" onClick={() => setModalVenda(null)}><X size={20} /></button>
            </div>

            <form className="modal-body gc-modal-form" onSubmit={handleSalvarVenda}>
              <div className="form-group">
                <label>
                  <UserCheck size={15} /> Vendedor Responsável
                </label>
                <select
                  value={vendaForm.vendedor_id}
                  onChange={e => setVendaForm(f => ({ ...f, vendedor_id: e.target.value }))}
                >
                  <option value="">— Selecione um vendedor —</option>
                  {vendedores.map(v => (
                    <option key={v.id} value={v.id}>{v.full_name} ({v.role})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <Tag size={15} /> Cliente Comprador
                </label>
                <select
                  value={vendaForm.cliente_comprador_id}
                  onChange={e => setVendaForm(f => ({ ...f, cliente_comprador_id: e.target.value }))}
                >
                  <option value="">— Selecione um cliente —</option>
                  {clientes.map(cl => (
                    <option key={cl.id} value={cl.id}>{cl.full_name}{cl.email ? ` (${cl.email})` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Observações da Venda</label>
                <textarea
                  rows={3}
                  placeholder="Ex: Vendida por vendedor externo, comissão, etc..."
                  value={vendaForm.obs_venda}
                  onChange={e => setVendaForm(f => ({ ...f, obs_venda: e.target.value }))}
                />
              </div>

              <div className="gc-modal-info">
                <AlertCircle size={14} />
                <span>
                  Ao salvar, o status da carta será alterado para <strong>Vendida</strong> e
                  ela deixará de aparecer no site.
                </span>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModalVenda(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={salvando}>
                  <ShoppingBag size={16} />
                  {salvando ? 'Salvando...' : 'Confirmar Venda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
