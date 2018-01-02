/* eslint-disable no-unused-vars */
import _ from 'lodash';

export function addGroupMembershipFilter(options) {
  const opts = options;

  return (sources, args, context, info) => {};
}

export function limitGroupsToOrgs(options) {
  const opts = options;

  return (sources, args, context, info) => {
    let oids = _.uniq(sources.map(s => s.orgId));

    let joins = [];
    joins.push({
      table: 'orgs_groups',
      join: 'left',
      args: ['orgs_groups.group_id', 'groups.id']
    });

    let filters = [];
    filters.push({
      bool: 'and',
      table: 'orgs_groups',
      field: 'org_id',
      compare: 'in',
      values: oids
    });

    let selectOverrides = ['*'];

    let resultFilter = 'orgId';

    args.joins = args.joins ? args.joins.concat(joins) : joins;
    args.filters = args.filters ? args.filters.concat(filters.slice(1)) : filters;
    args.selectOverride = selectOverrides;
  };
}
