const {MongoClient} = require('mongodb')

class UserRepository{
    constructor(){

    }

    async connect(){
        const user = process.env.DB_USER;
        const pass = process.env.DB_PASS;
        const serverName = process.env.DB_SERVERNAME;
        const dbName = process.env.DB_NAME;
        const collName = process.env.DB_COLLNAME;
    
        const uri = `mongodb+srv://${user}:${pass}@${serverName}/?retryWrites=true&w=majority`;
        this.client = new MongoClient(uri);
        await this.client.connect();
        this.collection = this.client.db(dbName).collection(collName);
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

    async insert(newUser){
        const dummyUser = await this.collection.findOne({"email" : newUser.email});

        if (dummyUser !== null){
            throw new Error(`User with email ${email} already exists`);
        }

        await this.collection.insertOne(newUser);
        return newUser;
    }

    async delete(_id){
        const result = await this.collection.deleteOne({_id});
        if (result.deletedCount == 0){
            throw new Error(`User not found!`);
        }
    }

    async deleteAll(){
        await this.collection.deleteMany({});
    }

    async update(id, newUserInfo){

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