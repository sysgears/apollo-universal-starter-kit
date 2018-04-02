import settings from '../../settings';

export const development = {
  client: settings.db.client,
  connection: settings.db.connection.development,
  pool: settings.db.pool,
  seeds: {
    directory: './src/database/seeds'
  },
  migrations: {
    directory: './src/database/migrations'
  },
  useNullAsDefault: true
};

export const production = {
  client: settings.db.client,
  connection: settings.db.connection.production,
  pool: settings.db.pool,
  seeds: {
    directory: './src/database/seeds'
  },
  migrations: {
    directory: './src/database/migrations'
  },
  useNullAsDefault: true
};

export const test = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:'
  },
  seeds: {
    directory: './src/database/seeds'
  },
  migrations: {
    directory: './src/database/migrations'
  },
  useNullAsDefault: true
};
