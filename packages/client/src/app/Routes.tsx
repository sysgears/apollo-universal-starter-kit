import modules from '../modules/index.web';

if (!modules.router) {
  throw new Error('At least one router must be defined in modules');
}

const Routes = modules.router;

export default Routes;
