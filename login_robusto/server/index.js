// npm i express
const express = require('express');

// npm i nodemon - para atualizacao dinamica

// Para a comunicação entre front e back ocorrerem é preciso instalar e iniciar o cors
// mais sobre cors aqui: https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS
// npm i cors
const cors = require('cors');

// npm i mysql
// encontrei um erro ao tentar inserir um usuario ao bd
// solucionei usando essa linha na query do SQL Workbench:
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
const mysql = require('mysql');

// Para o processo de Autorização

// Sessions and Cookies:
// npm express-session
// npm body-parser
// npm cookie-parser

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

// npm i bcrypt - para hashing de senhas
const bcrypt = require('bcrypt')
const saltRounds = 10

// Para o processe de Autenticacao usamos Json Web Token
// npm i jsonwebtoken

const jwt = require('jsonwebtoken')
const app = express();

app.use(express.json()); //.json faz um parse de todo objeto enviado do frontend
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

//Cookie options
app.use(
    session({
        key: "userId",
        secret: "subscribe",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 1
        },
    })
);

//Cria conexão com o banco de dados
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "loginsystem"
});

// Query é uma funcao que envia (o primeiro parâmetro) um código SQL para o DB, os outros parâmetros são auxiliares
app.post('/register', (req, res) => {

    const cpf = req.body.cpf
    const senha = req.body.senha

    // HASHING  
    // Para utilizar o bcrypt e por um hash nas senhas basta:
    bcrypt.hash(senha, saltRounds, (err, hash) => {
        
        if (err) {
            console.log(err)
        }

        db.query(
            "INSERT INTO userdata (cpf, senha) VALUES (?,?)",
            [cpf, hash],
            (err, result) => {
                console.log(err);
            }
        );
    });

});

// verifyJWT é um middleware que verifica se o usuario possui o token correto
const verifyJWT = (req, res, next) => {
    const token = req.headers["x-acess-token"]; // pega o token

    if(!token) {
        res.send("Token needed");
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if(err) {
                res.json({auth: false, message: "Falha na autentificação"});
            } else {
                req.userId = decoded.id; // salva o id para que não tenha que fazer uma verificacao toda vez que é pedido durante a sessao
                next();
            }
        })
    }
}

app.get('/isUserAuth', verifyJWT, (req,res) => {
    res.send("Autenticação concluida!")
})

// Funcao que demonstra se existe ou não um usuario logado
app.get("/login", (req, res) => {
    if(req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
});

app.post("/login", (req, res) => {
    const cpf = req.body.cpf
    const senha = req.body.senha

    db.query(
        "SELECT * FROM userdata WHERE cpf = ?;",
        cpf,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }

            if (result.length > 0) {
                bcrypt.compare(senha, result[0].senha, (error, response) => {
                    if (response) {
                        req.session.user = result;

                        const id = result[0].id // pegamos o id de uma linha do db
                        const token = jwt.sign({id}, "jwtSecret", { // usamos o id que buscamos acima como parâmetro para linkar o token. 
                            expiresIn: 300,
                        })
                        req.session.user = result;
                        // Note que jwtSecret é apenas um nome teste, necessário buscar mais documentação de como criar uma variavel encriptada

                        // res.send(result);
                        res.json({auth: true, token: token, result: result}); //modificacoes no result aqui, retirar password

                        // Token criado e enviado para o frontEnd
                    } else {
                        res.json({auth: false, message: "Combinacao de CPF/senha errada!"});
                    }
                });
            } else {
                res.json({auth: false, message: "Nenhum usuario com esse cpf existe!"});
            }
        }
    );
});

app.listen(3001, () => {
    console.log("Running Server at port 3001...")
});