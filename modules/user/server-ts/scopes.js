export default {
  admin: ['user:*'],
  user: ['user:view:self', 'user:update:self', 'stripe:*']
};
