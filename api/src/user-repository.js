const {MongoClient} = require('mongodb')

const ERROR_MSG_NO_PARAMS = "Não foram passados os parâmetros de conexão ao banco de dados! " + 
"Verifique se estas informações estão presentes no arquivo .env na raíz do projeto.";

class UserRepository{
    constructor(connectionParams){
        this.url = connectionParams.url;
        this.dbName = connectionParams.dbName;

        if (this.url === undefined || this.dbName === undefined){
            throw new Error(ERROR_MSG_NO_PARAMS);
        }
    }

    async connect(){
        this.client = new MongoClient(this.url);
        await this.client.connect();
        this.collection = this.client.db(this.dbName).collection("users");
    }

    async disconnect(){
        await this.client.close();
    }

    async findOneById(_id){
        const user = await this.collection.findOne({_id});

        if (user === null){
            throw new Error(`User with id ${_id} does not exist!`);
        }

        return user;
    }

    async findOneByEmail(email){
        const user = await this.collection.findOne({email});

        if (user === null){
            throw new Error(`User with email ${email} does not exist`);
        }

        return user;
    }

    async insertOne(newUser){
        const dummyUser = await this.collection.findOne({"email" : newUser.email});

        if (dummyUser !== null){
            throw new Error(`User with email ${email} already exists`);
        }

        await this.collection.insertOne(newUser);
        return newUser;
    }

    async deleteOne(_id){
        const result = await this.collection.deleteOne({_id});
        if (result.deletedCount == 0){
            throw new Error(`User not found!`);
        }
    }

    async deleteAll(){
        await this.collection.deleteMany({});
    }

    async updateOne(id, newUserInfo){

        let changedName = false, changedEmail = false;

        if (newUserInfo.name !== undefined){
            const result = await this.collection.updateOne(
                {_id: id}, 
                {$set: {name: newUserInfo.name}}
            );
            if (result.matchedCount !== 0){
                changedName = true;
            }
        }

        if (newUserInfo.email !== undefined){
            const result = await this.collection.updateOne(
                {_id: id}, 
                {$set: {email: newUserInfo.email}}
            );
            if (result.matchedCount !== 0){
                changedEmail = true;
            }
        }

        if (!changedName && !changedEmail){
            throw new Error(`User not found!`);
        }
    }

    async findAll(){
        const cursor = await this.collection.find();

        let list = [];
        let i = 0;
        while (await cursor.hasNext()){
            let currItem = await cursor.next()
            list[i++] = currItem
        }
        return list;
    }
}

module.exports = UserRepository