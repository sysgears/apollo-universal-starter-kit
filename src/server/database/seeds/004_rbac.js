/*eslint-disable no-unused-vars*/
import _ from 'lodash';

import truncateTables from '../../../common/db';
import settings from '../../../../settings';

// import roles from './data/rbac/roles';

import orgs from './data/entities/orgs';
import groups from './data/entities/groups';
import users from './data/entities/users';
import serviceaccounts from './data/entities/sa';

let entities = settings.entities;
let auth = settings.auth;
let authz = auth.authorization;

export async function seed(knex, Promise) {
  if (authz.provider === 'embedded') {
    if (entities.orgs.enabled && authz.orgScopes) {
      await truncateTables(knex, Promise, ['org_roles']);
      // TODO Org related role stuff
    }

    if (entities.groups.enabled && authz.groupScopes) {
      await truncateTables(knex, Promise, ['group_roles']);
      for (let group of groups) {
        // TODO createGroupRoles(knex, group);
      }
    }

    if (entities.users.enabled && authz.userScopes) {
      await truncateTables(knex, Promise, ['user_roles']);
      for (let user of users) {
        if (user.role) {
          createUserRoles(knex, user, 'example.com');
        }
      }
    }

    if (entities.serviceaccounts.enabled && authz.serviceaccountsScopes) {
      await truncateTables(knex, Promise, ['serviceaccount_roles']);
      for (let acct of serviceaccounts) {
        createServiceAccountRoles(knex, acct, 'example.com');
      }
    }
  }
}

async function createGroupRoles(knex, group) {
  // basic roles are an enumerations
  const [gid] = await knex
    .select('id')
    .from('groups')
    .where('name', '=', group.name);

  await knex('group_roles').insert({
    group_id: gid,
    role: group.role
  });
}

async function createUserRoles(knex, user, domain) {
  // basic roles are an enumerations
  const [uid] = await knex
    .select('id')
    .from('users')
    .where('email', '=', user.short + '@' + domain);

  if (uid === undefined) {
    return;
  }

  await knex('user_roles').insert({
    user_id: uid.id,
    role: user.role
  });
}

async function createServiceAccountRoles(knex, acct, domain) {
  // basic roles are an enumerations
  const [sid] = await knex
    .select('id')
    .from('serviceaccounts')
    .where('email', '=', acct.short + '@' + domain).first;

  await knex('serviceaccount_roles').insert({
    serviceaccount_id: sid,
    role: acct.role
  });
}

async function createOrgRoles(knex, org) {
  const [oid] = await knex
    .select('id')
    .from('orgs')
    .where('name', '=', org.name);

  // for each group, grab the id
  for (let group of org.groupRels) {
    const [gid] = await knex
      .select('id')
      .from('groups')
      .where('name', '=', org.name + ':' + group.name);
    group.id = gid.id;
  }

  // create the roles for the Org
  for (let role of org.roles) {
    console.log('  ', role);
    const [rid] = await knex('roles')
      .returning('id')
      .insert({
        name: role,
        org_id: oid.id
      });

    for (let group of org.groupRels) {
      // does it have this role?
      let found = _.find(group.roles, r => r === role);

      if (found) {
        console.log('   + ', group.name, rid);
        await knex('role_memberships').insert({
          role_id: rid,
          group_id: group.id
        });
      } else {
        console.log('     ', group.name, ' x');
      }
    }
  }
}
