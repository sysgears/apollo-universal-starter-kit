import settings from '../../../settings';

const envSettings = {
  [process.env.NODE_ENV || 'development']: {
    ...settings.db,
    seeds: {
      directory: '/module-seeds' // fake dir created virtually by tools/knex
    },
    migrations: {
      directory: '/module-migrations' // fake dir created virtually by tools/knex
    },
    useNullAsDefault: true
  }
};

export const development = envSettings.development;
export const production = envSettings.production;
export const test = envSettings.test;
