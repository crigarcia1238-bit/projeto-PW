// Classe para Categorias
class Categoria {
    constructor(id, nome) {
        this.id = id;
        this.nome = nome;
    }
}

// Classe para Conteúdos 
class Conteudo {
    constructor(id, titulo, descricao, genero, ano, classificacao, imagemUrl) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.genero = genero;
        this.ano = ano;
        this.classificacao = classificacao;
        this.imagemUrl = imagemUrl;
    }
}

// Classe para Perfis
class Perfil {
    constructor(nome, avatar) {
        this.nome = nome;
        this.avatar = avatar;
        this.favoritos = []; // Lista de IDs de conteúdos
        this.historico = []; // Lista de IDs de conteúdos
    }
}