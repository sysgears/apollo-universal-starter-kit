import modules from '../modules';

if (!modules.router) {
  throw new Error('At least one router must be defined in modules');
}

export default modules.router;
