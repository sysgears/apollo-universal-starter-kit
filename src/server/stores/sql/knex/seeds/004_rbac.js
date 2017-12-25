/*eslint-disable no-unused-vars*/
import _ from 'lodash';
import uuidv4 from 'uuid';

import truncateTables from '../helpers/tables';
import settings from '../../../../../../settings';

import orgs from '../../../seeds/data/entities/orgs';
import groups from '../../../seeds/data/entities/groups';
import users from '../../../seeds/data/entities/users';
import serviceaccounts from '../../../seeds/data/entities/sa';

let entities = settings.entities;
let auth = settings.auth;
let authz = auth.authorization;

export async function seed(knex, Promise) {
  // short-circuit
  if (authz.enabled !== true || authz.provider !== 'embedded') {
    return Promise.all([]);
  }

  console.log('Seeding Auth');
  await wipe(knex, Promise);

  await createPermissions(knex, authz.permissions);

  await createAllRoles(knex);
}

async function wipe(knex, Promise) {
  console.log('  - cleaning tables');
  if (entities.orgs.enabled && authz.orgRoles) {
    console.log('    - org tables');
    await truncateTables(knex, Promise, ['org_roles', 'org_role_permission_bindings', 'org_role_user_bindings']);
    if (entities.serviceaccounts.enabled) {
      await truncateTables(knex, Promise, ['org_role_serviceaccount_bindings']);
    }
  }

  if (entities.groups.enabled && authz.groupRoles) {
    console.log('    - group tables');
    await truncateTables(knex, Promise, ['group_roles', 'group_role_permission_bindings', 'group_role_user_bindings']);
    if (entities.serviceaccounts.enabled) {
      await truncateTables(knex, Promise, ['group_role_serviceaccount_bindings']);
    }
  }

  if (entities.users.enabled && authz.userRoles) {
    console.log('    - user tables');
    await truncateTables(knex, Promise, ['user_roles', 'user_role_permission_bindings', 'user_role_user_bindings']);
  }

  if (entities.serviceaccounts.enabled && authz.serviceaccountRoles) {
    console.log('    - svcacct tables');
    await truncateTables(knex, Promise, [
      'serviceaccount_roles',
      'serviceaccount_role_permission_bindings',
      'serviceaccount_role_serviceaccount_bindings'
    ]);
  }

  await truncateTables(knex, Promise, ['permissions']);
  console.log('  - tables cleaned');
}

async function createPermissions(knex, permissions) {
  console.log('creating permissions');
  for (let P of permissions) {
    let rs = P.resource;
    console.log('  -', rs);

    let vs = P.verbs ? P.verbs : authz.verbs;

    // Seed base resource first
    for (let rel of P.relations) {
      console.log('   ', `${rs}/${rel}/${vs}`);
      for (let v of vs) {
        let name = `${rs}/${rel}/${v}`;
        await knex('permissions').insert({
          id: uuidv4(),
          resource: rs,
          relation: rel,
          verb: v,
          name: name
        });
      }
    }

    if (!P.subresources) {
      continue;
    }
    // Seed sub-resources
    for (let sub of P.subresources) {
      for (let rel of P.relations) {
        console.log('   ', `${rs}:${sub}/${rel}/${vs}`);
        for (let v of vs) {
          let name = `${rs}:${sub}/${rel}/${v}`;
          await knex('permissions').insert({
            id: uuidv4(),
            resource: `${rs}:${sub}`,
            relation: rel,
            verb: v,
            name: name
          });
        }
      }
    }
  } // end loop over input permissions
}

async function createAllRoles(knex) {
  console.log('Creating all roles');

  // start with users, cause if we made it this far, we have users
  await createUserRoles(knex, authz.userRoles);

  // then check if we are using groups
  if (entities.orgs.enabled && authz.orgScopes) {
    console.log('Creating roles for Orgs');
    // TODO Org related role stuff
    for (let org of orgs) {
      if (org.name === 'root') {
        console.log('  root:');
        if (org.users) {
          await createUserRoleUserBindings(knex, org.users, org.profile.domain);
        }

        if (entities.serviceaccounts.enabled && org.serviceaccounts) {
          // TODO
          // await createOrgRoleServiceAccountBindings(knex, org.serviceaccounts, org.profile.domain)
        }

        if (org.groups) {
          for (let group of org.groups) {
            console.log('  - group:', group.name);
            await createGroupRoles(knex, org.name, group, group.customRoles || authz.groupRoles);
          }
        }
        continue;
      }

      console.log('  - org:', org.name);
      await createOrgRoles(knex, org, org.roles || authz.orgRoles);
      await createOrgRoleUserBindings(knex, org);
      if (entities.serviceaccounts.enabled && org.serviceaccounts) {
        // TODO
        // await createOrgRoleServiceAccountBindings(knex, org.serviceaccounts, org.profile.domain)
      }

      for (let group of org.groups) {
        console.log('  - group:', group.name);
        await createGroupRoles(knex, org.name, group, group.customRoles || authz.groupRoles);
      }
      await createOrgGroupRoleUserBindings(knex, org);
      if (entities.serviceaccounts.enabled && org.serviceaccounts) {
        // TODO
        // await createOrgGroupRoleServiceAccountBindings(knex, org)
      }
    }

    // return here because we started from multi-orgs
    return;
  }

  // otherwise, it's a little easier to build things

  if (entities.groups.enabled && authz.groupScopes) {
    // TODO
  }

  if (entities.users.enabled && authz.userScopes) {
    // TODO
  }

  if (entities.serviceaccounts.enabled && authz.serviceaccountsScopes) {
    // TODO
  }
}

