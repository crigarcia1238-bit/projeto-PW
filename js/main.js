document.addEventListener("DOMContentLoaded", () => {
    const loginBox = document.getElementById("login-box");
    const perfilBox = document.getElementById("perfil-box");
    const form = document.getElementById("form-login");
    const btnNovoPerfil = document.getElementById("btn-novo-perfil");

    if (localStorage.getItem("userLogado") === "true") {
        loginBox.classList.add("hidden");
        perfilBox.classList.remove("hidden");
        renderizarPerfis();
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-pass").value;

            const resposta = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.mensagem);
                return;
            }

            localStorage.setItem("userLogado", "true");
            localStorage.setItem("utilizadorId", dados.utilizador.id);
            localStorage.setItem("utilizadorNome", dados.utilizador.nome);

            loginBox.classList.add("hidden");
            perfilBox.classList.remove("hidden");
            renderizarPerfis();
        });
    }

    async function renderizarPerfis() {
        const grid = document.getElementById("perfis-grid");
        grid.textContent = "";

        const utilizadorId = localStorage.getItem("utilizadorId");

        const resposta = await fetch("http://localhost:3000/api/perfis");
        const todosPerfis = await resposta.json();

        const perfis = todosPerfis.filter(
            perfil => perfil.utilizador_id == utilizadorId
        );

        perfis.forEach((perfil) => {
            const item = document.createElement("div");
            item.className = "profile-item";

            const avatar = document.createElement("div");
            avatar.className = "avatar-box";
            avatar.style.backgroundImage = `url('${perfil.foto}')`;
            avatar.style.backgroundSize = "cover";
            avatar.style.backgroundPosition = "center";

            const label = document.createElement("span");
            label.textContent = perfil.nome;

            item.appendChild(avatar);
            item.appendChild(label); 
        item.onclick = () => {
            localStorage.setItem("perfilId", perfil.id);
            localStorage.setItem("perfilAtivo", perfil.nome);
            localStorage.setItem("fotoAtiva", perfil.foto);
            window.location.href = "catalogo.html";
        };

            grid.appendChild(item);


    });
    }
    if (btnNovoPerfil) {
    btnNovoPerfil.onclick = async () => {
        const utilizadorId = localStorage.getItem("utilizadorId");

        const nome = prompt("Nome do novo perfil:");
        if (!nome) return;

        await fetch("http://localhost:3000/api/perfis", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                foto: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
                utilizador_id: utilizadorId
            })
        });

        renderizarPerfis();
    };
}
});



