const isBabel = !(class {}.toString().indexOf('class ') === 0);
if (!isBabel) {
  require('babel-register');
}

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev-db.sqlite3'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: './prod-db.sqlite3'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true
  },


};
