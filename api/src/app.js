const express = require('express')

const {MongoClient} = require('mongodb')
const UserRepository = require('./user-repository.js')
const bodyParser = require('body-parser')
const {ObjectId} = require('bson')

const app = express()

const HTTP_OK = 200;
const HTTP_OK_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;

require('dotenv').config();

// Este middleware faz com que as requisições que passem pelo servidor que sejam strings no formato json
// sejam transformadas em actual objetos json. Dessa forma, quando pegarmos o campo body de uma response,
// ele já vai vir como um objeto do qual podemos facilmente pegar seus campos, ao invés de um texto
app.use(bodyParser.json())

let userRepository;
let client;
let connected = false;

// Este middleware faz com o que o servidor estabeleça uma conexão ao nosso banco de dados mongodb (se uma
// não já tiver sido feita) antes de tratar uma requisição
app.use(async (req,res,next)=>{
    if (!connected){
        const user = process.env.DB_USER;
        const pass = process.env.DB_PASS;
        const serverName = process.env.DB_SERVERNAME;
        const dbName = process.env.DB_NAME;
        const collName = process.env.DB_COLLNAME;
    
        const uri = `mongodb+srv://${user}:${pass}@${serverName}/?retryWrites=true&w=majority`;
        client = new MongoClient(uri);
        await client.connect();
        const collection = client.db(dbName).collection(collName);
        userRepository = new UserRepository(collection);
        connected = true;
    }

    //Não esquecer do next() no final da função do middleware!
    next();
})

// Este middleware adiciona uns headers na resposta às requisições para
// evitar erros relacionados a política de CORS
app.use(function(req, res, next) {
    res.header("access-control-allow-origin", "*",);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
});

app.get('/users', async (req,res)=>{
    const users = await userRepository.findAll();
    res.status(HTTP_OK).json(users);
})

app.post('/users', async(req,res)=>{
    try{
        const user = await userRepository.insert(req.body);
        res.status(HTTP_OK_CREATED).json(user);
    }catch(e){
        res.status(HTTP_CONFLICT).send();
    }
})

app.get('/users/:userid', async(req,res)=>{
    try{
        const user = await userRepository.findOneById(ObjectId(req.params.userid));
        res.status(HTTP_OK).json(user);
    }catch(e){
        res.status(HTTP_NOT_FOUND).send();
    }
})

app.delete('/users/:userid', async(req,res)=>{
    try{
        await userRepository.delete(ObjectId(req.params.userid));
        res.status(HTTP_OK).send();
    }catch(e){
        res.status(HTTP_NOT_FOUND).send();
    }
})

app.put('/users/:userid', async(req,res)=>{
    try{
        await userRepository.update(ObjectId(req.params.userid), req.body);
        res.status(HTTP_OK).send();
    }catch(e){
        res.status(HTTP_NOT_FOUND).send();
    }
})

module.exports = app