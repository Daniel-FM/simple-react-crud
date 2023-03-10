const UserRepository = require('./user-repository.js')

require('dotenv').config();

describe('UserRepository',()=>{

    let userRepository;

    //Executa uma vez, antes da execução dos testes
    beforeAll(async ()=>{
        //Conecta no banco de dados que será usado nos testes, passando os parâmetros pegos do arquivo .env do projeto
        userRepository = new UserRepository();

        const connectionParams = {
            url: process.env.TST_DB_URL,
            dbName: process.env.TST_DB_NAME
        }

        await userRepository.connect(connectionParams);
    })

    //Executa uma vez antes de cada teste
    beforeEach(async ()=>{
        //Limpa o banco de dados antes de cada teste, pra impedir que um teste cause efeitos colaterais em outro
        await userRepository.deleteAll();
    })

    //Executa uma vez após todos os testes serem concluídos
    afterAll(async ()=>{
        //Fecha o banco de dados
        await userRepository.disconnect();
    })

    const dummyName = "John Doe";
    const dummyEmail = "john@doe.com";
    const dummyUser = {
        name: dummyName,
        email: dummyEmail
    }

    const dummyName2 = "Bob Doe";
    const dummyEmail2 = "bob@doe.com";
    const dummyUser2 = {
        name: dummyName2,
        email: dummyEmail2
    }

    const dummyId = "12345";

    describe('findOneByEmail',()=>{
        test('retornar user john@doe.com',async ()=>{
            const result = await userRepository.insertOne(dummyUser);

            const user = await userRepository.findOneByEmail(dummyEmail);
            
            expect(user).toStrictEqual({
                _id: result._id,
                name: dummyName,
                email: dummyEmail
            });
        })
        test('lançar exceção para user não-existente', async ()=>{
            await expect(userRepository.findOneByEmail(dummyEmail)).rejects.toThrow()
        })
    })
    describe('insert',()=>{
        test('adicionar novo user', async()=>{
            const user = await userRepository.insertOne(dummyUser)

            const result = await userRepository.findOneByEmail(dummyEmail);

            expect(result).toStrictEqual(user);
        })

        test('não permitir a adição de usuários com e-mail duplicado', async()=>{
            const user = await userRepository.insertOne(dummyUser)

            expect(user).toEqual(expect.objectContaining(dummyUser));

            const duplicateEmailUser = {
                name: dummyName2,
                email: dummyEmail
            };

            expect(userRepository.insertOne(duplicateEmailUser)).rejects.toThrow();

        })
    })

    describe('update',()=>{
        test('atualizar user (2 campos)', async()=>{
            let user = await userRepository.insertOne(dummyUser)

            const insertedUserId = user._id;

            await userRepository.updateOne(insertedUserId, dummyUser2);
            user = await userRepository.findOneByEmail(dummyEmail2);

            expect(user).toStrictEqual({
                _id: insertedUserId,
                name: dummyName2,
                email: dummyEmail2
            });

        })

        test('atualizar user (1 campo)', async()=>{
            let user = await userRepository.insertOne(dummyUser)

            let newInfo = {
                email: dummyEmail2
            }

            await userRepository.updateOne(user._id, newInfo);
            user = await userRepository.findOneById(user._id);

            expect(user.name).toBe(dummyName);
        })
        
        test('lançar exceção para user não-existente', async()=>{
            let dummyInfo = {
                name: dummyName,
            };

            await expect(userRepository.updateOne(dummyId, dummyInfo)).rejects.toThrow();
        })
    })

    describe('delete',()=>{
        test('remover user', async()=>{
            const user = await userRepository.insertOne(dummyUser);

            await userRepository.deleteOne(user._id);

            await expect(userRepository.findOneByEmail(dummyEmail)).rejects.toThrow()
        })

        test('lançar exceção para user não-existente', async()=>{
            await expect(userRepository.deleteOne(dummyId)).rejects.toThrow()
        })
    })
    describe('findall',()=>{
        test('retornar lista vazia',async()=>{
            const list = await userRepository.findAll();
            expect(list).toStrictEqual([]);
        })

        test('retornar lista com 2 users', async()=>{
            await userRepository.insertOne(dummyUser)
            await userRepository.insertOne(dummyUser2)

            const list = await userRepository.findAll();
            expect(list.length).toBe(2);
        })
    })
})