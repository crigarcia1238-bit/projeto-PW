document.addEventListener('DOMContentLoaded', () => {
    const loginBox = document.getElementById('login-box');
    const perfilBox = document.getElementById('perfil-box');
    const form = document.getElementById('form-login');

    // Verifica se já está logado para persistência após refresh
    if (localStorage.getItem('userLogado') === 'true') {
        loginBox.classList.add('hidden');
        perfilBox.classList.remove('hidden');
        renderizarPerfis();
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.setItem('userLogado', 'true');
            loginBox.classList.add('hidden');
            perfilBox.classList.remove('hidden');
            renderizarPerfis();
        });
    }

    function renderizarPerfis() {
        const grid = document.getElementById('perfis-grid');
        grid.innerHTML = "";
        const perfis = ['João', 'Ana', 'Rui', 'Kids'];

        perfis.forEach(nome => {
            const item = document.createElement('div');
            item.className = 'profile-item';
            
            const avatar = document.createElement('div');
            avatar.className = 'avatar-box';

            const label = document.createElement('span');
            label.textContent = nome;

            item.appendChild(avatar);
            item.appendChild(label);

            item.onclick = () => {
                localStorage.setItem('perfilAtivo', nome);
                window.location.href = 'catalogo.html';
            };
            grid.appendChild(item);
        });
    }
});