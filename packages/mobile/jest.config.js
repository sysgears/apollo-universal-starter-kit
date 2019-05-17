module.exports = {
  verbose: true,
  preset: 'jest-expo',
  testPathIgnorePatterns: ['node_modules', '.history'],
  testMatch: ['<rootDir>/modules/**/client-react/**/*.test.native.[jt]s?(x)'],
  rootDir: '../..',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules/react-native/Libraries/react-native/',
    '<rootDir>/node_modules/react-native/Libraries/vendor/core/whatwg-fetch.js',
    '<rootDir>/node_modules/react-native/jest/',
    '<rootDir>/node_modules/haul/',
    '<rootDir>/packages/mobile/.expo/',
    '<rootDir>/packages/mobile/node_modules/'
  ],
  globals: {
    __CLIENT__: true,
    __SERVER__: false,
    __TEST__: true
  }
};
