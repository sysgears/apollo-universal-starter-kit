/* eslint-disable no-unused-vars */
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import log from '../../../../common/log';

import FieldError from '../../../../common/FieldError';

import { authSwitch } from '../../../../common/auth/server';

import { reconcileBatchOneToOne, reconcileBatchManyToMany } from '../../../stores/sql/knex/helpers/batching';

export default function addResolvers(obj) {
  obj = addQueries(obj);
  return obj;
}

function addQueries(obj) {
  obj.Query.orgs = authSwitch([
    {
      requiredScopes: ['admin:org/list'],
      callback: async (obj, args, context) => {
        // console.log(context.auth.orgRoles);
        let ret = await context.Org.list(args);
        return ret;
      }
    },
    {
      requiredScopes: ['org/list'],
      callback: async (obj, args, context) => {
        const userOrgs = await context.Org.getOrgIdsForUserIds({ ids: [context.user.id] });

        const gids = _.uniq(_.map(_.flatten(userOrgs), u => u.orgId));
        args.ids = gids;

        // Or the org is public
        // Would like to prioritize the orgs the user is a member of, perhaps it is a frontend concern?
        args.filters = [
          {
            prefilters: args.filters,
            bool: 'or',
            table: 'orgs',
            field: 'is_public',
            boolValue: true
          }
        ];

        const orgs = await context.Org.list(args);

        const ret = orgs;

        return ret;
      }
    }
  ]);

  obj.Query.pagingOrgs = authSwitch([
    {
      requiredScopes: ['admin:org/list'],
      callback: async (obj, args, context) => {
        // console.log(context.auth.orgRoles);
        let ret = await context.Org.paging(args);
        return ret;
      }
    },
    {
      requiredScopes: ['org/list'],
      callback: async (obj, args, context) => {
        const userOrgs = await context.Org.getOrgIdsForUserIds({ ids: [context.user.id] });

        const gids = _.uniq(_.map(_.flatten(userOrgs), u => u.orgId));
        args.ids = gids;

        // Or the org is public
        // Would like to prioritize the orgs the user is a member of, perhaps it is a frontend concern?
        args.filters = [
          {
            prefilters: args.filters,
            bool: 'or',
            table: 'orgs',
            field: 'is_public',
            boolValue: true
          }
        ];

        const orgs = await context.Org.paging(args);

        const ret = orgs;

        return ret;
      }
    }
  ]);

  obj.Query.searchOrgs = authSwitch([
    {
      requiredScopes: ['admin:org/list'],
      callback: async (obj, args, context) => {
        // console.log(context.auth.orgRoles);
        let ret = await context.Org.search(args);
        return ret;
      }
    },
    {
      requiredScopes: ['org/list'],
      callback: async (obj, args, context) => {
        const userOrgs = await context.Org.getOrgIdsForUserIds({ ids: [context.user.id] });

        const gids = _.uniq(_.map(_.flatten(userOrgs), u => u.orgId));
        args.ids = gids;

        // Or the org is public
        // Would like to prioritize the orgs the user is a member of, perhaps it is a frontend concern?
        args.filters = [
          {
            prefilters: args.filters,
            bool: 'or',
            table: 'orgs',
            field: 'is_public',
            boolValue: true
          }
        ];

        const orgs = await context.Org.search(args);

        const ret = orgs;

        return ret;
      }
    }
  ]);

  obj.Query.org = authSwitch([
    // public org
    {
      requiredScopes: async (_, args, context) => {
        let org = await context.Org.get(args);
        // console.log("Org:\n", org)
        return org.isPublic ? [] : ['skip'];
      },
      callback: async (obj, args, context) => {
        const ret = await context.Org.get(args);
        return ret;
      }
    },

    // private org, with member privileges
    {
      requiredScopes: (obj, args, context) => {
        // console.log("org", context.auth.orgRoles)
        let hasScopes = context.auth.orgPermissions.filter(elem => elem.orgId === args.id);
        hasScopes ? ['org/view'] : ['admin:org/view'];
      },
      presentedScopes: (obj, args, context) => {
        // console.log("org", context.auth.orgRoles)
        let permissions = context.auth.orgPermissions.filter(elem => elem.orgId === args.id);
        // console.log(permissions);
        let scopes = permissions.map(elem => elem.name);
        // console.log(scopes);
        return scopes;
      },
      callback: async (obj, args, context) => {
        const ret = await context.Org.get(args);
        return ret;
      }
    }
  ]);

  return obj;
}
