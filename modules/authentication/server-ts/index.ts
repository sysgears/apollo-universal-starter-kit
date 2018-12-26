import ServerModule from '@module/module-server-ts';

import access from './access';

const createContextFunc = (args: any) => {
  return {
    identity: 'test'
  };
};

export default new ServerModule({ createContextFunc: [createContextFunc] }, access);
export { access };
