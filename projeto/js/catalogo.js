document.addEventListener('DOMContentLoaded', () => {
    const nomeDisplay = document.getElementById('nome-perfil');
    const btnLogout = document.getElementById('btn-logout');

    // Recupera o perfil guardado no LocalStorage[cite: 1]
    const perfilAtivo = localStorage.getItem('perfilAtivo');

    if (!perfilAtivo) {
        // Se não houver perfil, volta para o login[cite: 1]
        window.location.href = 'index.html'; 
    } else {
        nomeDisplay.textContent = perfilAtivo; 
    }

    if (btnLogout) {
        btnLogout.onclick = () => {
            // Limpa a sessão e volta ao início[cite: 1]
            localStorage.removeItem('userLogado');
            localStorage.removeItem('perfilAtivo');
            window.location.href = 'index.html';
        };
    }
    
});