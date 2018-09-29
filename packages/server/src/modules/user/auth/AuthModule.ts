import { unfoldTo } from 'fractal-objects';

class AuthModule {
  // GraphQL API
  public schema?: any[];
  public createResolversFunc?: any[];
  // Middleware
  public middleware?: any[];

  // eslint-disable-next-line
  constructor(...modules: AuthModule[]) {
    unfoldTo(this, modules);
  }
}

export default AuthModule;
