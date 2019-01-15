import ServerModule from '@module/module-server-ts';
import access from './access';
import social from './social';

export default new ServerModule(access, social);
export { access };
