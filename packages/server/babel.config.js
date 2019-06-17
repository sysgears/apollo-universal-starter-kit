module.exports = api => {
  const isBabelRegister = api.caller(caller => caller && caller.name === '@babel/register');
  const isTest = api.env('test');
  api.cache(true);
  if (isTest || isBabelRegister) {
    return {
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-react',
        ['@babel/preset-env', { targets: { node: true }, modules: 'commonjs' }]
      ],
      plugins: [
        'babel-plugin-dynamic-import-node',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        'babel-plugin-import-graphql'
      ]
    };
  } else {
    return {
      compact: false,
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-react',
        ['@babel/preset-env', { targets: { node: true }, modules: false }]
      ],
      plugins: [
        'babel-plugin-dynamic-import-node',
        '@loadable/babel-plugin',
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-transform-runtime',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        ['styled-components', { ssr: true }]
      ],
      env: {
        production: {
          compact: true
        }
      }
    };
  }
};
