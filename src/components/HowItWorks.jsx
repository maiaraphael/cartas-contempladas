import { Search, ClipboardList, FileSignature, CheckCircle2 } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    step: '01',
    title: 'Escolha sua Carta',
    desc: 'Navegue pelo nosso portfólio de cartas contempladas disponíveis e filtre pelo valor e segmento desejado.',
    icon: <Search size={26} />,
  },
  {
    step: '02',
    title: 'Análise Personalizada',
    desc: 'Nosso consultor analisa o seu perfil e apresenta as melhores opções com projeções de economia real.',
    icon: <ClipboardList size={26} />,
  },
  {
    step: '03',
    title: 'Documentação Segura',
    desc: 'Você assina digitalmente e enviamos toda a documentação para a administradora (Consórcio União).',
    icon: <FileSignature size={26} />,
  },
  {
    step: '04',
    title: 'Crédito Liberado!',
    desc: 'Aprovado pela administradora, o crédito é transferido para o seu nome em poucos dias.',
    icon: <CheckCircle2 size={26} />,
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="howitworks section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Simples assim</span>
          <h2 className="section-heading">Como Funciona em <span className="heading-accent">4 Passos</span></h2>
          <p className="section-subheading">Todo o processo guiado pelos nossos especialistas, do início ao crédito na sua mão.</p>
        </div>

        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-top">
                <div className="step-icon-wrap">{s.icon}</div>
                <div className="step-num">{s.step}</div>
              </div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
              {i < steps.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
