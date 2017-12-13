export default [
  {
    name: 'app-owners',
    profile: {
      domain: 'example.com',
      displayName: 'My App Owners',
      description: 'Org for the people who make the app'
    },
    groups: ['superusers', 'admins', 'auditors', 'developers', 'devops', 'support-staff'],
    roles: ['superuser', 'admin', 'auditor', 'developer', 'devops', 'support'],
    users: ['owner', 'admin', 'auditor', 'developer', 'support'],
    serviceaccounts: ['sa-admin', 'sa-devops', 'sa-test'],
    groupRels: [
      {
        name: 'superusers',
        users: ['owner'],
        serviceaccounts: [],
        roles: ['superuser']
      },
      {
        name: 'admins',
        users: ['owner', 'admin', 'developer'],
        serviceaccounts: ['sa-admin'],
        roles: ['admin']
      },
      {
        name: 'auditors',
        users: ['owner', 'auditor'],
        serviceaccounts: [],
        roles: ['auditor']
      },
      {
        name: 'developers',
        users: ['developer'],
        serviceaccounts: [],
        roles: ['developer']
      },
      {
        name: 'devops',
        users: ['developer'],
        serviceaccounts: ['sa-devops', 'sa-test'],
        roles: ['devops']
      },
      {
        name: 'support-staff',
        users: ['support', 'developer'],
        serviceaccounts: [],
        roles: 'support'
      }
    ]
  },
  {
    name: 'app-users',
    profile: {
      domain: 'example.com',
      displayName: 'Users',
      description: 'Org for users of the app'
    },
    groups: ['admins', 'editors', 'subscribers', 'users'],
    roles: ['admin', 'editor', 'subscriber', 'user'],
    users: ['editor', 'subscriber1', 'subscriber2', 'subscriber3', 'user1', 'user2', 'user3'],
    serviceaccounts: ['sa-user1', 'sa-subscriber1'],
    groupRels: [
      {
        name: 'admins',
        users: ['admin', 'auditor', 'developer', 'support'],
        serviceaccounts: ['sa-admin'],
        roles: []
      },
      {
        name: 'editors',
        users: ['admin', 'auditor', 'editor'],
        serviceaccounts: ['sa-admin'],
        roles: []
      },
      {
        name: 'subscribers',
        users: ['subscriber1', 'subscriber2', 'subscriber3'],
        serviceaccounts: ['sa-subscriber1'],
        roles: []
      },
      {
        name: 'users',
        users: ['user1', 'user2', 'user3'],
        serviceaccounts: ['sa-user1'],
        roles: []
      }
    ]
  },
  {
    name: 'test-org-1',
    profile: {
      domain: 'org-1.com',
      displayName: 'Org 1',
      description: 'Some org for testing with, like enterprise'
    },
    groups: ['admins', 'editors', 'subscribers', 'users'],
    roles: ['admin', 'editor', 'subscriber', 'user'],
    users: ['admin', 'editor', 'subscriber1', 'subscriber2', 'user1', 'user2'],
    serviceaccounts: ['sa-admin', 'sa-subscriber1'],
    groupRels: [
      {
        name: 'admins',
        users: ['admin'],
        serviceaccounts: ['sa-admin'],
        roles: ['admin']
      },
      {
        name: 'editors',
        users: ['editor'],
        serviceaccounts: [],
        roles: ['editor']
      },
      {
        name: 'subscribers',
        users: ['subscriber1', 'subscriber2'],
        serviceaccounts: ['sa-subscriber1'],
        roles: ['subscriber']
      },
      {
        name: 'users',
        users: ['user1', 'user2'],
        serviceaccounts: [],
        roles: ['user']
      }
    ]
  },
  {
    name: 'test-org-2',
    profile: {
      domain: 'org-2.com',
      displayName: 'Org 2',
      description: 'A second org for testing with'
    },
    groups: [
      'superusers',
      'admins',
      'users',
      'group-1-owners',
      'group-1-admins',
      'group-1-members',
      'group-2-owners',
      'group-2-admins',
      'group-2-members',
      'group-3-owners',
      'group-3-admins',
      'group-3-members'
    ],
    roles: ['org-owner', 'org-admin', 'owner', 'admin', 'member', 'user'],
    users: [
      'owner',
      'admin',
      'auditor',
      'developer',
      'support',
      'editor',
      'subscriber1',
      'subscriber2',
      'subscriber3',
      'user1',
      'user2',
      'user3'
    ],
    serviceaccounts: ['sa-admin', 'sa-user1', 'sa-test', 'sa-subscriber1'],
    groupRels: [
      {
        name: 'superusers',
        users: ['owner'],
        serviceaccounts: [],
        roles: ['org-owner']
      },
      {
        name: 'admins',
        users: ['owner', 'admin', 'auditor', 'developer', 'support', 'editor'],
        serviceaccounts: ['sa-admin', 'sa-test'],
        roles: ['org-admin']
      },
      {
        name: 'users',
        users: ['subscriber1', 'subscriber2', 'subscriber3', 'user1', 'user2', 'user3'],
        roles: ['user']
      },
      {
        name: 'group-1-owners',
        users: ['subscriber1', 'subscriber2'],
        serviceaccounts: ['sa-subscriber1'],
        roles: ['owner']
      },
      {
        name: 'group-1-admins',
        users: ['subscriber3'],
        serviceaccounts: ['sa-user1'],
        roles: ['admin']
      },
      {
        name: 'group-1-members',
        users: ['user3'],
        serviceaccounts: [],
        roles: ['member']
      },
      {
        name: 'group-2-owners',
        users: ['subscriber3'],
        serviceaccounts: [],
        roles: ['owner']
      },
      {
        name: 'group-2-admins',
        users: ['user3'],
        serviceaccounts: [],
        roles: ['admin']
      },
      {
        name: 'group-2-members',
        users: ['user1', 'user2'],
        serviceaccounts: ['sa-user1'],
        roles: ['member']
      },
      {
        name: 'group-3-owners',
        users: ['owner'],
        serviceaccounts: [],
        roles: ['owner']
      },
      {
        name: 'group-3-admins',
        users: ['admin', 'auditor'],
        serviceaccounts: [],
        roles: ['admin']
      },
      {
        name: 'group-3-members',
        users: ['editor', 'support', 'developer'],
        serviceaccounts: [],
        roles: ['member']
      }
    ]
  }
];
