class GerenciadorDados {
    static getDados(chave) {
        return JSON.parse(localStorage.getItem(chave)) || [];
    }

    static salvarDados(chave, dados) {
        localStorage.setItem(chave, JSON.stringify(dados));
    }

    static adicionarConteudo(novoConteudo) {
        const conteudos = this.getDados('conteudos');
        if (conteudos.some(c => c.titulo === novoConteudo.titulo)) {
            alert("Erro: Já existe um conteúdo com este título.");
            return false;
        }
        novoConteudo.id = Date.now(); // Geração de ID automático
        conteudos.push(novoConteudo);
        this.salvarDados('conteudos', conteudos);
        return true;
    }
    
}
class StorageManager {
    static login() {
        localStorage.setItem('userLogado', 'true');
    }
    

    static logout() {
        localStorage.clear(); // Limpa tudo ao sair
        window.location.href = 'index.html';
    }

    static setPerfil(nome) {
        localStorage.setItem('perfilAtivo', nome);
    }

    static getPerfilAtivo() {
        return localStorage.getItem('perfilAtivo');
    }

    static isLogado() {
        return localStorage.getItem('userLogado') === 'true';
    }
}

class Auth {
    static verificarAcesso() {
        if (localStorage.getItem('userLogado') !== 'true') {
            window.location.href = 'index.html';
        }
    }

    static logout() {
        localStorage.removeItem('userLogado');
        localStorage.removeItem('perfilAtivo');
        window.location.href = 'index.html';
    }
}

