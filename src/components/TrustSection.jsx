import { CheckCircle2, FileText, Lock, Users } from 'lucide-react';
import './TrustSection.css';

export default function TrustSection() {
  const diffs = [
    {
      icon: <CheckCircle2 size={32} color="var(--brand-primary)" />,
      title: 'Auditoria Rigorosa',
      description: 'Todas as cartas passam por um processo de due-diligence antes de entrarem para o portfólio.'
    },
    {
      icon: <Lock size={32} color="var(--brand-primary)" />,
      title: 'Segurança Jurídica',
      description: 'A transferência é feita com contratos validados, garantindo total segurança para comprador e vendedor.'
    },
    {
      icon: <FileText size={32} color="var(--brand-primary)" />,
      title: 'Processo Transparente',
      description: 'Toda a documentação é digital e você acompanha cada etapa da aprovação da administradora.'
    },
    {
      icon: <Users size={32} color="var(--brand-primary)" />,
      title: 'Consultoria Especializada',
      description: 'Nossos consultores ajudam na escolha da melhor carta para o seu perfil e momento financeiro.'
    }
  ];

  return (
    <section id="como-funciona" className="trust-section section">
      <div className="container">
        <div className="trust-header text-center">
          <h2 className="title section-title">Credibilidade e Confiança em Primeiro Lugar</h2>
          <p className="subtitle">Entenda por que somos a escolha número 1 em cartas contempladas do Brasil.</p>
        </div>
        
        <div className="grid grid-cols-4 trust-grid">
          {diffs.map((diff, index) => (
            <div key={index} className="trust-card text-center">
              <div className="icon-wrapper">
                {diff.icon}
              </div>
              <h3 className="trust-title">{diff.title}</h3>
              <p className="trust-desc">{diff.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
