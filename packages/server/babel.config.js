module.exports = api => {
  const isBabelRegister = api.caller(caller => caller.name === '@babel/register');
  const isTest = api.env('test');
  api.cache(true);
  if (isTest || isBabelRegister) {
    return {
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-react',
        ['@babel/preset-env', { targets: { node: true }, modules: 'commonjs' }]
      ],
      plugins: [['@babel/plugin-proposal-class-properties', { loose: true }], '@gqlapp/graphql-tag']
    };
  } else {
    return {
      compact: false,
      presets: ['@babel/preset-react', ['@babel/preset-env', { targets: { node: true }, modules: false }]],
      plugins: [
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-transform-regenerator',
        '@babel/plugin-transform-runtime',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        ['styled-components', { ssr: true }],
        ['import', { libraryName: 'antd-mobile' }]
      ],
      env: {
        production: {
          compact: true
        }
      }
    };
  }
};
