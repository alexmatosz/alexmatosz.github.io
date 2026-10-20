import bling from '@/assets/logos/bling.svg'
import mercadolivre from '@/assets/logos/mercadolivre.svg'
import replique from '@/assets/logos/replique.svg'
import shopee from '@/assets/logos/shopee.svg'

// Guias "como eu opero" de cada canal. O texto ainda é rascunho (draft: true mostra um selo só no
// `npm run dev`); por enquanto existe só em português, e o site avisa isso quando está em inglês.

export type GuidePoint = { title: string; text: string }

export type GuideSection = {
  id: string
  /** nome curto, usado no índice lateral */
  label: string
  title: string
  lead: string
  points: GuidePoint[]
  /** comparação "jeito comum" × "jeito certo" */
  compare?: { wrong: string[]; right: string[] }
}

export type Guide = {
  slug: string
  name: string
  logo: string
  /** linha curta embaixo do nome na lista da home */
  tag: string
  /** resumo que aparece ao lado, na home */
  summary: string
  /** tópicos do guia, em chips no resumo */
  topics: string[]
  hero: { kicker: string; title: string; lead: string }
  problem: { title: string; paragraphs: string[]; symptoms: string[] }
  sections: GuideSection[]
  approach: { title: string; steps: GuidePoint[] }
  tools: { name: string; why: string }[]
  draft: boolean
}

