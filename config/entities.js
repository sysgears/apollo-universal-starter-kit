export default {
  orgs: {
    enabled: true,
    seeds: [
      {
        name: 'app-owners',
        domain: 'example.com',
        groups: [{ name: 'superusers' }, { name: 'developers' }, { name: 'auditors' }, { name: 'support-staff' }]
      },
      {
        name: 'app-users',
        domain: 'example.com',
        groups: [{ name: 'admins' }, { name: 'editors' }, { name: 'subscribers' }, { name: 'users' }]
      },
      {
        name: 'test-org-1',
        domain: 'org-1.com',
        groups: [{ name: 'admins' }, { name: 'subscribers' }, { name: 'users' }]
      },
      {
        name: 'test-org-2',
        domain: 'org-2.com',
        groups: [{ name: 'users' }]
      }
    ]
  },
  groups: {
    enabled: true,
    seeds: [
      {
        name: 'superusers',
        users: ['owner@example.com']
      },
      {
        name: 'admins',
        users: ['admin@example.com']
      },
      {
        name: 'auditors',
        users: ['auditor@example.com']
      },
      {
        name: 'support-staff',
        users: ['support@example.com']
      },
      {
        name: 'developers',
        users: ['developer@example.com']
      },
      {
        name: 'editors',
        users: ['editor@example.com']
      },
      {
        name: 'subscribers',
        users: ['subscriber1@example.com', 'subscriber2@example.com', 'subscriber3@example.com']
      },
      {
        name: 'users',
        users: ['user1@example.com', 'user2@example.com', 'user3@example.com']
      }
    ]
  },
  users: {
    enabled: true,
    seeds: [
      {
        email: 'owner@example.com',
        password: 'owner'
      },
      {
        email: 'admin@example.com',
        password: 'admin'
      },
      {
        email: 'auditor@example.com',
        password: 'auditor'
      },
      {
        email: 'support@example.com',
        password: 'support'
      },
      {
        email: 'developer@example.com',
        password: 'developer'
      },
      {
        email: 'editor@example.com',
        password: 'editor'
      },
      {
        email: 'subscriber1@example.com',
        password: 'subscriber'
      },
      {
        email: 'subscriber2@example.com',
        password: 'subscriber'
      },
      {
        email: 'subscriber3@example.com',
        password: 'subscriber'
      },
      {
        email: 'user1@example.com',
        password: 'user'
      },
      {
        email: 'user2@example.com',
        password: 'user'
      },
      {
        email: 'user3@example.com',
        password: 'user'
      }
    ]
  },
  serviceaccounts: {
    enable: true
  }
};
