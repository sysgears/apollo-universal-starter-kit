let DB_TYPE = 'sqlite';
let client = '';
let connectionDevelopment = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
