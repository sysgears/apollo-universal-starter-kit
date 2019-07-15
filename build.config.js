const config = {
  __SSR__: (process.env.SSR || 'true') === 'true'
};

module.exports = config;
