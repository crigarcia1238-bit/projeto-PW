document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "/api/conteudos";

    const form = document.getElementById("form-adicionar");
    const tabela = document.getElementById("tabela-conteudos");

    // Procura a lista de filmes no servidor
    async function buscarConteudos() {
        const resposta = await fetch(API_URL);
        return await resposta.json();
    }

    // Desenha as linhas da tabela de gestao no ecrã
    async function atualizarTabela() {
        tabela.textContent = "";

        const conteudos = await buscarConteudos();

        conteudos.forEach((filme) => {
            const tr = document.createElement("tr");

            const tdId = document.createElement("td");
            tdId.textContent = filme.id;

            const tdImg = document.createElement("td");
            const img = document.createElement("img");
            img.src = filme.imagemUrl;
            img.style.width = "50px";
            tdImg.appendChild(img);

            const tdTitulo = document.createElement("td");
            tdTitulo.textContent = filme.titulo;

            const tdGenero = document.createElement("td");
            tdGenero.textContent = filme.genero;

            const tdAno = document.createElement("td");
            tdAno.textContent = filme.ano;

            const tdAcoes = document.createElement("td");

            // Botao para editar o filme selecionado
            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.className = "btn-edit";
            btnEditar.onclick = () => carregarFormularioEdicao(filme);

            // Botao para apagar o filme selecionado
            const btnApagar = document.createElement("button");
            btnApagar.textContent = "Apagar";
            btnApagar.className = "btn-delete";
            btnApagar.onclick = async () => {
                await fetch(`${API_URL}/${filme.id}`, {
                    method: "DELETE"
                });

                atualizarTabela();
            };

            tdAcoes.append(btnEditar, btnApagar);
            tr.append(tdId, tdImg, tdTitulo, tdGenero, tdAno, tdAcoes);
            tabela.appendChild(tr);
        });
    }

    // Envia os dados do formulario para Criar ou Atualizar um filme
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("edit-id").value;

        const filme = {
            titulo: document.getElementById("titulo").value,
            descricao: "Sem descrição.",
            genero: document.getElementById("genero").value,
            ano: Number(document.getElementById("ano").value),
            classificacao: 0,
            imagemUrl: document.getElementById("imagem").value
        };

        if (id) {
            // Se tem ID, atualiza
            await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(filme)
            });
        } else {
            // Se nao tem, cria um novo
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(filme)
            });
        }

        form.reset();
        document.getElementById("edit-id").value = "";
        atualizarTabela();
    });

    // Poe os dados do filme nos campos do formulario para alterar
    function carregarFormularioEdicao(filme) {
        document.getElementById("titulo").value = filme.titulo;
        document.getElementById("genero").value = filme.genero;
        document.getElementById("ano").value = filme.ano;
        document.getElementById("imagem").value = filme.imagemUrl;
        document.getElementById("edit-id").value = filme.id;
    }

    atualizarTabela();
});