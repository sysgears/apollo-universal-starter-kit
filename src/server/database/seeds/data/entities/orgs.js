export default [
  {
    name: 'app-owners',
    profile: {
      domain: 'example.com',
      displayName: 'My App Owners',
      description: 'Org for the people who make the app'
    },
    groups: ['superusers', 'admins', 'auditors', 'developers', 'support-staff'],
    users: ['owner', 'admin', 'auditor', 'developer', 'support'],
    serviceaccounts: ['sa-admin', 'sa-devops', 'sa-test'],
    groupRels: [
      {
        name: 'superusers',
        users: ['owner'],
        serviceaccounts: []
      },
      {
        name: 'admins',
        users: ['owner', 'admin', 'developer'],
        serviceaccounts: ['sa-admin']
      },
      {
        name: 'auditors',
        users: ['owner', 'auditor'],
        serviceaccounts: []
      },
      {
        name: 'developers',
        users: ['developer'],
        serviceaccounts: ['sa-devops', 'sa-test']
      },
      {
        name: 'support-staff',
        users: ['support', 'developer'],
        serviceaccounts: []
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
    users: ['editor', 'subscriber1', 'subscriber2', 'subscriber3', 'user1', 'user2', 'user3'],
    serviceaccounts: ['sa-user1', 'sa-subscriber1'],
    groupRels: [
      {
        name: 'admins',
        users: ['admin', 'auditor', 'developer', 'support'],
        serviceaccounts: ['sa-admin']
      },
      {
        name: 'editors',
        users: ['admin', 'auditor', 'editor'],
        serviceaccounts: ['sa-admin']
      },
      {
        name: 'subscribers',
        users: ['subscriber1', 'subscriber2', 'subscriber3'],
        serviceaccounts: ['sa-subscriber1']
      },
      {
        name: 'users',
        users: ['user1', 'user2', 'user3'],
        serviceaccounts: ['sa-user1']
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
    users: ['admin', 'editor', 'subscriber1', 'subscriber2', 'user1', 'user2'],
    serviceaccounts: ['sa-admin', 'sa-subscriber1'],
    groupRels: [
      {
        name: 'admins',
        users: ['admin'],
        serviceaccounts: ['sa-admin']
      },
      {
        name: 'editors',
        users: ['editor'],
        serviceaccounts: []
      },
      {
        name: 'subscribers',
        users: ['subscriber1', 'subscriber2'],
        serviceaccounts: ['sa-subscriber1']
      },
      {
        name: 'users',
        users: ['user1', 'user2'],
        serviceaccounts: []
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
    groups: ['admins', 'subscribers', 'users'],
    users: [
      'owner',
      'admin',
      'auditor',
      'developer',
      'support',
      'editor',
      'subscriber1',
      'subscriber2',
      'user1',
      'user2'
    ],
    serviceaccounts: ['sa-admin', 'sa-user1', 'sa-test', 'sa-subscriber1'],
    groupRels: [
      {
        name: 'admins',
        users: ['owner', 'admin', 'auditor', 'developer', 'support', 'editor'],
        serviceaccounts: ['sa-admin', 'sa-test']
      },
      {
        name: 'subscribers',
        users: ['subscriber1', 'subscriber2'],
        serviceaccounts: ['sa-subscriber1']
      },
      {
        name: 'users',
        users: ['user1', 'user2'],
        serviceaccounts: ['sa-user1']
      }
    ]
  }
];
