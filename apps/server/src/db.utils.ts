import { JsonDB, Config } from 'node-json-db';

let db: JsonDB;

function initDb() {
  const dbName = process.env['NODE_ENV'] === 'test' ? 'test-db' : 'db';
  return new JsonDB(new Config(`${dbName}.jsondb.json`, true, false, '/'));
}

export default function getInstance() {
  if (!db) {
    db = initDb();
  }
  return db;
}
