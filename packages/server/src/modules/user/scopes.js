export default {
  admin: ['editor:*', 'user:*'],
  editor: ['user:*'],
  user: ['user:view:self', 'user:update:self']
};
