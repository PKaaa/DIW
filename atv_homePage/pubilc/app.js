const pessoas = [
  {
    id: 1,
    nome: "Clarice Lispector",
    profissao: "Escritora",
    periodo: "1920–1977",
    area: "Literatura",
    origem: "Brasil",
    seculo: "Séc. XX",
    imagem: "https://picsum.photos/id/1027/200/270",
    bio: "Uma das mais importantes escritoras brasileiras, conhecida por sua prosa introspectiva e estilo inovador. Suas obras exploram a consciência humana com profundidade psicológica singular.",
    obras: ["A Hora da Estrela", "A Paixão Segundo G.H.", "Laços de Família"],
    nacionalidade: "Brasileira (naturalizada)",
    nascimento: "10 de dezembro de 1920",
    falecimento: "9 de dezembro de 1977"
  },
  {
    id: 2,
    nome: "Guimarães Rosa",
    profissao: "Escritor",
    periodo: "1908–1967",
    area: "Literatura",
    origem: "Brasil",
    seculo: "Séc. XX",
    imagem: "https://picsum.photos/id/1012/200/270",
    bio: "Mestre da literatura regionalista brasileira, revolucionou a língua portuguesa com sua escrita inventiva e poética. Grande Sertão: Veredas é considerado um dos maiores romances da literatura mundial.",
    obras: ["Grande Sertão: Veredas", "Sagarana", "Primeiras Estórias"],
    nacionalidade: "Brasileiro",
    nascimento: "27 de junho de 1908",
    falecimento: "19 de novembro de 1967"
  },
  {
    id: 3,
    nome: "Villa-Lobos",
    profissao: "Compositor",
    periodo: "1887–1959",
    area: "Música",
    origem: "Brasil",
    seculo: "Séc. XX",
    imagem: "https://picsum.photos/id/1025/200/270",
    bio: "O mais importante compositor brasileiro, Villa-Lobos foi um gênio criativo que fusionou a música erudita europeia com elementos do folclore e da música popular brasileira.",
    obras: ["Bachianas Brasileiras", "Choros", "Floresta do Amazonas"],
    nacionalidade: "Brasileiro",
    nascimento: "5 de março de 1887",
    falecimento: "17 de novembro de 1959"
  },
  {
    id: 4,
    nome: "Drummond de Andrade",
    profissao: "Poeta",
    periodo: "1902–1987",
    area: "Literatura",
    origem: "Brasil",
    seculo: "Séc. XX",
    imagem: "https://picsum.photos/id/1074/200/270",
    bio: "Considerado o maior poeta brasileiro do século XX, Carlos Drummond de Andrade é reconhecido pela ironia, lirismo e profundidade filosófica de sua obra poética.",
    obras: ["Alguma Poesia", "A Rosa do Povo", "Sentimento do Mundo"],
    nacionalidade: "Brasileiro",
    nascimento: "31 de outubro de 1902",
    falecimento: "17 de agosto de 1987"
  },
  {
    id: 5,
    nome: "Tarsila do Amaral",
    profissao: "Pintora",
    periodo: "1886–1973",
    area: "Arte Visual",
    origem: "Brasil",
    seculo: "Séc. XX",
    imagem: "https://picsum.photos/id/1011/200/270",
    bio: "Principal representante do Modernismo brasileiro nas artes plásticas, Tarsila criou obras icônicas que sintetizam a identidade cultural brasileira com influências do cubismo europeu.",
    obras: ["Abaporu", "Operários", "A Negra"],
    nacionalidade: "Brasileira",
    nascimento: "1 de setembro de 1886",
    falecimento: "17 de janeiro de 1973"
  },
  {
    id: 6,
    nome: "Machado de Assis",
    profissao: "Escritor",
    periodo: "1839–1908",
    area: "Literatura",
    origem: "Brasil",
    seculo: "Séc. XIX",
    imagem: "https://picsum.photos/id/1005/200/270",
    bio: "Considerado o maior nome da literatura brasileira, fundador da Academia Brasileira de Letras e mestre do Realismo. Sua obra marcou profundamente a cultura nacional com romances, contos e crônicas de rara perspicácia psicológica.",
    obras: ["Dom Casmurro", "Memórias Póstumas de Brás Cubas", "Quincas Borba"],
    nacionalidade: "Brasileiro",
    nascimento: "21 de junho de 1839",
    falecimento: "29 de setembro de 1908"
  }
];

function montarHome() {
  const grid = document.getElementById('pessoa-grid');
  if (!grid) return;

  grid.innerHTML = '';

  pessoas.forEach(pessoa => {
    const card = document.createElement('article');
    card.className = 'pessoa-card';
    card.innerHTML = `
      <div class="pessoa-card-img">
        <img src="${pessoa.imagem}" alt="${pessoa.nome}"/>
        <span class="area-badge">${pessoa.area}</span>
      </div>
      <div class="pessoa-card-body">
        <h3>${pessoa.nome}</h3>
        <p class="pessoa-card-meta">${pessoa.profissao} · ${pessoa.periodo}</p>
        <div class="pessoa-card-tags">
          <span class="tag">${pessoa.area}</span>
          <span class="tag">${pessoa.origem}</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `detalhes.html?id=${pessoa.id}`;
    });

    grid.appendChild(card);
  });
}

function montarDetalhes() {
  const container = document.getElementById('detalhe-container');
  if (!container) return;

  // pega o id da query string da URL
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));

  const pessoa = pessoas.find(p => p.id === id);

  if (!pessoa) {
    container.innerHTML = '<p style="color:#999;padding:40px;">Pessoa não encontrada.</p>';
    return;
  }

  // atualiza o título da aba
  document.title = `${pessoa.nome} — Pessoas & Produções`;

  container.innerHTML = `
    <section class="detalhe-hero">
      <div class="detalhe-img">
        <img src="${pessoa.imagem}" alt="${pessoa.nome}"/>
      </div>
      <div class="detalhe-info">
        <span class="hero-badge">${pessoa.area}</span>
        <h1>${pessoa.nome}</h1>
        <p class="detalhe-profissao">${pessoa.profissao} · ${pessoa.periodo}</p>
        <p class="detalhe-bio">${pessoa.bio}</p>
        <div class="detalhe-tags">
          <span class="tag">${pessoa.area}</span>
          <span class="tag">${pessoa.origem}</span>
          <span class="tag">${pessoa.seculo}</span>
        </div>
      </div>
    </section>

    <section class="detalhe-extra">
      <div class="detalhe-bloco">
        <h2>Informações</h2>
        <ul class="detalhe-lista">
          <li><span>Nascimento</span><strong>${pessoa.nascimento}</strong></li>
          ${pessoa.falecimento ? `<li><span>Falecimento</span><strong>${pessoa.falecimento}</strong></li>` : ''}
          <li><span>Nacionalidade</span><strong>${pessoa.nacionalidade}</strong></li>
          <li><span>Área</span><strong>${pessoa.area}</strong></li>
          <li><span>Período</span><strong>${pessoa.seculo}</strong></li>
        </ul>
      </div>

      <div class="detalhe-bloco">
        <h2>Principais Obras</h2>
        <ul class="obras-lista">
          ${pessoa.obras.map(obra => `<li>${obra}</li>`).join('')}
        </ul>
      </div>
    </section>

    <div class="detalhe-voltar">
      <a href="index.html" class="btn-voltar">← Voltar para a home</a>
    </div>
  `;
}

window.onload = () => {
  montarHome();
  montarDetalhes();
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.filter-group');
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
};