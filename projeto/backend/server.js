const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(cors()); // Permite ligacoes de fora do servidor
app.use(express.json()); // Permite ler dados enviados em formato JSON

app.use(express.static(path.join(__dirname, 'public'))); // Serve os ficheiros de frontend (HTML, CSS, JS)

// Conecta a base de dados MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "estflix",
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Erro ao ligar ao MySQL:', err);
        return;
    }
    console.log('Ligado com sucesso à Base de Dados MySQL.');
});

// Autenticacao de utilizadores
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM utilizadores WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) return res.status(500).json({ mensagem: "Erro no servidor" });
        if (results.length > 0) {
            res.json({ utilizador: results[0] });
        } else {
            res.status(401).json({ margin: "Email ou password incorretos!" });
        }
    });
});

// Registo de novos utilizadores
app.post('/api/registo', (req, res) => {
    const { nome, email, password } = req.body;

    db.query('SELECT email FROM utilizadores WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ mensagem: "Erro no servidor" });
        if (results.length > 0) {
            return res.status(400).json({ mensagem: "Este email já se encontra registado!" });
        }

        db.query('INSERT INTO utilizadores (nome, email, password) VALUES (?, ?, ?)', 
        [nome, email, password], (err) => {
            if (err) return res.status(500).json({ mensagem: "Erro ao criar conta" });
            res.json({ mensagem: "Utilizador criado com sucesso!" });
        });
    });
});

// Lista todos os perfis
app.get('/api/perfis', (req, res) => {
    db.query('SELECT * FROM perfis', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Cria um novo perfil
app.post('/api/perfis', (req, res) => {
    const { nome, foto, utilizador_id } = req.body;
    db.query('INSERT INTO perfis (nome, foto, utilizador_id) VALUES (?, ?, ?)', [nome, foto, utilizador_id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ id: results.insertId, nome, foto, utilizador_id });
    });
});

// Apaga um perfil por ID
app.delete('/api/perfis/:id', (req, res) => {
    db.query('DELETE FROM perfis WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ mensagem: "Erro ao apagar o perfil" });
        res.json({ mensagem: "Perfil apagado com sucesso!" });
    });
});

// Lista todos os filmes do catalogo
app.get('/api/conteudos', (req, res) => {
    db.query('SELECT * FROM conteudos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Adiciona um novo filme ao catalogo
app.post('/api/conteudos', (req, res) => {
    const { titulo, descricao, genero, ano, imagemUrl } = req.body;
    db.query('INSERT INTO conteudos (titulo, descricao, genero, ano, imagemUrl) VALUES (?, ?, ?, ?, ?)', 
    [titulo, descricao, genero, ano, imagemUrl], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ id: results.insertId });
    });
});

// Atualiza os dados de um filme
app.put('/api/conteudos/:id', (req, res) => {
    const { titulo, genero, ano, imagemUrl } = req.body;
    db.query('UPDATE conteudos SET titulo=?, genero=?, ano=?, imagemUrl=? WHERE id=?', 
    [titulo, genero, ano, imagemUrl, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensagem: "Atualizado com sucesso" });
    });
});

// Remove um filme do catalogo
app.delete('/api/conteudos/:id', (req, res) => {
    db.query('DELETE FROM conteudos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensagem: "Apagado com sucesso" });
    });
});

// Procura os favoritos de um perfil especifico
app.get('/api/favoritos/:perfilId', (req, res) => {
    const query = `SELECT c.* FROM conteudos c INNER JOIN favoritos f ON c.id = f.conteudo_id WHERE f.perfil_id = ?`;
    db.query(query, [req.params.perfilId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Adiciona um filme aos favoritos
app.post('/api/favoritos', (req, res) => {
    const { perfil_id, conteudo_id } = req.body;
    db.query('INSERT INTO favoritos (perfil_id, conteudo_id) VALUES (?, ?)', [perfil_id, conteudo_id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ OK: true });
    });
});

// Remove um filme dos favoritos
app.delete('/api/favoritos', (req, res) => {
    const { perfil_id, conteudo_id } = req.body;
    db.query('DELETE FROM favoritos WHERE perfil_id = ? AND conteudo_id = ?', [perfil_id, conteudo_id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ OK: true });
    });
});

// Lista o historico de um perfil
app.get('/api/historico/:perfilId', (req, res) => {
    const query = `
        SELECT c.* FROM conteudos c 
        INNER JOIN historico h ON c.id = h.conteudo_id 
        WHERE h.perfil_id = ?
        GROUP BY c.id
        ORDER BY MAX(h.id) DESC
    `;
    db.query(query, [req.params.perfilId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Regista a visualizacao de um filme no historico
app.post('/api/historico', (req, res) => {
    const { perfil_id, conteudo_id } = req.body;
    db.query('INSERT INTO historico (perfil_id, conteudo_id) VALUES (?, ?)', [perfil_id, conteudo_id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ OK: true });
    });
});

app.listen(3000, () => console.log('Servidor REST a correr na porta 3000'));