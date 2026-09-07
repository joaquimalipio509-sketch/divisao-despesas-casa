const express = require("express");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const PORT = 3000;

// Conectar ao banco de dados
const db = new Database("banco.db");

// Criar tabela de usuários
db.prepare(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
    )
`).run();

console.log("Banco de dados conectado!");
console.log("Tabela de usuários criada!");

app.get("/", function(req, res) {
    res.send("Backend funcionando!");
});

app.post("/cadastro", function(req, res) {

    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({
            mensagem: "Usuário e senha são obrigatórios."
        });
    }

    const senhaHash = bcrypt.hashSync(senha, 10);

    try {

        const resultado = db.prepare(`
            INSERT INTO usuarios (usuario, senha)
            VALUES (?, ?)
        `).run(usuario, senhaHash);

        res.json({
            mensagem: "Usuário cadastrado com sucesso!",
            id: resultado.lastInsertRowid
        });

    } catch (erro) {

        res.status(400).json({
            mensagem: "Esse usuário já existe."
        });

    }
});

// Login
app.post("/login", function(req, res) {

    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({
            mensagem: "Usuário e senha são obrigatórios."
        });
    }

    const usuarioEncontrado = db.prepare(`
        SELECT * FROM usuarios
        WHERE usuario = ?
    `).get(usuario);

    if (!usuarioEncontrado) {
        return res.status(401).json({
            mensagem: "Usuário ou senha incorretos."
        });
    }

    const senhaCorreta = bcrypt.compareSync(
        senha,
        usuarioEncontrado.senha
    );

    if (!senhaCorreta) {
        return res.status(401).json({
            mensagem: "Usuário ou senha incorretos."
        });
    }

    res.json({
        mensagem: "Login realizado com sucesso!",
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario
    });
});

// Adicionar despesa
app.post("/despesas", function(req, res) {

    const {
        usuario_id,
        data,
        pessoas,
        aluguel,
        gas,
        energia,
        agua,
        total,
        valor_por_pessoa
    } = req.body;

    if (!usuario_id || !data || !pessoas) {
        return res.status(400).json({
            mensagem: "Dados obrigatórios não informados."
        });
    }

    try {

        const resultado = db.prepare(`
            INSERT INTO despesas (
                usuario_id,
                data,
                pessoas,
                aluguel,
                gas,
                energia,
                agua,
                total,
                valor_por_pessoa
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            usuario_id,
            data,
            pessoas,
            aluguel,
            gas,
            energia,
            agua,
            total,
            valor_por_pessoa
        );

        res.json({
            mensagem: "Despesa salva com sucesso!",
            id: resultado.lastInsertRowid
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao salvar despesa."
        });
    }
});

// Excluir despesa
app.delete("/despesas/:id", function(req, res) {

    const id = Number(req.params.id);

    try {

        const resultado = db.prepare(`
            DELETE FROM despesas
            WHERE id = ?
        `).run(id);

        if (resultado.changes === 0) {
            return res.status(404).json({
                mensagem: "Despesa não encontrada."
            });
        }

        res.json({
            mensagem: "Despesa excluída com sucesso!"
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao excluir despesa."
        });
    }
});

// Buscar despesas de um usuário
app.get("/despesas/:usuario_id", function(req, res) {

    const usuario_id = Number(req.params.usuario_id);

    try {

        const despesas = db.prepare(`
            SELECT *
            FROM despesas
            WHERE usuario_id = ?
            ORDER BY id DESC
        `).all(usuario_id);

        res.json(despesas);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar despesas."
        });
    }
});

app.listen(PORT, "0.0.0.0", function() {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Criar tabela de despesas
db.prepare(`
    CREATE TABLE IF NOT EXISTS despesas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        data TEXT NOT NULL,
        pessoas INTEGER NOT NULL,
        aluguel REAL NOT NULL,
        gas REAL NOT NULL,
        energia REAL NOT NULL,
        agua REAL NOT NULL,
        total REAL NOT NULL,
        valor_por_pessoa REAL NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
`).run();

console.log("Tabela de despesas criada!");