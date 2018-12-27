import ServerModule from '@module/module-server-ts';
import { scopes } from '@module/user-server-ts';
import access from './access';

interface ParamsType {
  req: object;
  res: object;
  connectionParams: object;
  webSocket: object;
  context: any;
}

const createContextFunc = ({ context: { user } }: ParamsType) => {
  return {
    user,
    auth: {
      isAuthenticated: !!user,
      scope: user ? scopes[user.role] : null
    }
  };
};

export default new ServerModule({ createContextFunc: [createContextFunc] }, access);
export { access };
