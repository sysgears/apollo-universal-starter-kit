module.exports = {
  testMatch: ['**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/packages/server/src/__tests__/jestSetup.ts'],
  rootDir: '../..',
  resolver: './packages/server/jest.resolver',
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '.*': 'babel-jest'
  },
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest'
  },
  globals: {
    __CLIENT__: false,
    __SERVER__: true,
    __DEV__: true,
    __TEST__: true,
    __SSR__: false,
    __FRONTEND_BUILD_DIR__: __dirname + '/../client/build',
    __DLL_BUILD_DIR__: __dirname + '/../../.cache/dll',
    __API_URL__: '/graphql'
  },
  testEnvironment: 'node'
};
