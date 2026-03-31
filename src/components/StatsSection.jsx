import { DollarSign, Users, CheckCircle2, Zap } from 'lucide-react';
import './StatsSection.css';

const stats = [
  { value: 'R$ 10M+', label: 'Em créditos transferidos', icon: <DollarSign size={28} /> },
  { value: '50+', label: 'Clientes atendidos', icon: <Users size={28} /> },
  { value: '97%', label: 'Taxa de aprovação', icon: <CheckCircle2 size={28} /> },
  { value: '< 15 dias', label: 'Tempo médio de transferência', icon: <Zap size={28} /> },
];

export default function StatsSection() {
  return (
    <section className="stats-section">
      <div className="container stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-icon-wrap">{s.icon}</div>
            <p className="stat-val">{s.value}</p>
            <p className="stat-lbl">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
