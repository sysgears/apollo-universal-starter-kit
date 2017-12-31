import _ from 'lodash';
import uuidv4 from 'uuid';
import bcrypt from 'bcryptjs';

import truncateTables from '../helpers/tables';
import settings from '../../../../../../settings';

import orgs from '../../../seeds/data/entities/orgs';
import groups from '../../../seeds/data/entities/groups';
import users from '../../../seeds/data/entities/users';
import sa from '../../../seeds/data/entities/sa';

let config = settings.entities;
let auth = settings.auth;

// This should pretty much destroy everything
// as all the tables have CASCADE ON DELETE set
async function wipe(knex, Promise) {
  if (config.orgs.enabled === true) {
    await truncateTables(knex, Promise, ['orgs']);
  }

  if (config.groups.enabled === true) {
    await truncateTables(knex, Promise, ['groups']);
  }

  if (config.users.enabled === true) {
    await truncateTables(knex, Promise, ['users']);
  }

  if (config.serviceaccounts.enabled === true) {
    await truncateTables(knex, Promise, ['serviceaccounts']);
  }
}

export async function seed(knex, Promise) {
  await wipe(knex, Promise);

  if (config.orgs.enabled === true) {
    await createOrgs(knex, orgs);

    return;
  }

  if (config.groups.enabled === true) {
    let shorts = ['owners', 'admins', 'subscribers', 'users'];
    await createGroups(knex, shorts);
  }

  if (config.users.enabled === true) {
    let domain = 'example.com';
    let shorts = ['owner', 'admin', 'developer', 'subscriber', 'user'];
    await createUsers(knex, shorts, domain);
  }

  if (config.serviceaccounts.enabled === true) {
    let domain = 'example.com';
    let shorts = ['sa-admin', 'sa-test', 'sa-subscriber', 'sa-user'];
    await createServiceAccounts(knex, shorts, domain);
  }
}

async function createOrgs(knex, orgs) {
  for (let org of orgs) {
    if (org.name === 'root') {
      continue;
    }
    console.log('Creating org:', org.name);

    const oid = uuidv4();
    // create org
    await knex('orgs').insert({
      id: oid,
      name: org.name,
      is_active: true
    });

    org.id = oid;

    // create org profile
    if (org.profile !== null) {
      await knex('org_profile').insert({
        org_id: oid,
        domain: org.domain,
        display_name: org.profile.displayName,
        description: org.profile.description
      });
    }

    // (enabled Org assumes Groups and Users enabled as well)
    // create groups
    await createGroups(knex, _.map(org.groups, g => g.name), org.name);

    // create users
    await createUsers(knex, _.map(org.users, u => u.name), org.profile.domain);

    // create service accounts
    if (config.serviceaccounts.enabled === true) {
      await createServiceAccounts(knex, _.map(org.serviceaccounts, s => s.name), org.profile.domain);
    }
  }
}

async function createGroups(knex, shorts, namePrefix) {
  for (let group of shorts) {
    console.log('  - group: ', group);
    // get the seed object by name
    let groupSeed = _.find(groups, g => {
      return g.name === group;
    });

    const gid = uuidv4();
    // save group
    await knex('groups').insert({
      id: gid,
      name: (namePrefix ? namePrefix + ':' : '') + groupSeed.name,
      is_active: true
    });

    // save group profile
    if (groupSeed.profile) {
      await knex('group_profile').insert({
        group_id: gid,
        display_name: groupSeed.profile.displayName,
        description: groupSeed.profile.description
      });
    }
  }
}

async function createUsers(knex, shorts, domain) {
  for (let user of shorts) {
    console.log('  - user: ', user);
    // get the actual seed object by short
    let userSeed = _.find(users, u => {
      return u.short == user;
    });
    let email = userSeed.short + '@' + domain;

    // check they aren't here yet
    const r = await knex
      .select('*')
      .from('users')
      .where('email', '=', email)
      .first();
    if (r && r.id) {
      continue;
    }

    const uid = uuidv4();
    // save user
    await knex('users').insert({
      id: uid,
      email: email,
      is_active: true
    });

    // save user password
    if (auth.authentication.password.enabled === true && userSeed.password) {
      await knex('user_password').insert({
        user_id: uid,
        password: await bcrypt.hash(userSeed.password, 12)
      });
    }

    // save user profile
    if (userSeed.profile) {
      await knex('user_profile').insert({
        user_id: uid,
        display_name: userSeed.profile.displayName,
        first_name: userSeed.profile.firstName,
        middle_name: userSeed.profile.middleName,
        last_name: userSeed.profile.lastName,
        suffix: userSeed.profile.suffix,
        locale: userSeed.profile.locale,
        language: userSeed.profile.language
      });
    }
  }
}

async function createServiceAccounts(knex, shorts, domain) {
  for (let acct of shorts) {
    console.log('  - sa: ', acct);
    // get the actual seed object by short
    let acctSeed = _.find(sa, a => {
      return a.short == acct;
    });

    const aid = uuidv4();
    // save service account
    await knex('serviceaccounts').insert({
      id: aid,
      email: acctSeed.short + '@' + domain,
      is_active: true
    });

    // save sa serial
    await knex('serviceaccount_certificates').insert({
      serviceaccount_id: aid,
      serial: acctSeed.serial + ':' + domain
    });

    // save sa profile
    if (acctSeed.profile !== null) {
      await knex('serviceaccount_profile').insert({
        serviceaccount_id: aid,
        display_name: acctSeed.profile.displayName,
        description: acctSeed.profile.description
      });
    }
  }
}
