import getApp from './app.cjs';
import database from './database.js';

const app = getApp(database);
const port = 4000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});