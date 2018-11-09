import settings from '../../settings';

const envSettings = {
  [process.env.NODE_ENV || 'development']: {
    ...settings.db,
    seeds: {
      directory: './src/database/seeds'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true
  }
};

export const development = envSettings.development;
export const production = envSettings.production;
export const test = envSettings.test;
