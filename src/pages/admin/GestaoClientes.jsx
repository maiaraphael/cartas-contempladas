import { useState, useEffect } from 'react';
import { Search, FileSignature, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './GestaoClientes.css';

const PAGE_SIZE = 10;

export default function GestaoClientes() {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, [filter, statusFilter, page]);

  async function fetchClientes() {
    setLoading(true);
    let query = supabase
      .from('clientes')
      .select('*, cartas(credito, administradora)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (filter.trim()) {
      query = query.or(`nome.ilike.%${filter.trim()}%,email.ilike.%${filter.trim()}%,cpf.ilike.%${filter.trim()}%`);
    }
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, count, error } = await query;
    if (!error) {
      setClientes(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  }

  async function updateStatus(clienteId, newStatus) {
    setUpdatingStatus(true);
    const { error } = await supabase
      .from('clientes')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', clienteId);
    if (!error) {
      fetchClientes();
      if (selected?.id === clienteId) setSelected(s => ({ ...s, status: newStatus }));
    }
    setUpdatingStatus(false);
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pendente_doc':  return <span className="badge badge-warning">Pendente Fichas</span>;
      case 'analise':       return <span className="badge badge-info">Em Análise Admin.</span>;
      case 'aprovado':      return <span className="badge badge-success">Transferência Liberada</span>;
      case 'concluido':     return <span className="badge badge-success">Concluído</span>;
      default:              return <span className="badge">Novo</span>;
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="gestao-clientes">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-title">Gestão de Clientes</h1>
          <p className="admin-page-subtitle">Acompanhe o preenchimento de formulários e status das transferências.</p>
        </div>
      </div>

      <div className="card table-card">
        <div className="table-toolbar">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou CPF..."
              value={filter}
              onChange={e => { setFilter(e.target.value); setPage(0); }}
            />
          </div>

          <div className="filters">
            <select
              className="btn btn-outline filter-btn"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Todos os status</option>
              <option value="pendente_doc">Pendente Fichas</option>
              <option value="analise">Em Análise</option>
              <option value="aprovado">Aprovado</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table clientes-table">
            <thead>
              <tr>
                <th>Cliente / Contato</th>
                <th>Carta de Interesse</th>
                <th>Data Cadastro</th>
                <th>Status do Processo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b' }}>Carregando...</td></tr>
              ) : clientes.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b' }}>Nenhum cliente encontrado</td></tr>
              ) : (
                clientes.map(cliente => (
                  <tr key={cliente.id}>
                    <td>
                      <div className="client-info">
                        <div className="client-avatar">{cliente.nome.charAt(0)}</div>
                        <div>
                          <p className="client-name">{cliente.nome}</p>
                          <p className="client-email">{cliente.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="interesse-text">
                        {cliente.cartas
                          ? `R$ ${Number(cliente.cartas.credito).toLocaleString('pt-BR')} — ${cliente.cartas.administradora}`
                          : (cliente.interesse || '—')}
                      </p>
                    </td>
                    <td><p className="date-text">{new Date(cliente.created_at).toLocaleDateString('pt-BR')}</p></td>
                    <td>{getStatusBadge(cliente.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" title="Ver Detalhes / Alterar Status" onClick={() => setSelected(cliente)}>
                          <FileSignature size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <p>Mostrando {Math.min(page * PAGE_SIZE + 1, total)}–{Math.min((page + 1) * PAGE_SIZE, total)} de {total} clientes</p>
          <div className="pagination-buttons">
            <button className="btn btn-outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</button>
            <button className="btn btn-outline" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Próximo</button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalhes do Cliente</h3>
              <button className="icon-btn" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p><strong>Nome:</strong> {selected.nome}</p>
              <p><strong>E-mail:</strong> {selected.email}</p>
              <p><strong>Telefone:</strong> {selected.telefone || '—'}</p>
              <p><strong>CPF:</strong> {selected.cpf || '—'}</p>
              <p><strong>Cadastro:</strong> {new Date(selected.created_at).toLocaleDateString('pt-BR')}</p>
              {selected.observacoes && <p><strong>Obs:</strong> {selected.observacoes}</p>}

              <div style={{ marginTop: '1.25rem' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Alterar Status:</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['pendente_doc', 'analise', 'aprovado', 'concluido'].map(s => (
                    <button
                      key={s}
                      className={`btn ${selected.status === s ? 'btn-primary' : 'btn-outline'}`}
                      disabled={updatingStatus}
                      onClick={() => updateStatus(selected.id, s)}
                    >
                      {{ pendente_doc: 'Pendente', analise: 'Em Análise', aprovado: 'Aprovado', concluido: 'Concluído' }[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
