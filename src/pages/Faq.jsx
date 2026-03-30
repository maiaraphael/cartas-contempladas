import Header from '../components/Header';
import Footer from '../components/Footer';

const duvidas = [
  {
    pergunta: 'O que é uma carta de consórcio contemplada?',
    resposta: 'Uma carta de consórcio contemplada é uma cota de consórcio que já foi sorteada ou teve seu crédito liberado por meio de lance, estando pronta para ser utilizada imediatamente pelo novo titular. Ao adquirir uma carta contemplada, o comprador elimina o tempo de espera pelo sorteio, podendo acessar o crédito de forma ágil e segura.'
  },
  {
    pergunta: 'Quais são os principais benefícios de adquirir uma carta contemplada?',
    resposta: 'Os principais benefícios incluem: acesso imediato ao crédito, ausência de juros bancários (apenas taxa de administração), possibilidade de negociação do valor de entrada, flexibilidade para aquisição de bens ou serviços conforme o segmento da carta, e maior poder de barganha na negociação do bem desejado.'
  },
  {
    pergunta: 'Para quais finalidades posso utilizar o crédito da carta contemplada?',
    resposta: 'O crédito pode ser utilizado para aquisição de bens ou serviços de acordo com o segmento da carta, como imóveis residenciais ou comerciais, veículos leves ou pesados, serviços diversos, entre outros. É fundamental respeitar as regras e restrições estabelecidas pela administradora do consórcio.'
  },
  {
    pergunta: 'Como ocorre o processo de transferência da carta contemplada?',
    resposta: 'O processo de transferência envolve a análise documental do comprador pela administradora, que verifica a capacidade financeira e a regularidade cadastral. Após aprovação, a titularidade da cota é transferida juridicamente para o novo consorciado, garantindo segurança e transparência em todo o procedimento.'
  },
  {
    pergunta: 'Quais documentos são exigidos para a transferência?',
    resposta: 'Geralmente, são solicitados documentos pessoais (RG, CPF), comprovante de residência, comprovante de renda, certidões negativas e, em alguns casos, documentação adicional conforme o perfil do comprador e exigências da administradora.'
  },
  {
    pergunta: 'A compra de carta contemplada é segura?',
    resposta: 'Sim, desde que realizada com empresas idôneas e que ofereçam garantia jurídica de transferência. Recomenda-se sempre verificar a reputação da administradora e do vendedor, exigir contratos claros e, se possível, consultar um especialista ou advogado para análise da documentação.'
  },
  {
    pergunta: 'É possível antecipar ou quitar parcelas da carta contemplada?',
    resposta: 'Sim. A maioria das administradoras permite a antecipação ou quitação total das parcelas, o que pode gerar descontos e reduzir o custo total do consórcio. Consulte as condições específicas junto à administradora responsável.'
  },
  {
    pergunta: 'Como posso verificar a autenticidade da contemplação?',
    resposta: 'Solicite sempre documentos oficiais que comprovem a contemplação e, se necessário, entre em contato diretamente com a administradora para confirmar a situação da cota antes de concluir a compra.'
  },
  {
    pergunta: 'Quais custos estão envolvidos na aquisição de uma carta contemplada?',
    resposta: 'Além do valor da entrada e das parcelas restantes, podem incidir taxas de transferência, tarifas administrativas e eventuais custos cartorários. Solicite sempre um detalhamento completo de todos os encargos antes de fechar negócio.'
  },
  {
    pergunta: 'O valor da entrada pode ser negociado?',
    resposta: 'Sim, em muitos casos o valor da entrada é negociável diretamente com o vendedor da carta contemplada, permitindo condições mais flexíveis de acordo com o perfil do comprador.'
  },
  {
    pergunta: 'Quais cuidados devo tomar antes de comprar uma carta contemplada?',
    resposta: 'Verifique a idoneidade da empresa e da administradora, exija contratos detalhados, confira a situação da cota junto à administradora, analise todas as condições financeiras e, se possível, conte com o apoio de um especialista para garantir uma transação segura.'
  },
  {
    pergunta: 'Posso utilizar o FGTS na compra de carta contemplada de imóveis?',
    resposta: 'Sim, em muitos casos é possível utilizar o saldo do FGTS para complementar a aquisição de imóveis por meio de carta contemplada, desde que atendidas as regras da Caixa Econômica Federal e da administradora do consórcio.'
  },
  {
    pergunta: 'O que acontece se eu atrasar o pagamento das parcelas?',
    resposta: 'O atraso pode gerar multas, juros e até a exclusão do consorciado do grupo, conforme previsto em contrato. É fundamental manter os pagamentos em dia para preservar os direitos sobre a carta contemplada.'
  }
];

export default function Faq() {
  return (
    <>
      <Header />
      <main className="faq-container" style={{ minHeight: '60vh', padding: '2rem 0' }}>
        <div className="container">
          <h1 className="section-title" style={{ textAlign: 'center', marginBottom: 32 }}>Dúvidas Frequentes</h1>
          <div className="faq-list" style={{ maxWidth: 700, margin: '0 auto' }}>
            {duvidas.map((item, idx) => (
              <div key={idx} className="faq-item" style={{ marginBottom: 24 }}>
                <h3 style={{ color: '#ea580c', marginBottom: 8 }}>{item.pergunta}</h3>
                <p style={{ color: '#64748b', fontSize: 17 }}>{item.resposta}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
