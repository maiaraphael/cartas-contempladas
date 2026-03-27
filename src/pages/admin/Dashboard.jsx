import { useEffect, useState } from 'react';
import { Activity, CreditCard, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './Dashboard.css';

const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ leads: 0, cartasAtivas: 0, cartasVendidas: 0, volume: 0 });
  const [recentClientes, setRecentClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [
        { count: leads },
        { count: cartasAtivas },
        { count: cartasVendidas },
        { data: vendidas },
        { data: recentes },
      ] = await Promise.all([
        supabase.from('clientes').select('*', { count: 'exact', head: true }),
        supabase.from('cartas').select('*', { count: 'exact', head: true }).eq('status', 'disponivel'),
        supabase.from('cartas').select('*', { count: 'exact', head: true }).eq('status', 'vendida'),
        supabase.from('cartas').select('credito').eq('status', 'vendida'),
        supabase.from('clientes').select('nome, email, interesse, status, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      const volume = vendidas?.reduce((sum, c) => sum + (c.credito || 0), 0) || 0;
      setStats({ leads: leads || 0, cartasAtivas: cartasAtivas || 0, cartasVendidas: cartasVendidas || 0, volume });
      setRecentClientes(recentes || []);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { title: 'Total de Clientes', value: stats.leads, icon: <Users size={24} />, trend: 'Cadastrados na plataforma' },
    { title: 'Cartas Ativas', value: stats.cartasAtivas, icon: <CreditCard size={24} />, trend: 'Disponíveis no site' },
    { title: 'Cartas Vendidas', value: stats.cartasVendidas, icon: <Activity size={24} />, trend: 'Concluídas' },
    { title: 'Volume Negociado', value: fmt.format(stats.volume), icon: <TrendingUp size={24} />, trend: 'Total em créditos vendidos' },
  ];

  const getStatusBadge = (status) => {
    const map = {
      pendente_doc: <span className="badge badge-warning">Pendente Fichas</span>,
      analise: <span className="badge badge-info">Em Análise</span>,
      aprovado: <span className="badge badge-success">Aprovado</span>,
      concluido: <span className="badge badge-success">Concluído</span>,
    };
    return map[status] || <span className="badge badge-novo">Novo</span>;
  };

  return (
    <div className="dashboard">
      <h1 className="admin-page-title">Visão Geral</h1>
      <p className="admin-page-subtitle">Acompanhe as métricas principais do seu negócio de consórcios.</p>
      
      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card card">
            <div className="stat-header">
              <h3 className="stat-title">{stat.title}</h3>
              <div className="stat-icon">{stat.icon}</div>
            </div>
            <div className="stat-body">
              <p className="stat-value">{loading ? '...' : stat.value}</p>
              <p className="stat-trend">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content grid grid-cols-2">
        <div className="card recent-leads">
          <div className="card-header">
            <h3>Clientes Recentes</h3>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <p style={{ padding: '1rem', color: '#64748b' }}>Carregando...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Interesse</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClientes.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: '#64748b' }}>Nenhum cliente ainda</td></tr>
                  ) : (
                    recentClientes.map((c, i) => (
                      <tr key={i}>
                        <td>{c.nome}</td>
                        <td>{c.interesse || '—'}</td>
                        <td>{getStatusBadge(c.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card quick-actions">
          <div className="card-header">
            <h3>Ações Rápidas</h3>
          </div>
          <div className="card-body quick-actions-body">
            <button className="btn btn-outline w-100" onClick={() => navigate('/admin/cartas')}>Adicionar Nova Carta</button>
            <button className="btn btn-outline w-100" onClick={() => navigate('/admin/clientes')}>Ver Clientes</button>
            <button className="btn btn-outline w-100" onClick={() => navigate('/admin/fornecedores')}>Gerenciar Fornecedores</button>
          </div>
        </div>
      </div>
    </div>
  );
}
