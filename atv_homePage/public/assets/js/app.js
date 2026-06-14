// ══════════════════════════════════════
// CONFIGURAÇÃO DA API
// ══════════════════════════════════════
const API_URL = 'https://musical-robot-g9g974r9pprc7pj-3000.app.github.dev';

// ══════════════════════════════════════
// HOME PAGE — CAROUSEL E GRID
// ══════════════════════════════════════
async function montarHome() {
  const carousel = document.getElementById('carousel-inner');
  const grid = document.getElementById('pessoa-grid');
  if (!carousel && !grid) return;

  try {
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
        indicators.innerHTML += `
          <button type="button" data-bs-target="#carouselDestaques"
            data-bs-slide-to="${index}"
            class="${index === 0 ? 'active' : ''}"
            aria-label="Slide ${index + 1}">
          </button>
        `;
        inner.innerHTML += `
          <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <div class="carousel-slide" style="cursor:pointer">
              <img src="${pessoa.imagem}" alt="${pessoa.nome}" class="carousel-img"/>
              <div class="carousel-caption-custom">
                <span class="carousel-area">${pessoa.area}</span>
                <h2>${pessoa.nome}</h2>
                <p>${pessoa.bio}</p>
                <a href="detalhes.html?id=${pessoa.id}" class="btn-carousel">Ver perfil completo →</a>
              </div>
            </div>
          </div>
        `;
      });
    }

    // ── Grid: todas as pessoas ──
    if (grid) {
      renderizarGrid(pessoas);
    }

  } catch (error) {
    console.error('Erro ao carregar dados da home:', error);
    const grid = document.getElementById('pessoa-grid');
    if (grid) grid.innerHTML = '<p class="erro">Erro ao carregar pessoas. Verifique se o JSON Server está rodando.</p>';
  }
}

