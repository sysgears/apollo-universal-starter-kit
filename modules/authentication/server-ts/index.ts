import ServerModule from '@gqlapp/module-server-ts';
import AuthModule from './social/AuthModule';
import access from './access';
import social from './social';
import * as TestHelper from './test-helpers';

export default new ServerModule(access, social);
export { access, AuthModule, TestHelper };
