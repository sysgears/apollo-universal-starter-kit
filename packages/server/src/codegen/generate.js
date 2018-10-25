const { generate } = require('graphql-code-generator');
const { resolve } = require('path');

const watch = process.argv[2] === 'watch';

generate(
  {
    schema: resolve(__dirname, 'schema.js'),
    template: 'graphql-codegen-typescript-template',
    out: resolve(__dirname, '../../typings/graphql.ts'),
    watch,
    overwrite: true
  },
  true
)
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
