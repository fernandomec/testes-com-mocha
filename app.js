const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3005;

// Configurando o EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


// Middleware para parsing de JSON e urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cimatec',
    database: 'aulateste'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        throw err;
    }
    console.log('Conectado ao MySQL!');
});

// Rota para a página de cadastro de livro (cadastro-livro.ejs)
app.get('/addbook', (req, res) => {
    res.render('addbook');
});

// Rota para a página contato (contato.ejs)
app.get('/contato', (req, res) => {
    res.render('contato');
});

// Rota para a página home (home.ejs)
app.get('/', (req, res) => {
    res.render('home');
});

// Rota para a página sobre (sobre.ejs)
app.get('/sobre', (req, res) => {
    res.render('sobre'); 
});


// Rota para processar o formulário de adição de livros
app.post('/addbook', (req, res) => {
    let data = { title: req.body.title, author: req.body.author, year: req.body.year };
    let sql = "INSERT INTO books SET ?";
    db.query(sql, data, (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            throw err;
        }
        res.redirect('/addbook'); // Redireciona de volta para a página inicial de cadastros
    });
});

// Rota para processar o CONTATO
app.post('/contato', (req, res) => {
    let data = { nome: req.body.nome, email: req.body.email, mensagem: req.body.mensagem };
    let sql = "INSERT INTO contact SET ?";
    db.query(sql, data, (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            throw err;
        }
        res.redirect('/contato'); // Redireciona de volta para a página inicial de contato
    });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