export const guides: Guide[] = [
  {
    slug: 'mercado-livre',
    name: 'Mercado Livre',
    logo: mercadolivre,
    tag: 'anúncio, preço, Full e reputação',
    summary:
      'O maior marketplace do país também é o que mais pune operação desorganizada. Anúncio fora do padrão some da busca, preço feito no olho come a margem e Full sem planejamento vira estoque parado pagando armazenagem.',
    topics: ['Padrão de anúncio', 'Precificação', 'Mercado Envios Full', 'Reputação', 'Ferramentas'],
    hero: {
      kicker: 'guia · mercado livre',
      title: 'Fazer o Mercado Livre rodar redondo',
      lead: 'Vender no Mercado Livre é fácil. Vender com margem, sem perder reputação e sem a equipe passar o dia apagando incêndio, é outra conversa. É aqui que eu trabalho.',
    },
    problem: {
      title: 'O problema na maioria das contas',
      paragraphs: [
        'A maior parte das contas que eu vejo cresceu no improviso: cada anúncio foi criado por uma pessoa diferente, de um jeito diferente, e o preço foi definido olhando o concorrente. Funciona enquanto o volume é pequeno.',
        'Quando o volume cresce, os custos escondidos aparecem: tarifa e frete que mudam por categoria e faixa de preço, campanhas que entram sem ninguém fazer a conta, estoque que acaba num canal e continua à venda no outro. O faturamento sobe e o lucro não acompanha.',
      ],
      symptoms: [
        'Anúncios com título, fotos e ficha técnica cada um de um jeito',
        'Preço calculado sem tarifa, frete, imposto e embalagem na conta',
        'Venda sem estoque, cancelamento e reputação caindo',
        'Produto no Full parado há meses gerando custo',
        'Perguntas respondidas tarde, venda perdida para o concorrente',
      ],
    },
    sections: [
      {
        id: 'anuncio',
        label: 'Padrão de anúncio',
        title: 'Padrão de anúncio',
        lead: 'O algoritmo do Mercado Livre premia anúncio completo e consistente. Um padrão escrito faz qualquer pessoa da equipe criar um anúncio bom, não só a mais experiente.',
        points: [
          { title: 'Título que a busca entende', text: 'Produto + marca + modelo + atributo principal (cor, tamanho, voltagem). Sem palavras como "promoção" ou "frete grátis", que não ajudam na busca e podem ir contra as regras.' },
          { title: 'Ficha técnica 100% preenchida', text: 'Os atributos alimentam os filtros da busca. Atributo vazio é anúncio que não aparece quando o comprador filtra.' },
          { title: 'Fotos no padrão da categoria', text: 'Capa com fundo branco e o produto inteiro; depois detalhes, uso e medidas. Mesma ordem em todos os anúncios da loja.' },
          { title: 'Variações no lugar certo', text: 'Cor e tamanho como variações de um anúncio só, para somar vendas e avaliações em vez de espalhar em dez anúncios fracos.' },
          { title: 'Catálogo quando fizer sentido', text: 'Em produtos de catálogo, quem ganha a vitrine é quem tem o melhor conjunto de preço, frete e reputação. Vale saber quando entrar e quando não.' },
        ],
        compare: {
          wrong: ['Cada pessoa cria do seu jeito', 'Ficha técnica só com o obrigatório', 'Um anúncio para cada cor'],
          right: ['Modelo de anúncio documentado', 'Todos os atributos preenchidos', 'Variações agrupadas, vendas somadas'],
        },
      },
      {
        id: 'precificacao',
        label: 'Precificação',
        title: 'Precificação',
        lead: 'Preço bom não é o mais baixo da busca, é o que paga todos os custos e ainda deixa margem. Para isso, a conta precisa estar inteira.',
        points: [
          { title: 'Custo real do produto', text: 'Custo de compra ou de produção, embalagem e etiqueta. Parece óbvio, mas é onde muita planilha já começa errada.' },
          { title: 'Custos do canal', text: 'Tarifa de venda do tipo de anúncio (Clássico ou Premium), custo fixo por faixa de preço e frete. Mudam por categoria e por faixa de preço, então a conta é por produto.' },
          { title: 'Imposto', text: 'O regime tributário da empresa entra no preço. Sem ele a margem parece maior do que é.' },
          { title: 'Margem de contribuição', text: 'O que sobra depois de todos os custos variáveis. É o número que diz se vale a pena entrar numa campanha ou dar desconto.' },
          { title: 'Campanhas e Ads com a conta feita', text: 'Desconto de campanha e investimento em Mercado Ads saem da margem. Antes de aceitar, simular; depois, medir.' },
        ],
        compare: {
          wrong: ['Copiar o preço do concorrente', 'Markup fixo para todo o catálogo', 'Entrar em toda campanha sugerida'],
          right: ['Preço calculado por produto e por canal', 'Margem mínima definida', 'Campanha só quando a conta fecha'],
        },
      },
      {
        id: 'full',
        label: 'Full',
        title: 'Mercado Envios Full',
        lead: 'O Full coloca o seu estoque no centro de distribuição do Mercado Livre: entrega mais rápida e mais exposição. Mas é estoque fora de casa, e estoque parado custa.',
        points: [
          { title: 'Quais produtos mandar', text: 'Começar pela curva A: produtos que giram e têm margem para absorver o custo do Full. Produto de giro lento fica melhor no envio próprio.' },
          { title: 'Quanto mandar', text: 'Cobertura de estoque calculada pelo histórico de vendas, para não faltar nem sobrar. Reposição planejada antes de zerar.' },
          { title: 'Acompanhar estoque parado', text: 'Produto que não gira gera custo de armazenagem. Revisar com frequência e retirar, promover ou ajustar antes que vire prejuízo.' },
          { title: 'Estoque separado no ERP', text: 'Estoque do Full e estoque da loja em depósitos diferentes no Bling, para um não vender o que é do outro.' },
        ],
      },
      {
        id: 'reputacao',
        label: 'Reputação',
        title: 'Reputação e atendimento',
        lead: 'A reputação decide exposição e até o tipo de envio disponível. Ela cai por problemas de processo, não por azar.',
        points: [
          { title: 'Cancelamento zero por falta de estoque', text: 'Estoque sincronizado entre todos os canais pelo ERP. É a causa número um de cancelamento que eu encontro.' },
          { title: 'Despacho no prazo', text: 'Rotina diária de separação e expedição, com corte de horário claro para a equipe.' },
          { title: 'Perguntas respondidas rápido', text: 'Quem responde primeiro vende. Respostas-modelo para as perguntas mais comuns e anúncio completo para que elas nem precisem ser feitas.' },
          { title: 'Reclamação tratada como dado', text: 'Cada reclamação aponta um problema de anúncio, embalagem ou produto. Corrigir a causa, não só responder.' },
        ],
      },
    ],
    approach: {
      title: 'Como eu faço isso rodar',
      steps: [
        { title: 'Diagnóstico', text: 'Levanto anúncios, preços, custos e reputação da conta e mostro onde a margem e as vendas estão escapando.' },
        { title: 'Padrão e planilha de preço', text: 'Documento o padrão de anúncio e monto a precificação por produto, com todos os custos do canal.' },
        { title: 'ERP no centro', text: 'Bling como fonte única de produto, estoque e pedido, integrado a todos os canais.' },
        { title: 'Automação do repetitivo', text: 'O que a equipe faz toda semana na mão vira processo automático: publicação, atualização de preço e estoque.' },
        { title: 'Rotina e acompanhamento', text: 'Indicadores simples para acompanhar toda semana e ajustar antes que o problema apareça na reputação.' },
      ],
    },
    tools: [
      { name: 'Bling', why: 'produto, estoque, pedidos e nota fiscal num lugar só' },
      { name: 'Planilha de precificação', why: 'margem por produto, já com tarifa, frete e imposto' },
      { name: 'Replique', why: 'publicar e replicar anúncios no padrão, com IA' },
      { name: 'API do Mercado Livre', why: 'automação do que a tela do vendedor não faz em lote' },
    ],
    draft: true,
  },
  {
    slug: 'shopee',
    name: 'Shopee',
    logo: shopee,
    tag: 'anúncio, comissão, frete e campanhas',
    summary:
      'Na Shopee o volume vem rápido, mas a margem é apertada. Comissão, taxa por item, programas de frete e cupons precisam estar na conta, e o anúncio precisa ser pensado para quem compra pelo celular.',
    topics: ['Padrão de anúncio', 'Precificação', 'Campanhas e cupons', 'Envio e prazos', 'Ferramentas'],
    hero: {
      kicker: 'guia · shopee',
      title: 'Shopee com margem, não só com volume',
      lead: 'A Shopee dá volume para quem entende a dinâmica dela: preço competitivo, campanhas o tempo todo e um comprador que decide em segundos pelo celular. O segredo é crescer sem trabalhar de graça.',
    },
    problem: {
      title: 'O problema mais comum',
      paragraphs: [
        'Muita loja leva para a Shopee o mesmo anúncio e o mesmo preço do Mercado Livre. Os custos são diferentes, o comprador é diferente e a busca funciona de outro jeito, então o resultado não aparece ou aparece sem lucro.',
        'Também é comum entrar em toda campanha e programa disponível sem calcular o impacto. Cada um tem um custo, e somados eles podem levar a margem a zero.',
      ],
      symptoms: [
        'Mesmo preço em todos os canais, ignorando as taxas de cada um',
        'Anúncio sem vídeo, com foto que não funciona na tela do celular',
        'Campanhas e cupons sem saber quanto custam',
        'Atraso no envio derrubando a avaliação da loja',
        'Chat sem resposta e taxa de resposta baixa',
      ],
    },
    sections: [
      {
        id: 'anuncio',
        label: 'Padrão de anúncio',
        title: 'Padrão de anúncio',
        lead: 'O comprador da Shopee rola rápido pelo celular. O anúncio precisa chamar atenção na miniatura e responder as dúvidas antes da pergunta.',
        points: [
          { title: 'Título com as palavras que o comprador digita', text: 'Produto, marca, modelo e os termos de busca mais usados na categoria, sem repetir palavra à toa.' },
          { title: 'Capa pensada para a miniatura', text: 'Produto grande e legível em tela pequena. Nas fotos seguintes: detalhes, medidas e uso.' },
          { title: 'Vídeo curto', text: 'Mostrar o produto em uso ajuda na conversão e no destaque do anúncio.' },
          { title: 'Variações e atributos completos', text: 'Cor e tamanho bem organizados, atributos da categoria preenchidos e peso e medidas corretos para o frete sair certo.' },
        ],
      },
      {
        id: 'precificacao',
        label: 'Precificação',
        title: 'Precificação',
        lead: 'A estrutura de custo da Shopee é diferente da do Mercado Livre, então o preço também precisa ser.',
        points: [
          { title: 'Comissão e taxa por item', text: 'Entram em toda venda. Produto barato sente muito mais a taxa fixa, e às vezes vale vender em kit.' },
          { title: 'Programas de frete e de campanhas', text: 'Participar aumenta a exposição, mas aumenta a comissão. A conta mostra em quais produtos compensa.' },
          { title: 'Preço por canal', text: 'Cada canal com o seu preço, calculado a partir dos custos dele, e não uma cópia do preço do outro.' },
          { title: 'Kits para subir o ticket', text: 'Combinar produtos aumenta o valor do pedido e dilui a taxa fixa.' },
        ],
        compare: {
          wrong: ['Copiar o preço do Mercado Livre', 'Aderir a todo programa', 'Produto barato vendido sozinho'],
          right: ['Preço calculado com as taxas da Shopee', 'Programa só onde a margem aguenta', 'Kits para diluir a taxa fixa'],
        },
      },
      {
        id: 'campanhas',
        label: 'Campanhas',
        title: 'Campanhas, cupons e Ads',
        lead: 'A Shopee vive de datas promocionais. Ficar fora custa vendas, entrar sem preparo custa margem.',
        points: [
          { title: 'Calendário de campanhas', text: 'Planejar as datas grandes com antecedência: estoque, preço e cupons definidos antes, não na véspera.' },
          { title: 'Cupom da loja com objetivo', text: 'Cupom para subir o ticket ou para recompra, com valor mínimo que mantém a margem.' },
          { title: 'Shopee Ads medido', text: 'Investimento em anúncio patrocinado acompanhado pelo retorno, produto a produto.' },
        ],
      },
      {
        id: 'envio',
        label: 'Envio e prazos',
        title: 'Envio, prazos e avaliação',
        lead: 'A avaliação da loja depende de enviar no prazo e de responder rápido. Os dois são processo.',
        points: [
          { title: 'Despacho no prazo', text: 'Pedidos da Shopee entrando na mesma rotina de separação dos outros canais, pelo ERP.' },
          { title: 'Estoque sincronizado', text: 'Venda sem estoque vira cancelamento e penalidade. O estoque precisa ser um só para todos os canais.' },
          { title: 'Chat respondido', text: 'Respostas rápidas configuradas para as dúvidas frequentes e alguém responsável pelo chat todo dia.' },
        ],
      },
    ],
    approach: {
      title: 'Como eu faço isso rodar',
      steps: [
        { title: 'Revisão dos anúncios', text: 'Ajusto título, capa, vídeo e atributos para o jeito que a busca da Shopee funciona.' },
        { title: 'Preço próprio da Shopee', text: 'Precificação com comissão, taxas e programas, produto a produto.' },
        { title: 'Integração pelo ERP', text: 'Pedidos e estoque da Shopee no Bling, junto com os outros canais.' },
        { title: 'Plano de campanhas', text: 'Calendário com as datas, os produtos e o desconto máximo de cada um.' },
      ],
    },
    tools: [
      { name: 'Bling', why: 'pedidos e estoque da Shopee junto com os outros canais' },
      { name: 'Shopee Open Platform', why: 'automação de anúncios, preço e estoque pela API' },
      { name: 'Replique', why: 'trazer anúncios de outros canais já adaptados para a Shopee' },
      { name: 'Planilha de precificação', why: 'preço por canal com as taxas de cada um' },
    ],
    draft: true,
  },
  {
    slug: 'bling',
    name: 'Bling',
    logo: bling,
    tag: 'ERP no centro da operação',
    summary:
      'Quem vende em mais de um canal sem ERP vive conferindo planilha. Com o Bling no centro, produto, estoque, pedido e nota fiscal ficam num lugar só, e cada canal só recebe o que precisa.',
    topics: ['Implantação', 'Estoque multicanal', 'Cadastro e tributação', 'Pedidos e NF-e', 'Integração com planilhas'],
    hero: {
      kicker: 'guia · bling',
      title: 'Um ERP no centro, todos os canais em volta',
      lead: 'Implantei o Bling numa indústria que vendia só no Mercado Livre e a levei para cinco canais ao mesmo tempo. Hoje lidero a parceria oficial da Monvatti com o Bling. O que eu aprendi: o sistema é a parte fácil, o difícil é o processo.',
    },
    problem: {
      title: 'O problema sem um ERP',
      paragraphs: [
        'Sem um sistema central, cada canal tem o seu cadastro, o seu estoque e a sua lista de pedidos. Alguém precisa juntar tudo na mão, e é nesse "na mão" que nascem os erros.',
        'O outro problema é a implantação mal feita: o ERP é contratado, mas a equipe continua no jeito antigo porque ninguém desenhou o processo junto com ela.',
      ],
      symptoms: [
        'Estoque conferido em planilha e atualizado canal por canal',
        'Venda de produto que já tinha acabado em outro canal',
        'Nota fiscal emitida fora do fluxo do pedido',
        'Cadastro de produto repetido em cada marketplace',
        'Sistema contratado que a equipe não usa',
      ],
    },
    sections: [
      {
        id: 'implantacao',
        label: 'Implantação',
        title: 'Implantação que a equipe usa',
        lead: 'O meu método é desenhar o processo em volta de como a equipe já trabalha, e não o contrário.',
        points: [
          { title: 'Mapear o processo atual', text: 'Entender como pedido, estoque e expedição funcionam hoje, quem faz o quê e onde estão as planilhas.' },
          { title: 'Cadastro limpo antes de integrar', text: 'Produtos com SKU único, kits e variações organizados. Integração com cadastro bagunçado só espalha a bagunça.' },
          { title: 'Um canal por vez', text: 'Integrar, validar e só então seguir para o próximo canal. Menos risco e a equipe aprende no caminho.' },
          { title: 'Treinar no dia a dia', text: 'Acompanhar a equipe na rotina real nas primeiras semanas, ajustando o que travar.' },
        ],
      },
      {
        id: 'estoque',
        label: 'Estoque multicanal',
        title: 'Estoque multicanal',
        lead: 'Um estoque só, refletido em todos os canais. É o que acaba com o cancelamento por falta de produto.',
        points: [
          { title: 'Depósitos separados', text: 'Estoque próprio, estoque do Full e de outros fulfillments em depósitos diferentes, cada um ligado ao canal certo.' },
          { title: 'Kits e composição', text: 'Kit baixando o estoque das peças que o compõem, sem conta manual.' },
          { title: 'Planilha integrada quando precisa', text: 'Quando a produção ou o estoque vivem numa planilha, integro o Google Sheets ao Bling para atualizar automaticamente, como fiz na indústria de calçados.' },
        ],
        compare: {
          wrong: ['Estoque atualizado canal por canal', 'Planilha paralela "oficial"', 'Kit controlado de cabeça'],
          right: ['Estoque central sincronizado', 'Planilha integrada ao ERP', 'Composição de kit automática'],
        },
      },
      {
        id: 'cadastro',
        label: 'Cadastro e tributação',
        title: 'Cadastro e tributação',
        lead: 'Cadastro bem feito uma vez serve para todos os canais e para a nota fiscal.',
        points: [
          { title: 'Produto cadastrado uma vez', text: 'Dados, fotos e atributos no Bling, enviados para cada marketplace com os ajustes que ele pede.' },
          { title: 'Dados fiscais corretos', text: 'NCM, origem e regras de tributação configurados, para a nota sair certa sem retrabalho.' },
          { title: 'Preço por canal', text: 'Listas de preço diferentes para cada marketplace a partir do mesmo cadastro.' },
        ],
      },
      {
        id: 'pedidos',
        label: 'Pedidos e NF-e',
        title: 'Pedidos e nota fiscal',
        lead: 'Todos os pedidos num lugar só, com nota e etiqueta saindo do mesmo fluxo.',
        points: [
          { title: 'Pedido importado automaticamente', text: 'Os pedidos de todos os canais caem no Bling sem digitação.' },
          { title: 'Nota fiscal em lote', text: 'Emissão em lote e envio da nota para o marketplace no mesmo fluxo.' },
          { title: 'Expedição organizada', text: 'Separação e etiquetas a partir do ERP, com a mesma rotina para todos os canais.' },
        ],
      },
    ],
    approach: {
      title: 'Como eu faço isso rodar',
      steps: [
        { title: 'Mapeamento', text: 'Entendo a operação atual e desenho o processo novo junto com a equipe.' },
        { title: 'Cadastro e fiscal', text: 'Organizo os produtos, SKUs, kits e a tributação antes de integrar.' },
        { title: 'Integração dos canais', text: 'Conecto um canal por vez e valido pedido, estoque e nota em cada um.' },
        { title: 'Automação em volta', text: 'Integro planilhas e o que mais a operação usar para ninguém digitar a mesma coisa duas vezes.' },
      ],
    },
    tools: [
      { name: 'Bling ERP', why: 'o centro: produto, estoque, pedido e nota fiscal' },
      { name: 'Google Sheets', why: 'integrado ao Bling quando a operação vive em planilha' },
      { name: 'API do Bling', why: 'automações que a interface não faz sozinha' },
    ],
    draft: true,
  },
  {
    slug: 'replique',
    name: 'Replique',
    logo: replique,
    tag: 'a ferramenta que eu construí',
    summary:
      'Tudo o que está nestes guias dá trabalho para fazer na mão, anúncio por anúncio, canal por canal. O Replique é a ferramenta que eu estou construindo para que uma agência faça isso em escala, com IA e pelas APIs oficiais.',
    topics: ['O problema das agências', 'Replicar anúncios', 'IA no padrão', 'Gestão multi-cliente'],
    hero: {
      kicker: 'guia · replique',
      title: 'Replique: o processo certo, em escala',
      lead: 'Depois de fazer tudo isso na mão para vários clientes, comecei a construir a ferramenta que eu queria ter. O Replique está em desenvolvimento e já roda as partes mais repetitivas do trabalho.',
    },
    problem: {
      title: 'O problema que ele resolve',
      paragraphs: [
        'Uma agência de e-commerce cuida de vários clientes, cada um com vários canais. Levar um produto para um novo marketplace significa refazer o anúncio inteiro: categoria, atributos, título, descrição, fotos e preço.',
        'Multiplicado por centenas de produtos e vários clientes, é aí que vai a maior parte do tempo da equipe, e é aí que o padrão se perde.',
      ],
      symptoms: [
        'Horas copiando anúncio de um canal para o outro',
        'Cada cliente num login diferente, em abas diferentes',
        'Padrão de título e descrição que depende de quem fez',
        'Pouca visão de margem e saúde de cada conta',
      ],
    },
    sections: [
      {
        id: 'replicar',
        label: 'Replicar anúncios',
        title: 'Encontrar e replicar anúncios',
        lead: 'O Replique encontra os anúncios que mais vendem e leva os seus produtos para até três marketplaces de uma vez.',
        points: [
          { title: 'Referência do que vende', text: 'Busca os anúncios mais vendidos no Mercado Livre, na Shopee e na Amazon como ponto de partida.' },
          { title: 'Copiar, editar e publicar', text: 'O anúncio é adaptado às regras de cada canal e publicado pela API oficial, sem preencher tudo de novo.' },
          { title: 'Publicação em lote', text: 'Vários produtos de uma vez, com o log do que foi publicado e do que deu erro.' },
        ],
      },
      {
        id: 'ia',
        label: 'IA no padrão',
        title: 'IA seguindo o padrão',
        lead: 'A IA não inventa um estilo novo para cada anúncio: ela aplica o padrão da loja.',
        points: [
          { title: 'Melhorar com IA', text: 'Reescreve títulos e descrições com Claude, seguindo as regras de cada marketplace.' },
          { title: 'Operação por conversa', text: 'Um servidor MCP permite operar a plataforma conversando com a IA, do jeito que você conversaria com um assistente.' },
        ],
      },
      {
        id: 'gestao',
        label: 'Gestão',
        title: 'Gestão de várias contas',
        lead: 'Feito para agência: vários clientes, várias pessoas, cada um vendo só o que deve.',
        points: [
          { title: 'Multi-cliente e multi-agência', text: 'Dados isolados por cliente, equipe com permissões e log de auditoria.' },
          { title: 'Visão da operação', text: 'Módulos de financeiro e margem, saúde da conta, central de perguntas, estoque Full e tributação.' },
          { title: 'Segurança', text: 'Credenciais criptografadas e testes automatizados.' },
        ],
      },
    ],
    approach: {
      title: 'Onde ele está hoje',
      steps: [
        { title: 'Integrações', text: 'Mercado Livre, Shopee e Amazon conectados pelas APIs oficiais.' },
        { title: 'Em desenvolvimento', text: 'Novos módulos entrando conforme as dores que eu encontro na operação dos clientes.' },
        { title: 'Próximo passo', text: 'Abrir para mais agências testarem no dia a dia.' },
      ],
    },
    tools: [
      { name: 'Python + FastAPI', why: 'a base da plataforma' },
      { name: 'APIs oficiais', why: 'Mercado Livre, Shopee Open Platform e Amazon SP-API' },
      { name: 'Claude + MCP', why: 'IA para conteúdo e operação por conversa' },
    ],
    draft: true,
  },
]

export const findGuide = (slug: string) => guides.find((g) => g.slug === slug)
