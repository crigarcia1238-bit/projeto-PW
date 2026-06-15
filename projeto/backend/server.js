const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "estflix",
    port: 3306
});
app.use(express.static(path.join(__dirname, 'public')));

db.connect((erro) => {
    if (erro) {
        console.log("Erro ao ligar à BD:", erro);
        return;
    }
    console.log("Ligado ao MySQL");
});

app.get("/", (req, res) => {
    res.send("Servidor ESTFlix ativo");
});
// LISTAR todos os conteúdos
app.get("/api/conteudos", (req,res)=>{

    const sql = "SELECT * FROM conteudos";

    db.query(sql,(erro,resultado)=>{

        if(erro){
            return res.status(500).json(erro);
        }

        res.json(resultado);

    });

});

// BUSCAR conteúdo por ID
app.get("/api/conteudos/:id", (req, res) => {
    const id = req.params.id;

    const sql = "SELECT * FROM conteudos WHERE id = ?";

    db.query(sql, [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json(erro);
        }

        if (resultado.length === 0) {
            return res.status(404).json({
                mensagem: "Filme não encontrado"
            });
        }

        res.json(resultado[0]);
    });
});

// ADICIONAR conteúdo
app.post("/api/conteudos",(req,res)=>{

    const {
        titulo,
        descricao,
        genero,
        ano,
        classificacao,
        imagemUrl
    } = req.body;

    const sql=`
    INSERT INTO conteudos
    (titulo,descricao,genero,ano,classificacao,imagemUrl)
    VALUES (?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            titulo,
            descricao,
            genero,
            ano,
            classificacao,
            imagemUrl
        ],
        (erro,resultado)=>{

        if(erro){
            return res.status(500).json(erro);
        }

        res.json({
            mensagem:"Filme criado"
        });

    });

});


// APAGAR
app.delete("/api/conteudos/:id",(req,res)=>{

    const id=req.params.id;

    db.query(
        "DELETE FROM conteudos WHERE id=?",
        [id],
        (erro)=>{

        if(erro){
            return res.status(500).json(erro);
        }

        res.json({
            mensagem:"Filme apagado"
        });

    });

});


// EDITAR
app.put("/api/conteudos/:id",(req,res)=>{

const id=req.params.id;

const{
titulo,
descricao,
genero,
ano,
classificacao,
imagemUrl
}=req.body;


const sql=`
UPDATE conteudos
SET titulo=?,
descricao=?,
genero=?,
ano=?,
classificacao=?,
imagemUrl=?
WHERE id=?
`;

db.query(
sql,
[
titulo,
descricao,
genero,
ano,
classificacao,
imagemUrl,
id
],
(erro)=>{

if(erro){
return res.status(500).json(erro);
}

res.json({
mensagem:"Atualizado"
});

});

});

// LISTAR categorias
app.get("/api/categorias", (req, res) => {
    db.query("SELECT * FROM categorias", (erro, resultado) => {
        if (erro) return res.status(500).json(erro);
        res.json(resultado);
    });
});

// BUSCAR categoria por ID
app.get("/api/categorias/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM categorias WHERE id = ?", [id], (erro, resultado) => {
        if (erro) return res.status(500).json(erro);

        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Categoria não encontrada" });
        }

        res.json(resultado[0]);
    });
});

// CRIAR categoria
app.post("/api/categorias", (req, res) => {
    const { nome } = req.body;

    db.query(
        "INSERT INTO categorias (nome) VALUES (?)",
        [nome],
        (erro, resultado) => {
            if (erro) return res.status(500).json(erro);

            res.json({
                mensagem: "Categoria criada",
                id: resultado.insertId
            });
        }
    );
});

// EDITAR categoria
app.put("/api/categorias/:id", (req, res) => {
    const id = req.params.id;
    const { nome } = req.body;

    db.query(
        "UPDATE categorias SET nome = ? WHERE id = ?",
        [nome, id],
        (erro) => {
            if (erro) return res.status(500).json(erro);

            res.json({ mensagem: "Categoria atualizada" });
        }
    );
});

// APAGAR categoria
app.delete("/api/categorias/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "DELETE FROM categorias WHERE id = ?",
        [id],
        (erro) => {
            if (erro) return res.status(500).json(erro);

            res.json({ mensagem: "Categoria apagada" });
        }
    );
});
// ROTAS UTILIZADORES

app.get("/api/utilizadores", (req, res) => {
    db.query("SELECT * FROM utilizadores", (erro, resultado) => {
        if (erro) return res.status(500).json(erro);
        res.json(resultado);
    });
});

app.post("/api/utilizadores", (req, res) => {
    const { nome, email, password } = req.body;

    db.query(
        "INSERT INTO utilizadores (nome, email, password) VALUES (?, ?, ?)",
        [nome, email, password],
        (erro, resultado) => {
            if (erro) return res.status(500).json(erro);

            res.json({
                mensagem: "Utilizador criado",
                id: resultado.insertId
            });
        }
    );
});

// LISTAR perfis
app.get("/api/perfis", (req, res) => {
    db.query("SELECT * FROM perfis", (erro, resultado) => {
        if (erro) return res.status(500).json(erro);

        res.json(resultado);
    });
});

// CRIAR perfil
app.post("/api/perfis", (req, res) => {
    const { nome, foto, utilizador_id } = req.body;

    db.query(
        "INSERT INTO perfis (nome, foto, utilizador_id) VALUES (?, ?, ?)",
        [nome, foto, utilizador_id],
        (erro, resultado) => {
            if (erro) return res.status(500).json(erro);

            res.json({
                mensagem: "Perfil criado",
                id: resultado.insertId
            });
        }
    );
});

// Rota para apagar um perfil específico
app.delete('/api/perfis/:id', (req, res) => {
    const perfilId = req.params.id;

    db.query('DELETE FROM perfis WHERE id = ?', [perfilId], (err, results) => {
        if (err) {
            console.error("Erro ao apagar perfil:", err);
            return res.status(500).json({ mensagem: "Erro ao apagar o perfil da base de dados" });
        }
        
        res.json({ mensagem: "Perfil apagado com sucesso!" });
    });
});


// LISTAR favoritos de um perfil
app.get("/api/favoritos/:perfil_id", (req, res) => {
    const perfil_id = req.params.perfil_id;

    const sql = `
        SELECT conteudos.*
        FROM favoritos
        INNER JOIN conteudos ON favoritos.conteudo_id = conteudos.id
        WHERE favoritos.perfil_id = ?
    `;

    db.query(sql, [perfil_id], (erro, resultado) => {
        if (erro) return res.status(500).json(erro);
        res.json(resultado);
    });
});

// ADICIONAR favorito
app.post("/api/favoritos", (req, res) => {
    const { perfil_id, conteudo_id } = req.body;

    db.query(
        "INSERT INTO favoritos (perfil_id, conteudo_id) VALUES (?, ?)",
        [perfil_id, conteudo_id],
        (erro) => {
            if (erro) return res.status(500).json(erro);
            res.json({ mensagem: "Favorito adicionado" });
        }
    );
});

// REMOVER favorito
app.delete("/api/favoritos", (req, res) => {
    const { perfil_id, conteudo_id } = req.body;

    db.query(
        "DELETE FROM favoritos WHERE perfil_id = ? AND conteudo_id = ?",
        [perfil_id, conteudo_id],
        (erro) => {
            if (erro) return res.status(500).json(erro);
            res.json({ mensagem: "Favorito removido" });
        }
    );
});


// LISTAR histórico de um perfil
app.get("/api/historico/:perfil_id", (req, res) => {
    const perfil_id = req.params.perfil_id;

    const sql = `
        SELECT c.*, MAX(h.data_visualizacao) AS data_visualizacao
        FROM historico h
        INNER JOIN conteudos c ON h.conteudo_id = c.id
        WHERE h.perfil_id = ?
        GROUP BY c.id
        ORDER BY data_visualizacao DESC
    `;

    db.query(sql, [perfil_id], (erro, resultado) => {
        if (erro) return res.status(500).json(erro);
        res.json(resultado);
    });
});

// ADICIONAR ao histórico
app.post("/api/historico", (req, res) => {
    const { perfil_id, conteudo_id } = req.body;

    db.query(
        "INSERT INTO historico (perfil_id, conteudo_id) VALUES (?, ?)",
        [perfil_id, conteudo_id],
        (erro) => {
            if (erro) return res.status(500).json(erro);
            res.json({ mensagem: "Histórico registado" });
        }
    );
});

// LOGIN
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM utilizadores WHERE email = ? AND password = ?",
        [email, password],
        (erro, resultado) => {
            if (erro) return res.status(500).json(erro);

            if (resultado.length === 0) {
                return res.status(401).json({
                    mensagem: "Email ou password incorretos"
                });
            }

            res.json({
                mensagem: "Login efetuado",
                utilizador: resultado[0]
            });
        }
    );
});

app.listen(3000, () => {
    console.log("Servidor em http://localhost:3000");
});