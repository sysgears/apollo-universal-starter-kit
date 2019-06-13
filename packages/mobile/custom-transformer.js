/* eslint-disable import/no-extraneous-dependencies */
const gqlLoader = require('graphql-tag/loader');
const metroTransformer = require('metro-react-native-babel-transformer');
const jestTransformI18next = require('../../jest-transform-i18next');

const gqlTransform = gqlLoader.bind({
  cacheable: () => null
});

function transform({ src, filename, options }) {
  let result = src;
  if (/\.(gql|graphql)$/.test(filename)) {
    result = gqlTransform(result);
  } else if (/locales[\\/]index\.([jt]s)$/.test(filename)) {
    result = jestTransformI18next.process(null, filename).code;
  }

  const babelCompileResult = metroTransformer.transform({
    src: result,
    filename,
    options
  });

  return babelCompileResult;
}

module.exports.transform = transform;
