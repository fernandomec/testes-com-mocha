const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Configuração do app para testes
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
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

// Rotas
app.get('/addbook', (req, res) => {
    res.render('addbook');
});

app.get('/contato', (req, res) => {
    res.render('contato');
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/sobre', (req, res) => {
    res.render('sobre'); 
});

app.post('/addbook', (req, res) => {
    let data = { title: req.body.title, author: req.body.author, year: req.body.year };
    let sql = "INSERT INTO books SET ?";
    db.query(sql, data, (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            throw err;
        }
        res.redirect('/addbook');
    });
});

app.post('/contato', (req, res) => {
    let data = { nome: req.body.nome, email: req.body.email, mensagem: req.body.mensagem };
    let sql = "INSERT INTO contact SET ?";
    db.query(sql, data, (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            throw err;
        }
        res.redirect('/contato');
    });
});

// Testes
describe('Testes da Aplicação Express', function() {
    // Testa se a página inicial carrega corretamente
    it('Deve carregar a página inicial', function(done) {
        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });

    // Testa se a página de contato carrega corretamente
    it('Deve carregar a página contato', function(done) {
        request(app)
            .get('/contato')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });
    
    // Testa se a página "sobre" carrega corretamente
    it('Deve carregar a página sobre', function(done) {
        request(app)
            .get('/sobre')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });

    // Testa se o livro é adicionado corretamente e redireciona para a página de livros
    it('Deve adicionar um livro e redirecionar para a página de cadastro de livros', function(done) {
        request(app)
            .post('/addbook')
            .send({ title: 'Teste Livro', author: 'Autor Teste', year: 2024 })
            .expect('Location', '/addbook')
            .expect(302, done);
    });

    // Testa se a mensagem de contato é enviada corretamente e redireciona para a página de contato
    it('Deve enviar a mensagem de contato e redirecionar para a página contato', function(done) {
        request(app)
            .post('/contato')
            .send({ nome: 'Teste Nome', email: 'teste@exemplo.com', mensagem: 'Mensagem de teste' })
            .expect('Location', '/contato')
            .expect(302, done);
    });

    // Testa se a conexão com o MySQL está funcionando
    it('Deve estar conectado ao MySQL', function(done) {
        db.ping(function(err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    // Testa se a página de adicionar livro está acessível
    it('Deve carregar a página de adicionar livro', function(done) {
        request(app)
            .get('/addbook')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });
});
