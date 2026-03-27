import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle, AlertCircle, X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Fornecedores.css';

const empty = { nome: '', cnpj: '', contato: '', email: '', telefone: '', administradora: '' };

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchFornecedores(); }, []);

  async function fetchFornecedores() {
    setLoading(true);
    const { data } = await supabase.from('fornecedores').select('*').order('created_at', { ascending: false });
    setFornecedores(data || []);
    setLoading(false);
  }

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function openNew() { setForm(empty); setEditingId(null); setShowModal(true); }

  function openEdit(f) {
    setForm({ nome: f.nome, cnpj: f.cnpj || '', contato: f.contato || '', email: f.email || '', telefone: f.telefone || '', administradora: f.administradora || '' });
    setEditingId(f.id);
    setShowModal(true);
  }

  function closeModal() { setShowModal(false); setForm(empty); setEditingId(null); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    let error;
    if (editingId) {
      ({ error } = await supabase.from('fornecedores').update(form).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('fornecedores').insert(form));
    }
    setSaving(false);
    if (error) { showToast('error', error.message); return; }
    showToast('success', editingId ? 'Fornecedor atualizado!' : 'Fornecedor cadastrado!');
    closeModal();
    fetchFornecedores();
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir este fornecedor?')) return;
    const { error } = await supabase.from('fornecedores').delete().eq('id', id);
    if (error) { showToast('error', error.message); return; }
    showToast('success', 'Fornecedor excluído.');
    fetchFornecedores();
  }

  return (
    <div className="fornecedores-page">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-title">Fornecedores</h1>
          <p className="admin-page-subtitle">Gerencie os fornecedores e administradoras de consórcio.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={18} /> Novo Fornecedor</button>
      </div>

      {toast && (
        <div className={`toast-msg toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <div className="card table-card">
        <div className="table-responsive">
          {loading ? (
            <p style={{ padding: '1rem', color: '#64748b' }}>Carregando...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Administradora</th>
                  <th>CNPJ</th>
                  <th>Contato</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {fornecedores.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#64748b' }}>Nenhum fornecedor cadastrado</td></tr>
                ) : (
                  fornecedores.map(f => (
                    <tr key={f.id}>
                      <td><strong>{f.nome}</strong></td>
                      <td>{f.administradora || '—'}</td>
                      <td>{f.cnpj || '—'}</td>
                      <td>{f.contato || '—'}</td>
                      <td>{f.email || '—'}</td>
                      <td>{f.telefone || '—'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn" title="Editar" onClick={() => openEdit(f)}><Edit2 size={16} /></button>
                          <button className="icon-btn" title="Excluir" onClick={() => handleDelete(f.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
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

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h3>
              <button className="icon-btn" onClick={closeModal}><X size={20} /></button>
            </div>
            <form className="modal-body" onSubmit={handleSave}>
              {[
                { name: 'nome', label: 'Nome *', required: true, placeholder: 'Nome da empresa' },
                { name: 'administradora', label: 'Administradora', placeholder: 'Ex: Consórcio União' },
                { name: 'cnpj', label: 'CNPJ', placeholder: '00.000.000/0001-00' },
                { name: 'contato', label: 'Nome do Contato', placeholder: 'João da Silva' },
                { name: 'email', label: 'E-mail', type: 'email', placeholder: 'contato@empresa.com' },
                { name: 'telefone', label: 'Telefone', placeholder: '(11) 99999-9999' },
              ].map(field => (
                <div className="form-group" key={field.name}>
                  <label>{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={e => setForm(f => ({ ...f, [field.name]: e.target.value }))}
                    required={field.required}
                  />
                </div>
              ))}
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
