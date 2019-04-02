import ServerModule, { ServerModuleShape } from '@gqlapp/module-server-ts';

enum RestMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}

export interface ServerRestModuleShape extends ServerModuleShape {
  restApi?: Array<{ route: string; method: RestMethod; controller: (req: any, res: any) => void }>;
}

interface ServerRestModule extends ServerModuleShape {}

class ServerRestModule extends ServerModule {
  public modules?: ServerRestModule;

  constructor(...modules: ServerRestModuleShape[]) {
    super(...modules);
  }
}

export default ServerRestModule;
