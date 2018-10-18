export default {
  admin: ['user:*', 'editor:*', 'admin:*'],
  editor: ['user:*', 'editor:*'],
  user: ['user:view:self', 'user:update:self', 'stripe:*']
};
