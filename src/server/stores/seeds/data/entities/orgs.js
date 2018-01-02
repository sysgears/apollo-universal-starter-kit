export default [
  {
    name: 'root',
    profile: {
      domain: 'example.com',
      displayName: 'Root Users',
      description: 'Pseudo org for adding groups,users,serviceaccounts outside of an organization'
    },
    users: [
      {
        name: 'owner',
        roles: ['superuser', 'user']
      },
      {
        name: 'admin',
        roles: ['admin', 'user']
      },
      {
        name: 'auditor',
        roles: ['admin', 'user']
      },
      {
        name: 'developer',
        roles: ['admin', 'user']
      },
      {
        name: 'support',
        roles: ['admin', 'user']
      },
      {
        name: 'editor',
        roles: ['admin', 'user']
      },
      {
        name: 'subscriber',
        roles: ['subscriber', 'user']
      },
      {
        name: 'subscriber1',
        roles: ['subscriber', 'user']
      },
      {
        name: 'subscriber2',
        roles: ['subscriber', 'user']
      },
      {
        name: 'subscriber3',
        roles: ['subscriber', 'user']
      },
      {
        name: 'user',
        roles: ['user']
      },
      {
        name: 'user1',
        roles: ['user']
      },
      {
        name: 'user2',
        roles: ['user']
      },
      {
        name: 'user3',
        roles: ['user']
      }
    ]
  },
  {
    name: 'app-owners',
    isPrivate: true,
    profile: {
      domain: 'example.com',
      displayName: 'My App Owners',
      description: 'Org for the people who make the app'
    },
    users: [
      {
        name: 'owner',
        roles: ['owner']
      },
      {
        name: 'admin',
        roles: ['admin']
      },
      {
        name: 'auditor',
        roles: ['admin']
      },
      {
        name: 'developer',
        roles: ['admin']
      },
      {
        name: 'support',
        roles: ['admin']
      }
    ],
    serviceaccounts: [
      {
        name: 'sa-admin',
        roles: ['admin']
      },
      {
        name: 'sa-devops',
        roles: ['admin']
      },
      {
        name: 'sa-test',
        roles: ['user']
      }
    ],
    groups: [
      {
        name: 'superusers',
        roles: [
          {
            name: 'owner',
            users: ['owner'],
            serviceaccounts: []
          }
        ]
      },
      {
        name: 'admins',
        roles: [
          {
            name: 'owner',
            users: ['owner'],
            serviceaccounts: []
          },
          {
            name: 'admin',
            users: ['admin'],
            serviceaccounts: []
          },
          {
            name: 'member',
            users: ['developer'],
            serviceaccounts: []
          }
        ]
      },
      {
        name: 'auditors',
        roles: [
          {
            name: 'owner',
            users: ['owner'],
            serviceaccounts: []
          },
          {
            name: 'admin',
            users: ['auditor'],
            serviceaccounts: []
          }
        ]
      },
      {
        name: 'developers',
        roles: [
          {
            name: 'owner',
            users: ['developer'],
            serviceaccounts: []
          }
        ]
      },
      {
        name: 'devops',
        roles: [
          {
            name: 'owner',
            users: ['developer'],
            serviceaccounts: ['sa-devops', 'sa-test']
          }
        ]
      },
      {
        name: 'support-staff',
        roles: [
          {
            name: 'owner',
            users: ['support'],
            serviceaccounts: []
          },
          {
            name: 'admin',
            users: ['developer'],
            serviceaccounts: []
          }
        ]
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
    users: [
      {
        name: 'admin',
        roles: ['admin']
      },
      {
        name: 'developer',
        roles: ['admin']
      },
      {
        name: 'support',
        roles: ['admin']
      },
      {
        name: 'editor',
        roles: ['admin']
      },
      {
        name: 'subscriber',
        roles: ['member']
      },
      {
        name: 'subscriber1',
        roles: ['member']
      },
      {
        name: 'subscriber2',
        roles: ['member']
      },
      {
        name: 'subscriber3',
        roles: ['member']
      },
      {
        name: 'user',
        roles: ['member']
      },
      {
        name: 'user1',
        roles: ['member']
      },
      {
        name: 'user2',
        roles: ['member']
      },
      {
        name: 'user3',
        roles: ['member']
      }
    ],
    serviceaccounts: [
      {
        name: 'sa-user1',
        roles: ['user']
      },
      {
        name: 'sa-subscriber1',
        roles: ['user']
      }
    ],
    groups: [
      {
        name: 'admins',
        roles: [
          {
            name: 'owner',
            users: ['admin'],
            serviceaccounts: []
          },
          {
            name: 'admin',
            users: ['auditor'],
            serviceaccounts: []
          },
          {
            name: 'member',
            users: ['developer', 'support'],
            serviceaccounts: ['sa-admin']
          }
        ]
      },
      {
        name: 'editors',
        roles: [
          {
            name: 'owner',
            users: ['admin'],
            serviceaccounts: []
          },
          {
            name: 'admin',
            users: ['auditor'],
            serviceaccounts: []
          },
          {
            name: 'member',
            users: ['editor', 'support'],
            serviceaccounts: ['sa-admin']
          }
        ]
      },
      {
        name: 'subscribers',
        roles: [
          {
            name: 'owner',
            users: ['subscriber2'],
            serviceaccounts: []
          },
          {
            name: 'admin',
            users: ['subscriber3'],
            serviceaccounts: []
          },
          {
            name: 'member',
            users: ['subscriber1'],
            serviceaccounts: ['sa-subscriber1']
          }
        ]
      },
      {
        name: 'users',
        roles: [
          {
            name: 'owner',
            users: ['user1'],
            serviceaccounts: []
          },
          {
            name: 'member',
            users: ['user2', 'user3'],
            serviceaccounts: ['sa-user1']
          }
        ]
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
    // custom roles
    roles: ['owner', 'admin', 'editor', 'subscriber', 'user'],
    users: [
      {
        name: 'owner',
        roles: ['owner']
      },
      {
        name: 'admin',
        roles: ['admin']
      },
      {
        name: 'editor',
        roles: ['editor']
      },
      {
        name: 'subscriber1',
        roles: ['subscriber']
      },
      {
        name: 'subscriber2',
        roles: ['subscriber']
      },
      {
        name: 'user1',
        roles: ['user']
      },
      {
        name: 'user2',
        roles: ['user']
      }
    ],
    serviceaccounts: [
      {
        name: 'sa-admin',
        roles: ['editor']
      },
      {
        name: 'sa-subscriber1',
        roles: ['subscriber', 'user']
      }
    ],
    groups: [
      {
        name: 'everyone',
        customRoles: ['owner', 'admin', 'editor', 'subscriber', 'user'],
        roles: [
          {
            name: 'owner',
            users: ['owner'],
            serviceaccounts: []
          },
          {
            name: 'admin',
            users: ['admin'],
            serviceaccounts: ['sa-admin']
          },
          {
            name: 'editor',
            users: ['editor'],
            serviceaccounts: []
          },
          {
            name: 'subscriber',
            users: ['subscriber1', 'subscriber2'],
            serviceaccounts: ['sa-subscriber1']
          },
          {
            name: 'user',
            users: ['user1', 'user2'],
            serviceaccounts: []
          }
        ]
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
    users: [
      {
        name: 'owner',
        roles: ['owner']
      },
      {
        name: 'admin',
        roles: ['admin']
      },
      {
        name: 'developer',
        roles: ['admin']
      },
      {
        name: 'support',
        roles: ['admin']
      },
      {
        name: 'auditor',
        roles: ['admin']
      },
      {
        name: 'editor',
        roles: ['admin']
      },
      {
        name: 'subscriber1',
        roles: ['member']
      },
      {
        name: 'subscriber2',
        roles: ['member']
      },
      {
        name: 'subscriber3',
        roles: ['member']
      },
      {
        name: 'user1',
        roles: ['member']
      },
      {
        name: 'user2',
        roles: ['member']
      },
      {
        name: 'user3',
        roles: ['member']
      }
    ],
    serviceaccounts: [
      {
        name: 'sa-admin',
        roles: ['admin']
      },
      {
        name: 'sa-test',
        roles: ['member']
      },
      {
        name: 'sa-subscriber1',
        roles: ['member']
      },
      {
        name: 'sa-user1',
        roles: ['member']
      }
    ],
    groups: [
      {
        name: 'org-2-peeps',
        roles: [
          {
            name: 'owner',
            users: ['owner'],
            serviceaccounts: []
          },
          {
            name: 'admin',
            users: ['admin', 'auditor', 'developer', 'support', 'editor'],
            serviceaccounts: ['sa-admin', 'sa-test']
          },
          {
            name: 'member',
            users: ['subscriber1', 'subscriber2', 'subscriber3', 'user1', 'user2', 'user3'],
            serviceaccounts: []
          }
        ]
      },
      {
        name: 'group-1',
        roles: [
          {
            name: 'owner',
            users: ['subscriber1', 'subscriber2'],
            serviceaccounts: ['sa-subscriber1']
          },
          {
            name: 'admin',
            users: ['subscriber3'],
            serviceaccounts: ['sa-user1']
          },
          {
            name: 'member',
            users: ['user3'],
            serviceaccounts: []
          }
        ]
      },
      {
        name: 'group-2',
        roles: [
          {
            name: 'owner',
            users: ['subscriber3'],
            serviceaccounts: []
          },
          {
            name: 'admin',
            users: ['user3'],
            serviceaccounts: []
          },
          {
            name: 'member',
            users: ['user1', 'user2'],
            serviceaccounts: ['sa-user1']
          }
        ]
      },
      {
        name: 'group-3',
        roles: [
          {
            name: 'owner',
            users: ['owner'],
            serviceaccounts: []
          },
          {
            name: 'admin',
            users: ['admin', 'auditor'],
            serviceaccounts: []
          },
          {
            name: 'member',
            users: ['editor', 'support', 'developer'],
            serviceaccounts: []
          }
        ]
      }
    ]
  }
];
