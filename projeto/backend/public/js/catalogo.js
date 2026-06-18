Auth.verificarAcesso(); // Bloqueia o acesso se nao houver login realizado

document.addEventListener("DOMContentLoaded", () => {
    const API_CONTEUDOS = "/api/conteudos";
    const API_FAVORITOS = "/api/favoritos";
    const API_HISTORICO = "/api/historico";

    const PERFIL_ID = localStorage.getItem("perfilId");

    const modal = document.getElementById("movie-modal");
    const btnFechar = document.querySelector(".close-modal");
    const btnFavorito = document.getElementById("btn-favorito");
    const btnLogout = document.getElementById("btn-logout");

    let filmeSelecionado = null;
    let favoritos = [];

    if (btnLogout) btnLogout.onclick = () => Auth.logout();

    async function buscarConteudos() {
        const resposta = await fetch(API_CONTEUDOS);
        return await resposta.json();
    }

    async function buscarFavoritos() {
        const resposta = await fetch(`${API_FAVORITOS}/${PERFIL_ID}`);
        return await resposta.json();
    }

    async function buscarHistorico() {
        const resposta = await fetch(`${API_HISTORICO}/${PERFIL_ID}`);
        return await resposta.json();
    }

    // Carrega e desenha todas as seccoes e dados no ecrã do catalogo
    async function renderizarTudo() {
        const perfilAtivo = localStorage.getItem("perfilAtivo");
        const fotoAtiva = localStorage.getItem("fotoAtiva");

        const txtNome = document.getElementById("nome-perfil");
        const imgPerfil = document.getElementById("foto-perfil");

        if (txtNome) txtNome.textContent = perfilAtivo;
        if (imgPerfil && fotoAtiva) imgPerfil.src = fotoAtiva;

        const conteudos = await buscarConteudos();
        favoritos = await buscarFavoritos();
        const historico = await buscarHistorico();

        // Renderiza as tres linhas base superiores
        renderizarLinha(conteudos, "lista-populares", false);
        renderizarLinha(historico, "lista-historico", false);
        renderizarLinha(favoritos, "lista-favoritos", true);

        // GERAÇÃO DINÂMICA DAS LINHAS DE GÉNERO
        const containerCategorias = document.getElementById("categorias-dinamicas");
        containerCategorias.textContent = ""; 

        // Cria uma lista com os generos sem repeticoes
        const generosExistentes = [...new Set(conteudos.map(filme => filme.genero))];

        // Cria uma seccao HTML automatica para cada genero encontrado
        generosExistentes.forEach(genero => {
            if (!genero) return; 

            const filmesDoGenero = conteudos.filter(filme => filme.genero === genero);

            const seccao = document.createElement("section");
            seccao.className = "row";

            const tituloSeccao = document.createElement("h2");
            tituloSeccao.textContent = genero.charAt(0).toUpperCase() + genero.slice(1);

            const rowFilmes = document.createElement("div");
            rowFilmes.className = "movie-row";
            const containerId = `genero-${genero.replace(/\s+/g, '-')}`; 
            rowFilmes.id = containerId;

            seccao.appendChild(tituloSeccao);
            seccao.appendChild(rowFilmes);
            containerCategorias.appendChild(seccao);

            renderizarLinha(filmesDoGenero, containerId, false);
        });
    }

    // Desenha os cartoes de filmes no respetivo sitio
    function renderizarLinha(filmes, containerId, isFavoritos) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.textContent = "";

        if (filmes.length === 0 && isFavoritos) {
            const p = document.createElement("p");
            p.textContent = "Ainda não tens favoritos neste perfil.";
            p.style.color = "gray";
            p.style.padding = "20px";
            container.appendChild(p);
            return;
        }

        if (filmes.length === 0) return;

        filmes.forEach((filme) => {
            const card = document.createElement("div");
            card.className = "movie-card";
            card.style.backgroundImage = `url('${filme.imagemUrl}')`;

            const overlay = document.createElement("div");
            overlay.className = "movie-info-overlay";

            const span = document.createElement("span");
            span.textContent = filme.titulo;

            overlay.appendChild(span);
            card.appendChild(overlay);

            // Abre a modal com detalhes e manda para o historico ao clicar
            card.onclick = async () => {
                filmeSelecionado = filme;

                document.getElementById("modal-img").src = filme.imagemUrl;
                document.getElementById("modal-titulo").textContent = filme.titulo;
                document.getElementById("modal-descricao").textContent =
                    filme.descricao || "Sem descrição.";

                const jaFavorito = favoritos.some((f) => f.id === filme.id);

                btnFavorito.textContent = jaFavorito
                    ? "Remover dos Meus Favoritos"
                    : "Adicionar aos Meus Favoritos";

                modal.classList.remove("hidden");

                await fetch(API_HISTORICO, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        perfil_id: PERFIL_ID,
                        conteudo_id: filme.id
                    })
                });
            };

            container.appendChild(card);
        });
    }

    // Gere a adicao ou remocao de favoritos dentro da Modal
    btnFavorito.onclick = async () => {
        if (!filmeSelecionado) return;

        const jaFavorito = favoritos.some((f) => f.id === filmeSelecionado.id);

        if (jaFavorito) {
            await fetch(API_FAVORITOS, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    perfil_id: PERFIL_ID,
                    conteudo_id: filmeSelecionado.id
                })
            });
        } else {
            await fetch(API_FAVORITOS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    perfil_id: PERFIL_ID,
                    conteudo_id: filmeSelecionado.id
                })
            });
        }

        modal.classList.add("hidden");
        renderizarTudo();
    };

    btnFechar.onclick = () => modal.classList.add("hidden");

    renderizarTudo();
});