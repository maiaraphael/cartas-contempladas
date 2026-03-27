import './Testimonials.css';

const testimonials = [
  {
    name: 'Fernanda Mota',
    role: 'Compradora de imóvel em SP',
    avatar: 'FM',
    stars: 5,
    text: 'Comprei uma carta contemplada de R$ 300 mil e economizei quase R$ 110 mil comparado ao financiamento do banco. O processo foi muito seguro e rápido, a equipe me guiou em tudo!',
  },
  {
    name: 'Ricardo Andrade',
    role: 'Empresário, adquiriu carta de veículo',
    avatar: 'RA',
    stars: 5,
    text: 'Precisava de um veículo para minha empresa. Com a carta contemplada consegui adquirir sem juros exorbitantes. Aprovado em menos de 10 dias. Recomendo muito!',
  },
  {
    name: 'Juliana Carvalho',
    role: 'Investidora, 2ª carta adquirida',
    avatar: 'JC',
    stars: 5,
    text: 'Já adquiri 2 cartas com eles. Excelente forma de investir e usar o crédito com muito mais inteligência. Transparente, rápido e seguro. Nota 10!',
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Quem já transformou</span>
          <h2 className="section-heading">Clientes que <span className="heading-accent">Realizaram Sonhos</span></h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="stars">{'⭐'.repeat(t.stars)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.avatar}</div>
                <div>
                  <p className="author-name">{t.name}</p>
                  <p className="author-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
