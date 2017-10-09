import { DB_TYPE, DB_USER, DB_PASSWORD, DB_DATABASE } from './secrets';

let client = '';
let connectionDevelopment = {
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  multipleStatements: true,
  charset: 'utf8'
};
let connectionProduction = connectionDevelopment;
let connectionTest = {
  filename: ':memory:'
};

if (DB_TYPE === 'mysql') {
  // mysql
  client = 'mysql2';
} else if (DB_TYPE === 'pg') {
  // postgres
  client = 'pg';
} else {
  // sqlite
  client = 'sqlite3';
  connectionDevelopment = {
    filename: './dev-db.sqlite3'
  };
  connectionProduction = {
    filename: './prod-db.sqlite3'
  };
}

export default {
  dbType: DB_TYPE,
  client: client,
  connection: {
    development: connectionDevelopment,
    production: connectionProduction,
    test: connectionTest
  }
};
