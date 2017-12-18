export default [
  {
    name: 'superusers',
    profile: {
      displayName: 'Superusers',
      description: 'Group of limitless humans.'
    },
    users: ['owner'],
    serviceaccounts: [],
    roles: ['superuser']
  },
  {
    name: 'owners',
    profile: {
      displayName: 'Superusers',
      description: 'Group of limitless humans.'
    },
    users: ['owner'],
    serviceaccounts: [],
    roles: ['superuser']
  },
  {
    name: 'admins',
    profile: {
      displayName: 'Admins',
      description: 'Admin users and svc accts'
    },
    users: ['owner', 'admin', 'developer'],
    serviceaccounts: ['sa-admin'],
    roles: ['admin']
  },
  {
    name: 'auditors',
    profile: {
      displayName: 'Auditors',
      description: 'Auditors of the system'
    },
    users: ['owner', 'auditor'],
    serviceaccounts: [],
    roles: ['auditor']
  },
  {
    name: 'support-staff',
    profile: {
      displayName: 'Support',
      description: 'The Support Staff'
    },
    users: ['support', 'developer'],
    serviceaccounts: [],
    roles: ['support']
  },
  {
    name: 'developers',
    profile: {
      displayName: 'Devs',
      description: 'Developers and svc accts'
    },
    users: ['developer'],
    serviceaccounts: ['sa-test'],
    roles: ['developer']
  },
  {
    name: 'devops',
    profile: {
      displayName: 'DevOps',
      description: 'Developers and svc accts who can do deploys'
    },
    users: ['developer'],
    serviceaccounts: ['sa-devops', 'sa-test'],
    roles: ['devops']
  },
  {
    name: 'editors',
    profile: {
      displayName: 'Editors',
      description: 'Editor users and svc accts'
    },
    users: ['admin', 'auditor', 'editor'],
    serviceaccounts: ['sa-admin'],
    roles: ['editor']
  },
  {
    name: 'subscribers',
    profile: {
      displayName: 'Subscribers',
      description: 'Users who are subscribed one way or another'
    },
    users: ['subscriber'],
    serviceaccounts: ['sa-subscriber'],
    roles: ['subscriber']
  },
  {
    name: 'users',
    profile: {
      displayName: 'Users',
      description: 'Users users'
    },
    users: ['user'],
    serviceaccounts: ['sa-user'],
    roles: ['user']
  },
  {
    name: 'everyone',
    profile: {
      displayName: 'EVERYONE!!',
      description: 'All of the users, making sense?'
    }
  },
  { name: 'org-2-peeps' },
  { name: 'group-1' },
  { name: 'group-2' },
  { name: 'group-3' }
];
