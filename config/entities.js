export default {
  enabled: true,
  orgs: {
    enabled: true
  },
  groups: {
    enabled: true,
    multipleOrgs: true
  },
  users: {
    enabled: true,
    multipleOrgs: true,
    multipleGroups: true
  },
  serviceaccounts: {
    enabled: false,
    multipleOrgs: true,
    multipleGroups: true
  },

  social: {
    enabled: true,
    users: {
      enabled: true,
      following: true,
      friending: true
    },
    groups: {
      enabled: true,
      following: true
    }
  }
};
