export const development = {
  client: 'sqlite3',
  connection: {
    filename: './dev-db.sqlite3'
  },
  seeds: {
    directory: './database/seeds'
  },
  migrations: {
    directory: './database/migrations'
  },
  useNullAsDefault: true
};

export const production = {
  client: 'sqlite3',
  connection: {
    filename: './prod-db.sqlite3'
  },
  seeds: {
    directory: './database/seeds'
  },
  migrations: {
    directory: './database/migrations'
  },
  useNullAsDefault: true
};

export const test = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:'
  },
  seeds: {
    directory: './database/seeds'
  },
  migrations: {
    directory: './database/migrations'
  },
  useNullAsDefault: true
};