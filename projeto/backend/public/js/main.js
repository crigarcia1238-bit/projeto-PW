document.addEventListener("DOMContentLoaded", () => {
    const loginBox = document.getElementById("login-box");
    const perfilBox = document.getElementById("perfil-box");
    const form = document.getElementById("form-login");
    const btnNovoPerfil = document.getElementById("btn-novo-perfil");

    const registoBox = document.getElementById("registo-box");
    const formRegisto = document.getElementById("form-registo");
    const linkIrRegisto = document.getElementById("link-ir-registo");
    const linkIrLogin = document.getElementById("link-ir-login");

    // Verifica se ja esta autenticado para saltar o login
    if (localStorage.getItem("userLogado") === "true") {
        loginBox.classList.add("hidden");
        perfilBox.classList.remove("hidden");
        renderizarPerfis();
    }

    // Alterna para o ecra de criar conta
    if (linkIrRegisto) {
        linkIrRegisto.onclick = (e) => {
            e.preventDefault();
            loginBox.classList.add("hidden");
            registoBox.classList.remove("hidden");
        };
    }

    // Alterna para o ecra de entrar
    if (linkIrLogin) {
        linkIrLogin.onclick = (e) => {
            e.preventDefault();
            registoBox.classList.add("hidden");
            loginBox.classList.remove("hidden");
        };
    }

    // Envio do formulario de Login
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

            // Guarda as flags da sessao do utilizador
            localStorage.setItem("userLogado", "true");
            localStorage.setItem("utilizadorId", dados.utilizador.id);
            localStorage.setItem("utilizadorNome", dados.utilizador.nome);

            loginBox.classList.add("hidden");
            perfilBox.classList.remove("hidden");
            renderizarPerfis();
        });
    }

    // Envio do formulario de Registo
    if (formRegisto) {
        formRegisto.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nome = document.getElementById("registo-nome").value;
            const email = document.getElementById("registo-email").value;
            const password = document.getElementById("registo-pass").value;

            const resposta = await fetch("/api/registo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, password })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.mensagem);
                return;
            }

            alert("Conta criada com sucesso! Faça login para continuar.");
            formRegisto.reset();
            registoBox.classList.add("hidden");
            loginBox.classList.remove("hidden");
        });
    }

    // Mostra apenas os perfis da conta iniciada
    async function renderizarPerfis() {
        const grid = document.getElementById("perfis-grid");
        grid.textContent = "";

        const utilizadorId = localStorage.getItem("utilizadorId");

        const resposta = await fetch("/api/perfis");
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

            // Botao para apagar o perfil
            const btnApagar = document.createElement("button");
            btnApagar.className = "btn-delete-profile";
            btnApagar.innerText = "X";
            btnApagar.title = "Apagar Perfil";

            btnApagar.onclick = async (e) => {
                e.stopPropagation(); 
                
                const confirmar = confirm(`Tens a certeza que queres apagar o perfil "${perfil.nome}"?`);
                if (!confirmar) return;

                const respostaDel = await fetch(`/api/perfis/${perfil.id}`, {
                    method: "DELETE"
                });

                if (respostaDel.ok) {
                    alert("Perfil apagado com sucesso!");
                    renderizarPerfis(); 
                } else {
                    const erro = await respostaDel.json();
                    alert(erro.mensagem || "Não foi possível apagar o perfil.");
                }
            };

            item.appendChild(btnApagar);
            item.appendChild(avatar);
            item.appendChild(label); 
            
            // Entra no catalogo com o perfil escolhido
            item.onclick = () => {
                localStorage.setItem("perfilId", perfil.id);
                localStorage.setItem("perfilAtivo", perfil.nome);
                localStorage.setItem("fotoAtiva", perfil.foto);
                window.location.href = "catalogo.html";
            };

            grid.appendChild(item);
        });
    }

    // Criacao de um novo perfil (valida o maximo de 5)
    if (btnNovoPerfil) {
        btnNovoPerfil.onclick = async () => {
            const utilizadorId = localStorage.getItem("utilizadorId");

            const resposta = await fetch("/api/perfis");
            const todosPerfis = await resposta.json();

            const perfisDoUtilizador = todosPerfis.filter(
                perfil => perfil.utilizador_id == utilizadorId
            );

            if (perfisDoUtilizador.length >= 5) {
                alert("Limite atingido! Apenas podes criar até 5 perfis por conta.");
                return;
            }

            const nome = prompt("Nome do novo perfil:");
            if (!nome) return;

            await fetch("/api/perfis", {
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