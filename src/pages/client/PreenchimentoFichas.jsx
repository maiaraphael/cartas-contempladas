import { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, FileCheck, Trash2, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './PreenchimentoFichas.css';

const TIPOS = [
  { key: 'ficha_transferencia',    label: '1. Ficha de Transferência (Administradora)', desc: 'Documento assinado e reconhecido firma (obrigatório).', accept: '.pdf',              hint: 'PDF · Máx. 5MB',          required: true },
  { key: 'doc_pessoal',            label: '2. Documentos Pessoais do Comprador',         desc: 'CNH ou RG com CPF.',                                    accept: '.pdf,.jpg,.jpeg,.png', hint: 'PDF, JPG, PNG · Máx. 5MB', required: true },
  { key: 'comprovante_renda',      label: '3a. Comprovante de Renda',                    desc: '3 últimos meses.',                                       accept: '.pdf,.jpg,.jpeg,.png', hint: 'PDF, JPG, PNG · Máx. 5MB', required: true },
  { key: 'comprovante_residencia', label: '3b. Comprovante de Residência',               desc: 'Atualizado (últimos 90 dias).',                          accept: '.pdf,.jpg,.jpeg,.png', hint: 'PDF, JPG, PNG · Máx. 5MB', required: true },
];

const MAX_SIZE = 5 * 1024 * 1024;

export default function PreenchimentoFichas() {
  const { user } = useAuth();
  const [clienteId, setClienteId] = useState(null);
  const [uploads, setUploads] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const refs = useRef({});

  useEffect(() => {
    async function loadCliente() {
      if (!user) return;
      const { data } = await supabase
        .from('clientes')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setClienteId(data.id);
        const { data: docs } = await supabase
          .from('documentos')
          .select('*')
          .eq('cliente_id', data.id);
        if (docs) {
          const map = {};
          docs.forEach(d => {
            map[d.tipo] = { done: true, url: d.arquivo_url, existingId: d.id, nome: d.nome_arquivo };
          });
          setUploads(map);
        }
      }
    }
    loadCliente();
  }, [user]);

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  }

  function handleFileSelect(tipo, file) {
    if (!file) return;
    if (file.size > MAX_SIZE) {
      setUploads(u => ({ ...u, [tipo]: { error: 'Arquivo maior que 5MB.' } }));
      return;
    }
    setUploads(u => ({ ...u, [tipo]: { file, error: null, done: false } }));
  }

  async function uploadFile(tipo) {
    const entry = uploads[tipo];
    if (!entry?.file || !clienteId || !user) return;

    setUploads(u => ({ ...u, [tipo]: { ...u[tipo], uploading: true, error: null } }));

    const ext = entry.file.name.split('.').pop();
    const path = `${user.id}/${tipo}_${Date.now()}.${ext}`;

    const { error: storageError } = await supabase.storage
      .from('documentos')
      .upload(path, entry.file, { upsert: true });

    if (storageError) {
      setUploads(u => ({ ...u, [tipo]: { ...u[tipo], uploading: false, error: storageError.message } }));
      return;
    }

    if (uploads[tipo]?.existingId) {
      await supabase.from('documentos').delete().eq('id', uploads[tipo].existingId);
    }

    const { data: doc, error: dbError } = await supabase.from('documentos').insert({
      cliente_id: clienteId,
      tipo,
      arquivo_url: path,
      nome_arquivo: entry.file.name,
      tamanho: entry.file.size,
    }).select().single();

    if (dbError) {
      setUploads(u => ({ ...u, [tipo]: { ...u[tipo], uploading: false, error: dbError.message } }));
      return;
    }

    setUploads(u => ({ ...u, [tipo]: { done: true, url: path, existingId: doc.id, nome: entry.file.name, uploading: false } }));
  }

  async function removeFile(tipo) {
    const entry = uploads[tipo];
    if (entry?.existingId) {
      if (entry.url) await supabase.storage.from('documentos').remove([entry.url]);
      await supabase.from('documentos').delete().eq('id', entry.existingId);
    }
    setUploads(u => ({ ...u, [tipo]: {} }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!clienteId) {
      showToast('error', 'Você não possui uma cota vinculada. Contate nossa equipe.');
      return;
    }

    const missing = TIPOS.filter(t => t.required && !uploads[t.key]?.done);
    if (missing.length > 0) {
      showToast('error', `Faça o upload de: ${missing.map(t => t.label).join(', ')}`);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase
      .from('clientes')
      .update({ status: 'analise', updated_at: new Date().toISOString() })
      .eq('id', clienteId);

    setSubmitting(false);
    if (error) { showToast('error', error.message); return; }
    showToast('success', 'Fichas enviadas para análise com sucesso! Aguarde o retorno da nossa equipe.');
  }

  return (
    <div className="client-fichas">
      <div className="welcome-section">
        <h1 className="client-title">Preenchimento de Fichas</h1>
        <p className="client-subtitle">Complete seu cadastro para avançarmos com a análise de transferência.</p>
      </div>

      {toast && (
        <div className={`toast-msg toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <div className="card client-form-card">
        <form className="ficha-form" onSubmit={handleSubmit}>
          {TIPOS.map(tipo => {
            const entry = uploads[tipo.key] || {};
            return (
              <div className="form-section" key={tipo.key}>
                <h3 className="section-title">{tipo.label}</h3>
                <p className="section-desc">{tipo.desc}</p>

                {entry.done ? (
                  <div className="file-success">
                    <FileCheck size={20} />
                    <span>{entry.nome || 'Arquivo enviado'}</span>
                    <button type="button" className="icon-btn" title="Remover" onClick={() => removeFile(tipo.key)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className="upload-area"
                      onClick={() => refs.current[tipo.key]?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); handleFileSelect(tipo.key, e.dataTransfer.files[0]); }}
                    >
                      <div className="upload-icon"><UploadCloud size={32} /></div>
                      <p className="upload-text">
                        {entry.file ? entry.file.name : <><span>Clique ou arraste</span> o arquivo aqui</>}
                      </p>
                      <p className="upload-hint">{tipo.hint}</p>
                      <input
                        ref={el => (refs.current[tipo.key] = el)}
                        type="file"
                        accept={tipo.accept}
                        style={{ display: 'none' }}
                        onChange={e => handleFileSelect(tipo.key, e.target.files[0])}
                      />
                    </div>

                    {entry.error && (
                      <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.5rem' }}>{entry.error}</p>
                    )}

                    {entry.file && !entry.done && (
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ marginTop: '0.75rem' }}
                        disabled={entry.uploading}
                        onClick={() => uploadFile(tipo.key)}
                      >
                        {entry.uploading ? 'Enviando...' : 'Enviar arquivo'}
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}

          <div className="form-actions border-t">
            <button type="submit" className="btn btn-primary" disabled={submitting || !clienteId}>
              <Send size={20} /> {submitting ? 'Enviando...' : 'Enviar Fichas para Análise'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
