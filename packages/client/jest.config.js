module.exports = {
  testMatch: ['<rootDir>/modules/**/client-react/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/packages/client/src/__tests__/entry.ts'],
  moduleFileExtensions: ['js', 'web.js', 'json', 'jsx', 'web.jsx', 'ts', 'tsx', 'node'],
  rootDir: '../..',
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '.*': 'babel-jest'
  },
  modulePathIgnorePatterns: ['<rootDir>/modules/chat'],
  moduleNameMapper: {
    backend_reload: 'jest-transform-stub',
    '^.+\\.(css|less|scss)$': 'babel-jest'
  },
  globals: {
    __CLIENT__: true,
    __SERVER__: false,
    __DEV__: true,
    __TEST__: true,
    __SSR__: false,
    __API_URL__: '/graphql'
  }
};
