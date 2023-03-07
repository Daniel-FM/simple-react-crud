const getApp = require('./app');
const UserRepository = require('./user-repository');
const port = 4000

const app = getApp(new UserRepository());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});