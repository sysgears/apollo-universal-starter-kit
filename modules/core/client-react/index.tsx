import { PLATFORM } from '@gqlapp/core-common';
export { default as clientOnly } from './clientOnly';
export * from './util';
export * from './crud';

export default __CLIENT__ && PLATFORM === 'web' ? require('./app').default : {};
