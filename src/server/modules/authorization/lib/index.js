import * as AuthzPermissions from './knex/permissions';
import * as AuthzUser from './knex/user';
import * as AuthzGroup from './knex/group';
import * as AuthzOrg from './knex/org';
// import * as AuthzSvcAcct from './knex/sa';

const Authz = {
  ...AuthzPermissions,
  ...AuthzUser,
  ...AuthzGroup,
  ...AuthzOrg
};

export default Authz;
