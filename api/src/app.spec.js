const request = require('supertest')
const app = require('./app.cjs')

const {MongoClient} = require('mongodb')
const UserRepository = require('./database.js');

const HTTP_OK = 200;
const HTTP_OK_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;

require('dotenv').config();

describe("UserApi", ()=>{

    let userRepository;
    let collection;
    let client;

    //Executa uma vez, antes da execução dos testes
    beforeAll(async ()=>{
        //Abre o banco de dados, que será usado nos testes
        //Exemplo de uri: `mongodb+srv://user:password@cluster0.xgm6rrx.mongodb.net/?retryWrites=true&w=majority`
        const uri = `mongodb+srv://${process.env.TST_DB_USER}:${process.env.TST_DB_PASS}@${process.env.TST_DB_SERVERNAME}/?retryWrites=true&w=majority`
        client = new MongoClient(uri)
        await client.connect()
        collection = client.db(process.env.TST_DB_NAME).collection(process.env.TST_DB_COLLNAME)
        userRepository = new UserRepository(collection)
    })

    //Executa uma vez antes de cada teste
    beforeEach(async ()=>{
        //Limpa o banco de dados antes de cada teste, pra impedir que um teste cause efeitos colaterais em outro
        await collection.deleteMany({});
    })

    //Executa uma vez após todos os testes serem concluídos
    afterAll(async ()=>{
        //Fecha o banco de dados
        await client.close()
    })

    const dummyName = "John Doe";
    const dummyEmail = "john@doe.com";

    const dummyUser = {
        "name": dummyName,
        "email": dummyEmail
    }

    const dummyName2 = "Bob Doe";
    const dummyEmail2 = "bob@doe.com";

    const dummyUser2 = {
        "name": dummyName2,
        "email": dummyEmail2
    }

    const dummyId = "123456789012";

    describe("/users",()=>{
        describe("GET /",()=>{
            test.only("retornar lista vazia de usuários", async()=>{
                const response = await request(app).get('/users');
                expect(response.statusCode).toBe(HTTP_OK);
                expect(response.body).toStrictEqual([]);

            });
            test("retornar lista com dois usuários",async()=>{
                await userRepository.insert(dummyUser);
    
                await userRepository.insert(dummyUser2);

                const response = await request(app).get('/users');
                expect(response.statusCode).toBe(HTTP_OK);

                expect(response.body[0]).toEqual(expect.objectContaining({
                    name: dummyName,
                    email: dummyEmail
                }));
                expect(response.body[1]).toEqual(expect.objectContaining({
                    name: dummyName2,
                    email: dummyEmail2
                }));
            });
        })
        describe("POST /",()=>{
            test("adicionar um usuário no banco de dados", async()=>{
                const response = await request(app).post('/users').send(dummyUser);
                expect(response.statusCode).toBe(HTTP_OK_CREATED);

                const user = await userRepository.findOneByEmail(dummyEmail);
                expect(user).toEqual(expect.objectContaining({
                    name: dummyName,
                    email: dummyEmail
                }))
            });
            test("não permitir a adição de usuários com e-mail duplicado", async()=>{
                let response = await request(app).post('/users').send(dummyUser);
                expect(response.statusCode).toBe(HTTP_OK_CREATED);

                let dummyUser3 = dummyUser2;
                dummyUser3.email = dummyUser.email;

                response = await request(app).post('/users').send(dummyUser3);
                expect(response.statusCode).toBe(HTTP_CONFLICT);
            });
        })
    })
    
    describe("/users/:id",()=>{
        describe("GET /",()=>{
            test("retornar dados de um usuário", async()=>{
                const user = await userRepository.insert(dummyUser);

                const response = await request(app).get(`/users/${user._id}`);

                expect(response.statusCode).toBe(HTTP_OK);
                expect(response.body).toEqual(expect.objectContaining({
                    name: dummyName,
                    email: dummyEmail
                }));
            });
            test("retornar status code 404 para um usuário não-existente", async()=>{
                const response = await request(app).get(`/users/${dummyId}`);
                expect(response.statusCode).toBe(HTTP_NOT_FOUND);
            });
        })
        describe("PUT /",()=>{
            test("atualizar dados de um usuário", async()=>{
                const user = await userRepository.insert(dummyUser);

                const newInfo = {
                    name: dummyName2,
                    email: dummyEmail2
                }

                const response = await request(app).put(`/users/${user._id}`).send(newInfo);
                expect(response.statusCode).toBe(HTTP_OK);
                
                const user2 = await userRepository.findOneById(user._id);

                expect(user2.name).toBe(dummyName2);
                expect(user2.email).toBe(dummyEmail2);
            });
            test("retornar status code 404 para um usuário não-existente", async()=>{
                const newInfo = {
                    name: dummyName2,
                    email: dummyEmail2
                }

                const response = await request(app).put(`/users/${dummyId}`).send(newInfo);
                expect(response.statusCode).toBe(HTTP_NOT_FOUND);
            });
        })
        describe("DELETE /",()=>{
            test("remover um usuário", async()=>{
                const user = await userRepository.insert(dummyUser);

                let response = await request(app).delete(`/users/${user._id}`);
                expect(response.statusCode).toBe(HTTP_OK);

                response = await request(app).get('/users');
                expect(response.body).toStrictEqual([]);

            });
            test("retornar status code 404 para um usuário não-existente", async()=>{
                const response = await request(app).delete(`/users/${dummyId}`);
                expect(response.statusCode).toBe(HTTP_NOT_FOUND);
            });
        })
    })
})