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
    
    
    const perfis = [
        { nome: 'João', img: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png' },
        { nome: 'Ana', img: 'https://ih0.redbubble.net/image.618427277.3222/flat,1000x1000,075,f.u2.jpg' },
        { nome: 'Rui', img: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/84c20033850498.56ba69ac290ea.png' },
        { nome: 'Kids', img: 'https://static.vecteezy.com/system/resources/thumbnails/007/380/516/small/colorful-kids-logo-children-logo-designs-template-design-element-for-logo-poster-card-banner-emblem-t-shirt-illustration-vector.jpg' }
    ];

    perfis.forEach(perfil => {
        const item = document.createElement('div');
        item.className = 'profile-item';
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar-box';
        
        // Aplicar a imagem ao fundo do quadrado
        avatar.style.backgroundImage = `url('${perfil.img}')`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';

        const label = document.createElement('span');
        label.textContent = perfil.nome;

        item.appendChild(avatar);
        item.appendChild(label);

        item.onclick = () => {
         localStorage.setItem('perfilAtivo', perfil.nome);
        localStorage.setItem('fotoAtiva', perfil.img); 
        window.location.href = 'catalogo.html';
        };
        grid.appendChild(item);
    });
}
});