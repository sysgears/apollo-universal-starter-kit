import ServerModule from '@module/module-server-ts';
import access from './access';
import github from './social/github';

export default new ServerModule(access, github);
export { access };
