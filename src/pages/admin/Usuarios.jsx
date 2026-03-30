import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle, AlertCircle, X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './Usuarios.css';

const ROLES = ['admin', 'vendedor', 'financeiro', 'cliente'];
const ROLE_LABELS = { admin: 'Administrador', vendedor: 'Vendedor', financeiro: 'Financeiro', cliente: 'Cliente' };

export default function Usuarios() {
  const { profile: myProfile } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', role: 'vendedor', phone: '', password: '' });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
    // Excluir usuário (apenas admin)
    async function handleDeleteUser(user) {
      if (!window.confirm(`Tem certeza que deseja excluir o usuário ${user.full_name}? Essa ação não pode ser desfeita.`)) return;
      setDeletingId(user.id);
      // Remove do auth (admin API) e do profile
      try {
        // Remove do auth.users (se possível)
        if (supabase.auth.admin && supabase.auth.admin.deleteUser) {
          await supabase.auth.admin.deleteUser(user.id);
        }
        // Remove do profiles
        await supabase.from('profiles').delete().eq('id', user.id);
        showToast('success', 'Usuário excluído com sucesso!');
        fetchUsuarios();
      } catch (err) {
        showToast('error', err.message || 'Erro ao excluir usuário.');
      }
      setDeletingId(null);
    }
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchUsuarios(); }, []);

  async function fetchUsuarios() {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsuarios(data || []);
    setLoading(false);
  }

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  }

  function openNew() {
    setForm({ full_name: '', email: '', role: 'vendedor', phone: '', password: '' });
    setEditingId(null);
    setShowModal(true);
  }

  function openEdit(u) {
    setForm({ full_name: u.full_name, email: u.email, role: u.role, phone: u.phone || '', password: '' });
    setEditingId(u.id);
    setShowModal(true);
  }

  function closeModal() { setShowModal(false); setEditingId(null); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    if (editingId) {
      // Atualiza profile existente (apenas role, nome, telefone)
      const { error } = await supabase.from('profiles').update({
        full_name: form.full_name,
        role: form.role,
        phone: form.phone,
      }).eq('id', editingId);
      setSaving(false);
      if (error) { showToast('error', error.message); return; }
      showToast('success', 'Usuário atualizado com sucesso!');
    } else {
      // Cria novo usuário via Supabase Admin API (requer service role)
      let userId = null;
      let userEmail = form.email;
      let userNome = form.full_name;
      let userTelefone = form.phone;
      let userRole = form.role;
      let userCreated = null;
      let error = null;
      if (supabase.auth.admin && supabase.auth.admin.createUser) {
        const { data, error: adminError } = await supabase.auth.admin.createUser({
          email: form.email,
          password: form.password,
          email_confirm: true,
          user_metadata: { full_name: form.full_name, role: form.role },
        });
        error = adminError;
        if (data && data.user) {
          userId = data.user.id;
          userCreated = data.user.created_at;
        }
      }
      if (error) {
        setSaving(false);
        showToast('error', error.message);
        return;
      } else {
        setSaving(false);
        showToast('success', 'Usuário criado com sucesso!');
      }
      // Se for cliente, cria também na tabela clientes
      if (userId && userRole === 'cliente') {
        await supabase.from('clientes').insert({
          user_id: userId,
          nome: userNome,
          email: userEmail,
          telefone: userTelefone,
          status: 'pendente_doc',
        });
      }
    }

    closeModal();
    fetchUsuarios();
  }

  async function handleRoleChange(userId, newRole) {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) { showToast('error', error.message); return; }
    showToast('success', 'Role atualizado!');
    fetchUsuarios();
  }

  const roleBadge = (role) => {
    const colors = { admin: '#1e3a5f', vendedor: '#0891b2', financeiro: '#7c3aed', cliente: '#64748b' };
    return (
      <span style={{
        background: colors[role] || '#64748b', color: '#fff',
        padding: '2px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600,
      }}>
        {ROLE_LABELS[role] || role}
      </span>
    );
  };

  return (
    <div className="usuarios-page">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-title">Usuários do Sistema</h1>
          <p className="admin-page-subtitle">Gerencie usuários, papéis e permissões de acesso.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={18} /> Novo Usuário</button>
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
                  <th>Usuário</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Role</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b' }}>Nenhum usuário</td></tr>
                ) : (
                  usuarios.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div className="client-avatar">{u.full_name?.charAt(0) || '?'}</div>
                          <span style={{ fontWeight: 500 }}>{u.full_name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td>
                        {myProfile?.role === 'admin' && u.id !== myProfile.id ? (
                          <select
                            value={u.role}
                            onChange={e => handleRoleChange(u.id, e.target.value)}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.875rem' }}
                          >
                            {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                          </select>
                        ) : roleBadge(u.role)}
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                      <td style={{display:'flex',gap:8}}>
                        <button className="icon-btn" title="Editar" onClick={() => openEdit(u)}><Edit2 size={16} /></button>
                        {myProfile?.role === 'admin' && u.id !== myProfile.id && (
                          <button className="icon-btn" title="Excluir" onClick={() => handleDeleteUser(u)} disabled={deletingId===u.id} style={{color:'#e11d48'}}>
                            <Trash2 size={16} />
                          </button>
                        )}
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
              <h3>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
              <button className="icon-btn" onClick={closeModal}><X size={20} /></button>
            </div>
            <form className="modal-body" onSubmit={handleSave}>
              <div className="form-group">
                <label>Nome Completo *</label>
                <input type="text" placeholder="João da Silva" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required />
              </div>
              {!editingId && (
                <>
                  <div className="form-group">
                    <label>E-mail *</label>
                    <input type="email" placeholder="joao@empresa.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Senha inicial *</label>
                    <input type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Telefone</label>
                <input type="text" placeholder="(11) 99999-9999" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Role / Permissão *</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                </select>
              </div>
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
