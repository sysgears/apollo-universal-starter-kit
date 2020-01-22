export default {
  admin: ['admin:*', 'editor:*', 'user:*'],
  editor: ['editor:*', 'user:*'],
  user: ['user:view:self', 'user:update:self', 'stripe:*']
};
