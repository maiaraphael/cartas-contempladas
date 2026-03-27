import { useState, useEffect } from 'react';
import { UploadCloud, Save, CheckCircle, AlertCircle, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './CadastroCartas.css';

const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const empty = {
  credito: '', entrada: '', parcela: '', prazo: '',
  administradora: 'Consórcio União', taxa_transferencia: '',
  segmento: 'imoveis', status: 'disponivel', economia: '', descricao: '',
};

export default function CadastroCartas() {
  const { user } = useAuth();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type, msg }
  const [cartas, setCartas] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchCartas(); }, []);

  async function fetchCartas() {
    setLoadingList(true);
    const { data } = await supabase
      .from('cartas')
      .select('*')
      .order('created_at', { ascending: false });
    setCartas(data || []);
    setLoadingList(false);
  }

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleEdit(carta) {
    setEditingId(carta.id);
    setForm({
      credito: carta.credito, entrada: carta.entrada, parcela: carta.parcela,
      prazo: carta.prazo, administradora: carta.administradora,
      taxa_transferencia: carta.taxa_transferencia || '',
      segmento: carta.segmento, status: carta.status,
      economia: carta.economia || '', descricao: carta.descricao || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setEditingId(null);
    setForm(empty);
  }

  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja excluir esta carta?')) return;
    const { error } = await supabase.from('cartas').delete().eq('id', id);
    if (error) { showToast('error', error.message); return; }
    showToast('success', 'Carta excluída com sucesso.');
    fetchCartas();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      credito: Number(form.credito),
      entrada: Number(form.entrada),
      parcela: Number(form.parcela),
      prazo: Number(form.prazo),
      administradora: form.administradora,
      taxa_transferencia: form.taxa_transferencia ? Number(form.taxa_transferencia) : 0,
      segmento: form.segmento,
      status: form.status,
      economia: form.economia ? Number(form.economia) : null,
      descricao: form.descricao || null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('cartas').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('cartas').insert({ ...payload, created_by: user?.id }));
    }

    setLoading(false);
    if (error) { showToast('error', error.message); return; }
    showToast('success', editingId ? 'Carta atualizada com sucesso!' : 'Carta cadastrada com sucesso!');
    setEditingId(null);
    setForm(empty);
    fetchCartas();
  }

  const segmentoLabel = { imoveis: 'Imóveis', veiculos: 'Veículos', servicos: 'Serviços', pesados: 'Pesados' };
  const statusLabel = { disponivel: 'Disponível', reservada: 'Reservada', vendida: 'Vendida' };

  return (
    <div className="cadastro-cartas">
      <h1 className="admin-page-title">{editingId ? 'Editar Carta' : 'Cadastrar Carta Contemplada'}</h1>
      <p className="admin-page-subtitle">Preencha os dados abaixo para {editingId ? 'atualizar a' : 'adicionar uma nova'} carta ao portfólio.</p>

      {toast && (
        <div className={`toast-msg toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="section-title">Dados Principais da Cota</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Valor do Crédito (R$) *</label>
              <input type="number" name="credito" placeholder="Ex: 300000" value={form.credito} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Valor da Entrada (R$) *</label>
              <input type="number" name="entrada" placeholder="Ex: 85000" value={form.entrada} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Valor da Parcela (R$) *</label>
              <input type="number" name="parcela" placeholder="Ex: 2450" value={form.parcela} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Prazo Restante (Meses) *</label>
              <input type="number" name="prazo" placeholder="Ex: 150" value={form.prazo} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Economia Estimada (R$)</label>
              <input type="number" name="economia" placeholder="Ex: 45000" value={form.economia} onChange={handleChange} min="0" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Informações Administradora</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Administradora do Consórcio *</label>
              <input type="text" name="administradora" placeholder="Ex: Consórcio União" value={form.administradora} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Taxa de Transferência (R$)</label>
              <input type="number" name="taxa_transferencia" placeholder="Ex: 2500" value={form.taxa_transferencia} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label>Segmento da Carta *</label>
              <select name="segmento" value={form.segmento} onChange={handleChange}>
                <option value="imoveis">Imóveis</option>
                <option value="veiculos">Veículos</option>
                <option value="servicos">Serviços</option>
                <option value="pesados">Pesados</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status Atual *</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="disponivel">Disponível</option>
                <option value="reservada">Reservada</option>
                <option value="vendida">Vendida</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Descrição / Observações</label>
            <textarea name="descricao" placeholder="Informações adicionais sobre a cota..." value={form.descricao} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1.5px solid #e5e7eb', resize: 'vertical' }} />
          </div>
        </div>

        <div className="form-actions border-t">
          <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={20} /> {loading ? 'Salvando...' : (editingId ? 'Atualizar Carta' : 'Salvar Nova Carta')}
          </button>
        </div>
      </form>

      {/* Lista de cartas */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3>Cartas Cadastradas</h3>
        </div>
        <div className="table-responsive">
          {loadingList ? (
            <p style={{ padding: '1rem', color: '#64748b' }}>Carregando...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Crédito</th>
                  <th>Entrada</th>
                  <th>Parcela</th>
                  <th>Segmento</th>
                  <th>Administradora</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cartas.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#64748b' }}>Nenhuma carta cadastrada</td></tr>
                ) : (
                  cartas.map(c => (
                    <tr key={c.id}>
                      <td>{fmtBRL.format(c.credito)}</td>
                      <td>{fmtBRL.format(c.entrada)}</td>
                      <td>{fmtBRL.format(c.parcela)}/mês</td>
                      <td>{segmentoLabel[c.segmento] || c.segmento}</td>
                      <td>{c.administradora}</td>
                      <td>
                        <span className={`badge badge-${c.status === 'disponivel' ? 'success' : c.status === 'reservada' ? 'warning' : 'info'}`}>
                          {statusLabel[c.status]}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn" title="Editar" onClick={() => handleEdit(c)}><Edit2 size={16} /></button>
                          <button className="icon-btn" title="Excluir" onClick={() => handleDelete(c.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
