let DB_TYPE = process.env.DB_TYPE || 'sqlite';
let client = '';
let connectionDevelopment = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  socketPath: process.env.DB_SOCKET_PATH,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
  charset: 'utf8'
};
let connectionProduction = connectionDevelopment;
let pool = {};
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
  pool = {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  };
}

export default {
  dbType: DB_TYPE,
  client: client,
  connection: {
    development: connectionDevelopment,
    production: connectionProduction
  },
  pool: pool
};
