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

            const resposta = await fetch("/api/login", {
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

        const resposta = await fetch("/api/perfis");
        const todosPerfis = await resposta.json();

        const perfis = todosPerfis.filter(
            perfil => perfil.utilizador_id == utilizadorId
        );

       
perfis.forEach(perfil => {
    const item = document.createElement("div");
    item.className = "profile-item"; // Usar a classe para posicionamento relativo

    const avatar = document.createElement("div");
    avatar.className = "avatar-box";
    avatar.style.backgroundImage = `url('${perfil.foto}')`;
    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "center";

    const label = document.createElement("span");
    label.textContent = perfil.nome;

    // --- NOVO: Criar o botão de apagar perfil ---
    const btnApagar = document.createElement("button");
    btnApagar.className = "btn-delete-profile";
    btnApagar.innerText = "X";
    btnApagar.title = "Apagar Perfil";

    // Evento para apagar o perfil
    btnApagar.onclick = async (e) => {
        e.stopPropagation(); // Impede que o clique selecione o perfil e mude de página
        
        const confirmar = confirm(`Tens a certeza que queres apagar o perfil "${perfil.nome}"?`);
        if (!confirmar) return;

        try {
            const resposta = await fetch(`http://localhost:3000/api/perfis/${perfil.id}`, {
                method: "DELETE"
            });

            if (resposta.ok) {
                alert("Perfil apagado com sucesso!");
                // Recarrega a lista de perfis na interface
                renderizarPerfis(); 
            } else {
                const erro = await resposta.json();
                alert(erro.mensagem || "Não foi possível apagar o perfil.");
            }
        } catch (erro) {
            console.error("Erro na ligação à API:", erro);
            alert("Erro ao ligar ao servidor.");
        }
    };
    // --------------------------------------------

    // Adiciona os elementos ao item do perfil
    item.appendChild(btnApagar); 
    item.appendChild(avatar);
    item.appendChild(label); 

    // Clique para entrar no perfil
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

        // Procurar os perfis existentes na API para contar quantos este utilizador tem
        const resposta = await fetch("http://localhost:3000/api/perfis");
        const todosPerfis = await resposta.json();

        // Filtrar para contar apenas os perfis do utilizador atual
        const perfisDoUtilizador = todosPerfis.filter(
            perfil => perfil.utilizador_id == utilizadorId
        );

    // Validar se já atingiu o limite de 5 perfis
        if (perfisDoUtilizador.length >= 5) {
            alert("Limite atingido! Apenas podes criar até 5 perfis por conta.");
            return; // Bloqueia a execução e não deixa criar o perfil
        }

        
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



