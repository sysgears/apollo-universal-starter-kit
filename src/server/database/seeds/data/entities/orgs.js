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
    serviceaccounts: ['sa-admin', 'sa-devops', 'sa-test']
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
    serviceaccounts: ['sa-user', 'sa-bot']
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
    serviceaccounts: ['sa-admin', 'sa-subscriber']
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
    serviceaccounts: ['sa-admin', 'sa-user', 'sa-test', 'sa-bot']
  }
];
