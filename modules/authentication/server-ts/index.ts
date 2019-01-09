import ServerModule from '@module/module-server-ts';
import access from './access';
import github from './social/github';
import google from './social/google';
import facebook from './social/facebook';
import linkedin from './social/linkedIn';

export default new ServerModule(access, github, google, facebook, linkedin);
export { access };
