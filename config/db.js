const db = {
  client: process.env.DB_CLIENT || 'sqlite3',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    socketPath: process.env.DB_SOCKET_PATH,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: process.env.DB_SSL,
    multipleStatements: true,
    charset: 'utf8'
  }
};

if (process.env.NODE_ENV === 'test') {
  db.client = 'sqlite3';
}

if (db.client === 'sqlite3') {
  db.connection = {
    development: {
      filename: './dev-db.sqlite3'
    },
    production: {
      filename: './prod-db.sqlite3'
    },
    test: {
      filename: ':memory:'
    }
  }[process.env.NODE_ENV || 'development'];
  db.pool = {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  };
}

export default db;
