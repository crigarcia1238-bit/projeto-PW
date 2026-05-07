document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-adicionar');
    const tabela = document.getElementById('tabela-conteudos');

    function atualizarTabela() {
        tabela.textContent = ""; 
        const conteudos = JSON.parse(localStorage.getItem('conteudos')) || [];

        conteudos.forEach((filme) => {
            const tr = document.createElement('tr');

            // ID Automático 
            const tdId = document.createElement('td');
            tdId.textContent = filme.id;

            const tdImg = document.createElement('td');
            const img = document.createElement('img');
            img.src = filme.imagemUrl;
            img.style.width = "50px";
            tdImg.appendChild(img);

            const tdTitulo = document.createElement('td');
            tdTitulo.textContent = filme.titulo;

            const tdGenero = document.createElement('td');
            tdGenero.textContent = filme.genero;

            const tdAno = document.createElement('td');
            tdAno.textContent = filme.ano;

            const tdAcoes = document.createElement('td');
            
            // Botão Editar 
            const btnEditar = document.createElement('button');
            btnEditar.textContent = "Editar";
            btnEditar.className = "btn-edit";
            btnEditar.onclick = () => carregarFormularioEdicao(filme);

            // Botão Apagar 
            const btnApagar = document.createElement('button');
            btnApagar.textContent = "Apagar";
            btnApagar.className = "btn-delete";
            btnApagar.onclick = () => {
                const novaLista = conteudos.filter(f => f.id !== filme.id);
                localStorage.setItem('conteudos', JSON.stringify(novaLista));
                atualizarTabela();
            };

            tdAcoes.append(btnEditar, btnApagar);
            tr.append(tdId, tdImg, tdTitulo, tdGenero, tdAno, tdAcoes);
            tabela.appendChild(tr);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const conteudos = JSON.parse(localStorage.getItem('conteudos')) || [];
        
        // Lógica de ID automático 
        const novoId = conteudos.length > 0 ? Math.max(...conteudos.map(f => f.id)) + 1 : 1;

        const filme = {
            id: document.getElementById('edit-id').value || novoId,
            titulo: document.getElementById('titulo').value,
            genero: document.getElementById('genero').value,
            ano: document.getElementById('ano').value,
            imagemUrl: document.getElementById('imagem').value
        };

        // Regra: Título único 
        const existe = conteudos.find(f => f.titulo === filme.titulo && f.id != filme.id);
        if (existe) {
            alert("Não podem existir conteúdos com o mesmo título ");
            return;
        }

        const index = conteudos.findIndex(f => f.id == filme.id);
        if (index > -1) {
            conteudos[index] = filme; // Update
        } else {
            conteudos.push(filme); // Create
        }

        localStorage.setItem('conteudos', JSON.stringify(conteudos));
        form.reset();
        document.getElementById('edit-id').value = ""; // Limpa ID de edição
        atualizarTabela();
    });

    function carregarFormularioEdicao(filme) {
        document.getElementById('titulo').value = filme.titulo;
        document.getElementById('genero').value = filme.genero;
        document.getElementById('ano').value = filme.ano;
        document.getElementById('imagem').value = filme.imagemUrl;
        document.getElementById('edit-id').value = filme.id; // Campo hidden para saber que é edição
    }

    atualizarTabela();
});