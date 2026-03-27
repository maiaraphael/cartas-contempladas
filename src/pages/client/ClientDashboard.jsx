import { useEffect, useState } from 'react';
import { CheckCircle2, Copy, FileText, Upload, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './ClientDashboard.css';

const formatCurrency = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const STEPS = [
  { key: 'reservada',    label: 'Carta Reservada',             desc: 'Sinal pago com sucesso.' },
  { key: 'fichas',       label: 'Preenchimento de Fichas',     desc: 'Envie os documentos e fichas cadastrais.' },
  { key: 'analise',      label: 'Análise da Administradora',   desc: 'A administradora irá validar seu perfil (até 3 dias úteis).' },
  { key: 'assinatura',   label: 'Assinatura e Pagamento',      desc: 'Assinatura digital e quitação do saldo.' },
];

function getActiveStep(status) {
  if (status === 'pendente_doc') return 1;
  if (status === 'analise')      return 2;
  if (status === 'aprovado')     return 3;
  if (status === 'concluido')    return 4;
  return 1;
}

export default function ClientDashboard() {
  const { user, profile } = useAuth();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await supabase
        .from('clientes')
        .select('*, cartas(*)')
        .eq('user_id', user.id)
        .single();
      setCliente(data);
      setLoading(false);
    }
    load();
  }, [user]);

  const firstName = profile?.full_name?.split(' ')[0] || 'Cliente';
  const activeStep = getActiveStep(cliente?.status);
  const carta = cliente?.cartas;

  if (loading) {
    return <div className="client-dashboard"><p style={{ color: '#64748b' }}>Carregando...</p></div>;
  }

  return (
    <div className="client-dashboard">
      <div className="welcome-section">
        <h1 className="client-title">Olá, {firstName}! Muito bem vindo 👋</h1>
        <p className="client-subtitle">Acompanhe o status da transferência da sua cota contemplada.</p>
      </div>

      {!cliente ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#64748b' }}>Você ainda não possui uma cota vinculada. Entre em contato com nossa equipe.</p>
        </div>
      ) : (
        <>
          <div className="status-tracker card">
            <h3>Progresso da Entrega</h3>
            <ul className="timeline">
              {STEPS.map((step, i) => {
                const isDone = i < activeStep;
                const isActive = i === activeStep - 1 && activeStep <= STEPS.length;
                // step 0 (reservada) é sempre concluída se há cliente
                const reallyDone = i === 0 ? true : isDone && i < activeStep;
                return (
                  <li key={step.key} className={`timeline-item ${reallyDone && i < activeStep - 1 ? 'completed' : ''} ${i === activeStep - 1 ? 'active' : ''}`}>
                    <div className="point">{(reallyDone && i < activeStep - 1) && <CheckCircle2 size={16} />}</div>
                    <div className="info">
                      <h4>{step.label}</h4>
                      <p>{step.desc}</p>
                      {i === 1 && cliente.status === 'pendente_doc' && (
                        <Link to="/cliente/fichas" className="btn btn-outline small-btn">Ir para Fichas</Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="quota-details grid grid-cols-2">
            <div className="detail-card card">
              <div className="icon"><FileText size={24} color="var(--brand-primary)" /></div>
              <h4>Dados Principais da Cota</h4>
              <div className="quota-data">
                <div>
                  <span>Valor do Crédito</span>
                  <p className="large">{carta ? formatCurrency(carta.credito) : '—'}</p>
                </div>
                <hr />
                <div>
                  <span>Administradora</span>
                  <p>{carta?.administradora || '—'}</p>
                </div>
                <div>
                  <span>Segmento</span>
                  <p>{carta?.segmento || '—'}</p>
                </div>
              </div>
            </div>

            <div className="detail-card card notice-card">
              <h4>Aviso Importante</h4>
              <div className="notice-content">
                <div className="notice-icon-circle">
                  <Upload size={24} color="var(--brand-primary)" />
                </div>
                {cliente.status === 'pendente_doc' && (
                  <>
                    <h5>Faltam Documentos</h5>
                    <p>Ainda precisamos que você envie as fichas e documentos cadastrais para iniciar a análise.</p>
                    <Link to="/cliente/fichas" className="btn btn-outline" style={{ marginTop: '0.75rem', display: 'inline-block' }}>Enviar Documentos</Link>
                  </>
                )}
                {cliente.status === 'analise' && (
                  <>
                    <h5>Em Análise</h5>
                    <p>Seus documentos estão sendo analisados pela administradora. Em breve você terá uma resposta.</p>
                  </>
                )}
                {cliente.status === 'aprovado' && (
                  <>
                    <h5>Transferência Liberada!</h5>
                    <p>Parabéns! Sua transferência foi aprovada. Nossa equipe entrará em contato para os próximos passos.</p>
                  </>
                )}
                {cliente.status === 'concluido' && (
                  <>
                    <h5>Processo Concluído!</h5>
                    <p>Sua carta foi transferida com sucesso. Bem-vindo ao consórcio!</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
