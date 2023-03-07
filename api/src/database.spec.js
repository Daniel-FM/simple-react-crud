const {MongoClient} = require('mongodb')
const UserRepository = require('./database.js')

require('dotenv').config();

describe.skip('UserRepository',()=>{

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
        await collection.deleteMany({})
    })

    //Executa uma vez após todos os testes serem concluídos
    afterAll(async ()=>{
        //Fecha o banco de dados
        await client.close()
    })

    let dummyName = "John Doe";
    let dummyEmail = "john@doe.com";

    let dummyName2 = "Bob Doe";
    let dummyEmail2 = "bob@doe.com";

    const dummyId = "12345";

    describe('findOneByEmail',()=>{
        test('retornar user john@doe.com',async ()=>{
            const result = await collection.insertOne({
                name: dummyName,
                email: dummyEmail
            })
            const user = await userRepository.findOneByEmail(dummyEmail)

            expect(user).toStrictEqual({
                _id: result.insertedId,
                name: dummyName,
                email: dummyEmail
            })
        })
        test('lançar exceção para user não-existente', async ()=>{
            await expect(userRepository.findOneByEmail(dummyEmail)).rejects.toThrow()
        })
    })
    describe('insert',()=>{
        test('inserir novo user', async()=>{
            const user = await userRepository.insert({
                name: dummyName,
                email: dummyEmail
            })

            const result = await userRepository.findOneByEmail(dummyEmail);

            expect(result).toStrictEqual(user);
        })
    })

    describe('update',()=>{
        test('atualizar user (2 campos)', async()=>{
            let user = await userRepository.insert({
                name: dummyName,
                email: dummyEmail
            })

            let user2 = {
                _id: user._id,
                name: dummyName2,
                email: dummyEmail2
            }

            const result = await userRepository.update(user._id, user2);
            user = await userRepository.findOneByEmail(dummyEmail2);

            expect(user).toStrictEqual(user2);

        })

        test('atualizar user (1 campo)', async()=>{
            let user = await userRepository.insert({
                name: dummyName,
                email: dummyEmail
            })

            let newInfo = {
                email: dummyEmail2
            }

            const result = await userRepository.update(user._id, newInfo);
            user = await userRepository.findOneById(user._id);

            expect(user.name).toBe(dummyName);
        })
        
        test('lançar exceção para user não-existente', async()=>{

            let user = {
                name: dummyName,
                email: dummyEmail
            }

            await expect(userRepository.update(dummyId, user)).rejects.toThrow();
        })
    })

    describe('delete',()=>{
        test('remover user', async()=>{
            const user = await userRepository.insert({
                name: dummyName,
                email: dummyEmail
            })

            await userRepository.delete(user._id);

            await expect(userRepository.findOneByEmail(dummyEmail)).rejects.toThrow()
        })

        test('lançar exceção para user não-existente', async()=>{
            await expect(userRepository.delete(dummyId)).rejects.toThrow()
        })
    })
    describe('findall',()=>{
        test('retornar lista vazia',async()=>{
            const list = await userRepository.findAll();

            expect(list).toStrictEqual([]);
        })

        test('retornar lista com 2 users', async()=>{
            await userRepository.insert({
                name: dummyName,
                email: dummyEmail
            })

            await userRepository.insert({
                name: dummyName2,
                email: dummyEmail2
            })

            const list = await userRepository.findAll();

            expect(list.length).toBe(2);
        })
    })
})