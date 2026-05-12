Auth.verificarAcesso();

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('movie-modal');
    const btnFechar = document.querySelector('.close-modal');
    const btnFavorito = document.getElementById('btn-favorito');
    const btnLogout = document.getElementById('btn-logout');
    
    // Pegamos no perfil ativo para criar a chave única
    const perfilAtivo = localStorage.getItem('perfilAtivo');
    const CHAVE_FAVORITOS = `${perfilAtivo}_favoritos`; // Ex: "João_favoritos"

    let filmeSelecionadoId = null;

    if (btnLogout) btnLogout.onclick = () => Auth.logout();

    function renderizarTudo() {
        const perfilAtivo = localStorage.getItem('perfilAtivo');
        const fotoAtiva = localStorage.getItem('fotoAtiva');

        const txtNome = document.getElementById('nome-perfil');
        const imgPerfil = document.getElementById('foto-perfil');

        if (txtNome) txtNome.textContent = perfilAtivo;
        if (imgPerfil && fotoAtiva) {
        imgPerfil.src = fotoAtiva;
        }
    
    renderizarLinha('conteudos', 'lista-populares');
    renderizarLinha(`${perfilAtivo}_favoritos`, 'lista-favoritos');
    }

    function renderizarLinha(chave, containerId) {
        const container = document.getElementById(containerId);
        container.textContent = "";
        const filmes = JSON.parse(localStorage.getItem(chave)) || [];

        if (filmes.length === 0 && chave === CHAVE_FAVORITOS) {
            container.innerHTML = "<p style='color: gray; padding: 20px;'>Ainda não tens favoritos neste perfil.</p>";
            return;
        }

        filmes.forEach(filme => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.style.backgroundImage = `url('${filme.imagemUrl}')`;

            const overlay = document.createElement('div');
            overlay.className = 'movie-info-overlay';
            const span = document.createElement('span');
            span.textContent = filme.titulo;
            overlay.appendChild(span);
            card.appendChild(overlay);

            card.onclick = () => {
                filmeSelecionadoId = filme.id;
                document.getElementById('modal-img').src = filme.imagemUrl;
                document.getElementById('modal-titulo').textContent = filme.titulo;
                document.getElementById('modal-descricao').textContent = filme.descricao || "Sem descrição.";
                
                // Verifica favoritos usando a chave do perfil atual
                const favs = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS)) || [];
                btnFavorito.textContent = favs.some(f => f.id === filme.id) ? "Remover dos Meus Favoritos" : "Adicionar aos Meus Favoritos";
                modal.classList.remove('hidden');
            };
            container.appendChild(card);
        });
    }

    btnFavorito.onclick = () => {
        let favs = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS)) || [];
        const conteudos = JSON.parse(localStorage.getItem('conteudos'));
        const filme = conteudos.find(f => f.id === filmeSelecionadoId);
        
        const index = favs.findIndex(f => f.id === filmeSelecionadoId);
        
        if (index > -1) {
            favs.splice(index, 1);
        } else {
            favs.push(filme);
        }
        
        localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favs));
        modal.classList.add('hidden');
        renderizarTudo();
    };

    btnFechar.onclick = () => modal.classList.add('hidden');
    renderizarTudo();
});