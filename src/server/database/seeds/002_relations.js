import _ from 'lodash';
import settings from '../../../../settings';

import orgs from './data/entities/orgs';
import groups from './data/entities/groups';

let config = settings.entities;

export async function seed(knex) {
  if (config.orgs.enabled === true) {
    await createOrgsRels(knex, orgs);
  }

  if (config.groups.enabled === true) {
    let shorts = ['owners', 'admins', 'subscribers', 'users'];
    await createGroupsRels(knex, shorts);
  }
}

async function createOrgsRels(knex, orgs) {
  for (let org of orgs) {
    console.log('Creating Relations for org:', org.name);

    // create org -> group -> user / service account relationshiprs
    if (config.groups.enabled) {
      await createOrgGroupRels(knex, org, org.groups);
    }

    if (config.users.enabled) {
      await createOrgUserRels(knex, org, org.users);
    }

    if (config.serviceaccounts.enabled) {
      await createOrgServiceAccountRels(knex, org, org.serviceaccounts);
    }

    if (config.serviceaccounts.enabled) {
      await createOrgGroupUserSARels(knex, org);
    }
  }
}

async function createOrgGroupRels(knex, org, groupShorts) {
  const [oid] = await knex
    .select('id')
    .from('orgs')
    .where('name', '=', org.name);

  for (let short of groupShorts) {
    const [gid] = await knex
      .select('id')
      .from('groups')
      .where('name', '=', org.name + ':' + short);

    await knex('orgs_groups').insert({
      org_id: oid.id,
      group_id: gid.id
    });
  }
}

async function createOrgUserRels(knex, org, userShorts) {
  const [oid] = await knex
    .select('id')
    .from('orgs')
    .where('name', '=', org.name);

  for (let short of userShorts) {
    const [uid] = await knex
      .select('id')
      .from('users')
      .where('email', '=', short + '@' + org.profile.domain);

    await knex('orgs_users').insert({
      org_id: oid.id,
      user_id: uid.id
    });
  }
}

async function createOrgServiceAccountRels(knex, org, acctShorts) {
  const [oid] = await knex
    .select('id')
    .from('orgs')
    .where('name', '=', org.name);

  for (let short of acctShorts) {
    const [sid] = await knex
      .select('id')
      .from('serviceaccounts')
      .where('email', '=', short + '@' + org.profile.domain);

    await knex('orgs_serviceaccounts').insert({
      org_id: oid.id,
      serviceaccount_id: sid.id
    });
  }
}

async function createOrgGroupUserSARels(knex, org) {
  for (let G of org.groupRels) {
    const [gid] = await knex
      .select('id')
      .from('groups')
      .where('name', '=', org.name + ':' + G.name);

    if (G.users) {
      for (let short of G.users) {
        const [uid] = await knex
          .select('id')
          .from('users')
          .where('email', '=', short + '@' + org.profile.domain);

        await knex('groups_users').insert({
          group_id: gid.id,
          user_id: uid.id
        });
      }
    }

    if (G.serviceaccounts) {
      for (let short of G.serviceaccounts) {
        const [sid] = await knex
          .select('id')
          .from('serviceaccounts')
          .where('email', '=', short + '@' + org.profile.domain);

        await knex('groups_serviceaccounts').insert({
          group_id: gid.id,
          serviceaccount_id: sid.id
        });
      }
    }
  } // end loop over groupRels
}

async function createGroupsRels(knex, shorts) {
  for (let short of shorts) {
    console.log('creating groupRels', short);
    let G = _.find(groups, g => {
      return g.name === short;
    });
    console.log(G);
    const [gid] = await knex
      .select('id')
      .from('groups')
      .where('name', '=', G.name);

    console.log('gid', gid);

    if (G.users) {
      for (let short of G.users) {
        const [uid] = await knex
          .select('id')
          .from('users')
          .where('email', '=', short + '@' + 'example.com');

        console.log('uid', uid);
        await knex('groups_users').insert({
          group_id: gid.id,
          user_id: uid.id
        });
      }
    }

    if (config.serviceaccounts.enabled == true && G.serviceaccounts) {
      for (let short of G.serviceaccounts) {
        const [sid] = await knex
          .select('id')
          .from('serviceaccounts')
          .where('email', '=', short + '@' + 'example.com');

        await knex('groups_serviceaccounts').insert({
          group_id: gid.id,
          serviceaccount_id: sid.id
        });
      }
    }
  } // end loop over groups
}
