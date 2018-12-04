import { PLATFORM } from '@module/core-common';
export { default as FieldAdapter } from './FieldAdapter';
export { default as clientOnly } from './clientOnly';

export default (__CLIENT__ && PLATFORM === 'web' ? require('./app').default : {});
