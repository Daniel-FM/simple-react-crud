export default function getApp (database){

    const express = require('express')

    const bodyParser = require('body-parser')
    const {ObjectId} = require('bson')

    const app = express()

    const HTTP_OK = 200;
    const HTTP_OK_CREATED = 201;
    const HTTP_NOT_FOUND = 404;
    const HTTP_CONFLICT = 409;

    //Para poder pegar variáveis do arquivo .env
    require('dotenv').config();

    // Este middleware faz com que as requisições que passem pelo servidor que sejam strings no formato json
    // sejam transformadas em actual objetos json. Dessa forma, quando pegarmos o campo body de uma response,
    // ele já vai vir como um objeto do qual podemos facilmente pegar seus campos, ao invés de um texto
    app.use(bodyParser.json());

    // Este middleware faz com o que o servidor estabeleça uma conexão ao nosso banco de dados mongodb (se uma
    // não já tiver sido feita) antes de tratar uma requisição
    app.use(async (req,res,next)=>{
        if (!database.isConnected()){
            database.connect();
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
        const users = await database.findAll();
        res.status(HTTP_OK).json(users);
    })

    app.post('/users', async(req,res)=>{
        try{
            const user = await database.insert(req.body);
            res.status(HTTP_OK_CREATED).json(user);
        }catch(e){
            res.status(HTTP_CONFLICT).send();
        }
    })

    app.get('/users/:userid', async(req,res)=>{
        try{
            const user = await database.findOneById(ObjectId(req.params.userid));
            res.status(HTTP_OK).json(user);
        }catch(e){
            res.status(HTTP_NOT_FOUND).send();
        }
    })

    app.delete('/users/:userid', async(req,res)=>{
        try{
            await database.delete(ObjectId(req.params.userid));
            res.status(HTTP_OK).send();
        }catch(e){
            res.status(HTTP_NOT_FOUND).send();
        }
    })

    app.put('/users/:userid', async(req,res)=>{
        try{
            await database.update(ObjectId(req.params.userid), req.body);
            res.status(HTTP_OK).send();
        }catch(e){
            res.status(HTTP_NOT_FOUND).send();
        }
    })

    return app;
}
