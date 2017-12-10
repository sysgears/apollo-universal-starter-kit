export default {
  orgs: {
    enabled: true,
    seeds: [
      {
        name: 'app-owners',
        domain: 'example.com',
        profile: {
          displayName: 'My App Owners',
          description: 'Org for the people who make the app'
        },
        groups: [{ name: 'superusers' }, { name: 'developers' }, { name: 'auditors' }, { name: 'support-staff' }]
      },
      {
        name: 'app-users',
        domain: 'example.com',
        profile: {
          displayName: 'Users',
          description: 'Org for users of the app'
        },
        groups: [{ name: 'admins' }, { name: 'editors' }, { name: 'subscribers' }, { name: 'users' }]
      },
      {
        name: 'test-org-1',
        domain: 'org-1.com',
        profile: {
          displayName: 'Org 1',
          description: 'Some org for testing with, like enterprise'
        },
        groups: [{ name: 'admins' }, { name: 'subscribers' }, { name: 'users' }]
      },
      {
        name: 'test-org-2',
        domain: 'org-2.com',
        profile: {
          displayName: 'Org 2',
          description: 'A second org for testing with'
        },
        groups: [{ name: 'users' }]
      }
    ]
  },
  groups: {
    enabled: true,
    seeds: [
      {
        name: 'superusers',
        profile: {
          displayName: 'Superusers',
          description: 'Group of limitless humans.'
        },
        users: ['owner@example.com']
      },
      {
        name: 'admins',
        profile: {
          displayName: 'Admins',
          description: 'Admin users and svc accts'
        },
        users: ['admin@example.com']
      },
      {
        name: 'auditors',
        profile: {
          displayName: 'Admins',
          description: 'Admin users and svc accts'
        },
        users: ['auditor@example.com']
      },
      {
        name: 'support-staff',
        profile: {
          displayName: 'Support',
          description: 'The Support Staff'
        },
        users: ['support@example.com']
      },
      {
        name: 'developers',
        profile: {
          displayName: 'Devs',
          description: 'Developers and svc accts'
        },
        users: ['developer@example.com']
      },
      {
        name: 'editors',
        profile: {
          displayName: 'Editors',
          description: 'Editor users and svc accts'
        },
        users: ['editor@example.com']
      },
      {
        name: 'subscribers',
        profile: {
          displayName: 'Subscribers',
          description: 'Users who are subscribed one way or another'
        },
        users: ['subscriber1@example.com', 'subscriber2@example.com', 'subscriber3@example.com']
      },
      {
        name: 'users',
        profile: {
          displayName: 'Users',
          description: 'Users users'
        },
        users: ['user1@example.com', 'user2@example.com', 'user3@example.com']
      }
    ]
  },
  users: {
    enabled: true,
    seeds: [
      {
        email: 'owner@example.com',
        profile: {
          displayName: 'Big Boss Man',
          firstName: 'Ray',
          middleName: 'Wachington',
          lastName: 'Tailor',
          suffix: 'Jr.'
        },
        password: 'owner'
      },
      {
        email: 'admin@example.com',
        profile: {
          displayName: 'daAdmin',
          firstName: 'Sponge',
          lastName: 'Bob'
        },
        password: 'admin'
      },
      {
        email: 'auditor@example.com',
        profile: {
          displayName: 'auditing...',
          firstName: 'Hermes',
          lastName: 'Conrad'
        },
        password: 'auditor'
      },
      {
        email: 'support@example.com',
        profile: {
          displayName: 'daAdmin',
          firstName: 'Sponge',
          lastName: 'Bob'
        },
        password: 'support'
      },
      {
        email: 'developer@example.com',
        profile: {
          displayName: 'daAdmin',
          firstName: 'Sponge',
          lastName: 'Bob'
        },
        password: 'developer'
      },
      {
        email: 'editor@example.com',
        profile: {
          displayName: 'daAdmin',
          firstName: 'Sponge',
          lastName: 'Bob'
        },
        password: 'editor'
      },
      {
        email: 'subscriber1@example.com',
        profile: {
          displayName: 'daAdmin',
          firstName: 'Sponge',
          lastName: 'Bob'
        },
        password: 'subscriber'
      },
      {
        email: 'subscriber2@example.com',
        profile: {
          displayName: 'daAdmin',
          firstName: 'Sponge',
          lastName: 'Bob'
        },
        password: 'subscriber'
      },
      {
        email: 'subscriber3@example.com',
        profile: {
          displayName: 'daAdmin',
          firstName: 'Sponge',
          lastName: 'Bob'
        },
        password: 'subscriber'
      },
      {
        email: 'user1@example.com',
        profile: {
          displayName: 'daAdmin',
          firstName: 'Sponge',
          lastName: 'Bob'
        },
        password: 'user'
      },
      {
        email: 'user2@example.com',
        profile: {
          displayName: 'daAdmin',
          firstName: 'Sponge',
          lastName: 'Bob'
        },
        password: 'user'
      },
      {
        email: 'user3@example.com',
        profile: {
          displayName: 'daAdmin',
          firstName: 'Sponge',
          lastName: 'Bob'
        },
        password: 'user'
      }
    ]
  },
  serviceaccounts: {
    enable: true
  }
};