async function createOrgRoles(knex, org, roles) {
  // basic roles are an enumerations
  const oid = await knex
    .select('id')
    .from('orgs')
    .where('name', '=', org.name)
    .first();

  for (let role of roles) {
    console.log('    - ', role);
    await knex('org_roles').insert({
      id: uuidv4(),
      org_id: oid.id,
      name: role,
      display_name: role,
      description: role + ' role for org: ' + org.name
    });
  }
}

async function createOrgRoleUserBindings(knex, org) {
  const oid = await knex
    .select('id')
    .from('orgs')
    .where('name', '=', org.name)
    .first();

  for (let user of org.users) {
    const uid = await knex
      .select('id')
      .from('users')
      .where('email', '=', user.name + '@' + org.profile.domain)
      .first();

    for (let role of user.roles) {
      console.log('    ~> ', user.name, role);
      const rid = await knex
        .select('id')
        .from('org_roles')
        .where({
          name: role,
          org_id: oid.id
        })
        .first();

      await knex('org_role_user_bindings').insert({
        role_id: rid.id,
        user_id: uid.id
      });
    }
  }
}

async function createOrgGroupRoleUserBindings(knex, org) {
  for (let group of org.groups) {
    const gid = await knex
      .select('id')
      .from('groups')
      .where('name', '=', org.name + ':' + group.name)
      .first();

    for (let role of group.roles) {
      const rid = await knex
        .select('id')
        .from('group_roles')
        .where({
          name: role.name,
          group_id: gid.id
        })
        .first();

      console.log('   ', org.name, group.name, gid);

      for (let user of role.users) {
        console.log('    ~> ', user, role.name, rid);
        const uid = await knex
          .select('id')
          .from('users')
          .where('email', '=', user + '@' + org.profile.domain)
          .first();

        await knex('group_role_user_bindings').insert({
          role_id: rid.id,
          user_id: uid.id
        });
      } // end of users loop
    } // end of roles loop
  } // end of groups loop
}

async function createOrgRoleServiceAccountBindings(knex, accts, domain) {
  for (let acct of accts) {
    const aid = await knex
      .select('id')
      .from('serviceaccounts')
      .where('email', '=', acct.name + '@' + domain)
      .first();

    for (let role of acct.roles) {
      console.log('    = ', acct.name, role);
      const rid = await knex
        .select('id')
        .from('org_roles')
        .where('name', '=', role)
        .first();

      await knex('org_role_user_bindings').insert({
        role_id: rid.id,
        serviceaccount_id: aid.id
      });
    }
  }
}

async function createGroupRoles(knex, groupPrefix, group, roles) {
  // basic roles are an enumerations
  const gid = await knex
    .select('id')
    .from('groups')
    .where('name', '=', groupPrefix + ':' + group.name)
    .first();

  for (let role of roles) {
    console.log('    - ', role);
    await knex('group_roles').insert({
      id: uuidv4(),
      group_id: gid.id,
      name: role,
      display_name: role,
      description: role + ' role for group: ' + group.name
    });
  }
}

async function createUserRoles(knex, roles) {
  console.log('Creating roles for Users', roles);
  for (let role of roles) {
    console.log('  - ', role);
    await knex('user_roles').insert({
      id: uuidv4(),
      name: role,
      display_name: role,
      description: role + ' role for all resources and applications'
    });

    // create

    // lookup permissions

    // create bindings
    // (call next function)
  }
}

async function createUserRolePermissionBindings(knex, permissions) {
  console.log('Creating roles for Users');
  for (let P of permissions) {
    console.log('  - ', P);
    /*
    await knex('user_role_permission_bindings').insert({
      name: role,
      display_name: role,
      description: role + " role for all resources and applications"
    });
    */
  }
}

async function createUserRoleUserBindings(knex, users, domain) {
  console.log('Creating user_roles bindings for Users');
  for (let user of users) {
    const uid = await knex
      .select('id')
      .from('users')
      .where('email', '=', user.name + '@' + domain)
      .first();

    for (let role of user.roles) {
      console.log('    ~> ', user.name, role);
      const rid = await knex
        .select('id')
        .from('user_roles')
        .where('name', '=', role)
        .first();

      await knex('user_role_user_bindings').insert({
        role_id: rid.id,
        user_id: uid.id
      });
    }
  }
}

async function createServiceAccountRoles(knex) {
  /*
  console.log('Creating roles for SvcAcct', acct);
  // basic roles are an enumerations
  const [sid] = await knex
    .select('id')
    .from('serviceaccounts')
    .where('email', '=', acct.short + '@' + domain).first;

  await knex('serviceaccount_roles').insert({
    serviceaccount_id: sid,
    role: acct.role
  });
  */
}
