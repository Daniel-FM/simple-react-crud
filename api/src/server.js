const getApp = require('./app');
const UserRepository = require('./user-repository');
const port = 4000

// Para poder pegar variáveis do arquivo .env
require('dotenv').config();

const connectionParams = {
  url: process.env.DB_URL,
  dbName: process.env.DB_NAME
}

const app = getApp(new UserRepository(connectionParams));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});