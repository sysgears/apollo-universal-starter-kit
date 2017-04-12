export const development = {
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
};

export const production = {
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
};