// ── Renderiza os cards do grid (CORRIGIDO: Aspas simples ao redor de pessoa.id) ──
function renderizarGrid(pessoas) {
  const grid = document.getElementById('pessoa-grid');
  if (!grid) return;
  grid.innerHTML = '';

  pessoas.forEach(pessoa => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <article class="card pessoa-card h-100" style="cursor:pointer">
        <div class="pessoa-card-img" onclick="window.location.href='detalhes.html?id=${pessoa.id}'">
          <img src="${pessoa.imagem}" class="card-img-top" alt="${pessoa.nome}"/>
          <span class="area-badge">${pessoa.area}</span>
        </div>
        <div class="card-body pessoa-card-body">
          <h3 class="card-title">${pessoa.nome}</h3>
          <p class="pessoa-card-meta">${pessoa.profissao} · ${pessoa.periodo}</p>
          <div class="pessoa-card-tags mb-2">
            <span class="tag">${pessoa.area}</span>
            <span class="tag">${pessoa.origem}</span>
          </div>
          <div class="d-flex gap-2 mt-auto">
            <button class="btn-crud btn-editar" onclick="abrirModalEditar('${pessoa.id}')">✏️ Editar</button>
            <button class="btn-crud btn-excluir" onclick="excluirPessoa('${pessoa.id}', '${pessoa.nome}')">🗑️ Excluir</button>
          </div>
        </div>
      </article>
    `;
    grid.appendChild(col);
  });
}
// ══════════════════════════════════════
// CRUD — CREATE (POST)
// ══════════════════════════════════════
async function criarPessoa(dados) {
  const res = await fetch(`${API_URL}/pessoas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  if (!res.ok) throw new Error('Erro ao criar pessoa');
  return await res.json();
}

// ══════════════════════════════════════
// CRUD — READ (GET por id)
// ══════════════════════════════════════
async function buscarPessoa(id) {
  const res = await fetch(`${API_URL}/pessoas/${id}`);
  if (!res.ok) throw new Error('Pessoa não encontrada');
  return await res.json();
}

// ══════════════════════════════════════
// CRUD — UPDATE (PUT)
// ══════════════════════════════════════
async function atualizarPessoa(id, dados) {
  const res = await fetch(`${API_URL}/pessoas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  if (!res.ok) throw new Error('Erro ao atualizar pessoa');
  return await res.json();
}

// ══════════════════════════════════════
// CRUD — DELETE
// ══════════════════════════════════════
async function excluirPessoa(id, nome) {
  if (!confirm(`Deseja excluir "${nome}"?`)) return;
  try {
    const res = await fetch(`${API_URL}/pessoas/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao excluir');
    alert(`"${nome}" excluída com sucesso!`);
    const resPessoas = await fetch(`${API_URL}/pessoas`);
    const pessoas = await resPessoas.json();
    renderizarGrid(pessoas);
  } catch (error) {
    console.error('Erro no DELETE:', error);
    alert('Erro ao excluir. Tente novamente.');
  }
}

// ══════════════════════════════════════
// MODAL — ABRIR PARA CRIAR
// ══════════════════════════════════════
function abrirModalCriar() {
  document.getElementById('modal-titulo').textContent = 'Nova Pessoa';
  document.getElementById('form-pessoa').reset();
  document.getElementById('pessoa-id').value = '';
  new bootstrap.Modal(document.getElementById('modalPessoa')).show();
}

// ══════════════════════════════════════
// MODAL — ABRIR PARA EDITAR
// ══════════════════════════════════════
async function abrirModalEditar(id) {
  try {
    const pessoa = await buscarPessoa(id);
    document.getElementById('modal-titulo').textContent = 'Editar Pessoa';
    document.getElementById('pessoa-id').value = pessoa.id;
    document.getElementById('campo-nome').value = pessoa.nome;
    document.getElementById('campo-profissao').value = pessoa.profissao;
    document.getElementById('campo-periodo').value = pessoa.periodo;
    document.getElementById('campo-area').value = pessoa.area;
    document.getElementById('campo-origem').value = pessoa.origem;
    document.getElementById('campo-seculo').value = pessoa.seculo;
    document.getElementById('campo-imagem').value = pessoa.imagem;
    document.getElementById('campo-bio').value = pessoa.bio;
    document.getElementById('campo-nacionalidade').value = pessoa.nacionalidade;
    document.getElementById('campo-nascimento').value = pessoa.nascimento;
    document.getElementById('campo-falecimento').value = pessoa.falecimento || '';
    document.getElementById('campo-destaque').checked = pessoa.destaque;
    new bootstrap.Modal(document.getElementById('modalPessoa')).show();
  } catch (error) {
    alert('Erro ao carregar dados para edição.');
  }
}

// ══════════════════════════════════════
// SUBMIT DO FORMULÁRIO (CORRIGIDO: Tratamento dinâmico de ID)
// ══════════════════════════════════════
async function salvarPessoa(e) {
  e.preventDefault();

  const id = document.getElementById('pessoa-id').value;
  const dados = {
    nome:          document.getElementById('campo-nome').value.trim(),
    profissao:     document.getElementById('campo-profissao').value.trim(),
    periodo:       document.getElementById('campo-periodo').value.trim(),
    area:          document.getElementById('campo-area').value.trim(),
    origem:        document.getElementById('campo-origem').value.trim(),
    seculo:        document.getElementById('campo-seculo').value.trim(),
    imagem:        document.getElementById('campo-imagem').value.trim(),
    bio:           document.getElementById('campo-bio').value.trim(),
    nacionalidade: document.getElementById('campo-nacionalidade').value.trim(),
    nascimento:    document.getElementById('campo-nascimento').value.trim(),
    falecimento:   document.getElementById('campo-falecimento').value.trim(),
    destaque:      document.getElementById('campo-destaque').checked
  };

  try {
    if (id) {
      // CORREÇÃO: Não force o ID a ser Int com parseInt se o JSON server estiver gerando strings.
      // Deixamos o ID original (seja ele número ou texto)
      await atualizarPessoa(id, { id: id, ...dados });
      alert('Pessoa atualizada com sucesso!');
    } else {
      await criarPessoa(dados);
      alert('Pessoa cadastrada com sucesso!');
    }

    // Fecha o modal do Bootstrap
    const modalElement = document.getElementById('modalPessoa');
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.hide();
    
    // Recarrega a listagem atualizada
    const resPessoas = await fetch(`${API_URL}/pessoas`);
    const pessoas = await resPessoas.json();
    renderizarGrid(pessoas);

  } catch (error) {
    console.error(error);
    alert('Erro ao salvar. Tente novamente.');
  }
}
// ══════════════════════════════════════
// PÁGINA DE DETALHES
// ══════════════════════════════════════
async function montarDetalhes() {
  const container = document.getElementById('detalhe-container');
  const galeria = document.getElementById('galeria-producoes');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = '<p class="erro">ID não informado na URL.</p>';
    return;
  }

  try {
    const resPessoa = await fetch(`${API_URL}/pessoas/${id}`);
    if (!resPessoa.ok) throw new Error('Pessoa não encontrada');
    const pessoa = await resPessoa.json();

    const resProducoes = await fetch(`${API_URL}/producoes?pessoaId=${id}`);
    const producoes = await resProducoes.json();

    document.title = `${pessoa.nome} — Pessoas & Produções`;

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

  const form = document.getElementById('form-pessoa');
  if (form) form.addEventListener('submit', salvarPessoa);
};