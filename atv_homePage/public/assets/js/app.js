// ══════════════════════════════════════
// CONFIGURAÇÃO DA API
// ══════════════════════════════════════
const API_URL = 'https://musical-robot-g9g974r9pprc7pj-3000.app.github.dev';

// ══════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════
async function montarHome() {
  const carousel = document.getElementById('carousel-destaques');
  const grid = document.getElementById('pessoa-grid');
  if (!carousel && !grid) return;

  try {
    // busca todas as pessoas
    const resPessoas = await fetch(`${API_URL}/pessoas`);
    const pessoas = await resPessoas.json();

    // ── Carousel: apenas os destaques ──
    if (carousel) {
      const destaques = pessoas.filter(p => p.destaque === true);
      const indicators = document.getElementById('carousel-indicators');
      const inner = document.getElementById('carousel-inner');

      indicators.innerHTML = '';
      inner.innerHTML = '';

      destaques.forEach((pessoa, index) => {
        // indicadores (bolinhas)
        indicators.innerHTML += `
          <button
            type="button"
            data-bs-target="#carouselDestaques"
            data-bs-slide-to="${index}"
            class="${index === 0 ? 'active' : ''}"
            aria-label="Slide ${index + 1}">
          </button>
        `;

        // slides
        inner.innerHTML += `
          <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <div class="carousel-slide" onclick="window.location.href='detalhe.html?id=${pessoa.id}'" style="cursor:pointer">
              <img src="${pessoa.imagem}" alt="${pessoa.nome}" class="carousel-img"/>
              <div class="carousel-caption-custom">
                <span class="carousel-area">${pessoa.area}</span>
                <h2>${pessoa.nome}</h2>
                <p>${pessoa.bio}</p>
                <a href="https://musical-robot-g9g974r9pprc7pj-5501.app.github.dev/atv_homePage/public/detalhes.html?id=${pessoa.id}" class="btn-carousel">Ver perfil completo →</a>
              </div>
            </div>
          </div>
        `;
      });
    }

    // ── Grid: todas as pessoas ──
    if (grid) {
      grid.innerHTML = '';

      pessoas.forEach(pessoa => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
          <article class="card pessoa-card h-100" onclick="window.location.href='https://musical-robot-g9g974r9pprc7pj-5501.app.github.dev/atv_homePage/public/detalhes.html?id=${pessoa.id}'" style="cursor:pointer">
            <div class="pessoa-card-img">
              <img src="${pessoa.imagem}" class="card-img-top" alt="${pessoa.nome}"/>
              <span class="area-badge">${pessoa.area}</span>
            </div>
            <div class="card-body pessoa-card-body">
              <h3 class="card-title">${pessoa.nome}</h3>
              <p class="pessoa-card-meta">${pessoa.profissao} · ${pessoa.periodo}</p>
              <div class="pessoa-card-tags">
                <span class="tag">${pessoa.area}</span>
                <span class="tag">${pessoa.origem}</span>
              </div>
            </div>
          </article>
        `;
        grid.appendChild(col);
      });
    }

  } catch (error) {
    console.error('Erro ao carregar dados da home:', error);
    if (grid) grid.innerHTML = '<p class="erro">Erro ao carregar pessoas. Verifique se o JSON Server está rodando.</p>';
  }
}

// ══════════════════════════════════════
// PÁGINA DE DETALHES
// ══════════════════════════════════════
async function montarDetalhes() {
  const container = document.getElementById('detalhe-container');
  const galeria = document.getElementById('galeria-producoes');
  if (!container) return;

  // pega o id da query string
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = '<p class="erro">ID não informado na URL.</p>';
    return;
  }

  try {
    // busca a pessoa pelo id
    const resPessoa = await fetch(`${API_URL}/pessoas/${id}`);
    if (!resPessoa.ok) throw new Error('Pessoa não encontrada');
    const pessoa = await resPessoa.json();

    // busca as produções vinculadas
    const resProducoes = await fetch(`${API_URL}/producoes?pessoaId=${id}`);
    const producoes = await resProducoes.json();

    // atualiza título da aba
    document.title = `${pessoa.nome} — Pessoas & Produções`;

    // ── Informações gerais ──
    container.innerHTML = `
      <section class="detalhe-hero">
        <div class="detalhe-img">
          <img src="${pessoa.imagem}" alt="${pessoa.nome}"/>
        </div>
        <div class="detalhe-info">
          <span class="area-tag">${pessoa.area}</span>
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
          <h2>Total de Produções</h2>
          <div class="detalhe-stat">
            <span class="stat-numero">${producoes.length}</span>
            <span class="stat-label">obras cadastradas</span>
          </div>
        </div>
      </section>
    `;

    // ── Galeria de produções (entidade secundária) ──
    if (galeria) {
      galeria.innerHTML = '';

      if (producoes.length === 0) {
        galeria.innerHTML = '<p class="erro">Nenhuma produção encontrada.</p>';
        return;
      }

      producoes.forEach(prod => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
          <div class="card producao-card h-100">
            <img src="${prod.imagem}" class="card-img-top producao-img" alt="${prod.titulo}"/>
            <div class="card-body">
              <h5 class="card-title producao-titulo">${prod.titulo}</h5>
              <span class="producao-tipo">${prod.tipo} · ${prod.ano}</span>
              <p class="card-text producao-desc">${prod.descricao}</p>
            </div>
          </div>
        `;
        galeria.appendChild(col);
      });
    }

  } catch (error) {
    console.error('Erro ao carregar detalhes:', error);
    container.innerHTML = '<p class="erro">Erro ao carregar dados. Verifique se o JSON Server está rodando.</p>';
  }
}

// ══════════════════════════════════════
// INICIALIZAÇÃO
// ══════════════════════════════════════
window.onload = () => {
  montarHome();
  montarDetalhes();
};