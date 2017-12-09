const verbs = [
  'create',
  'create:self',
  'update',
  'update:self',
  'delete',
  'delete:self',
  'view',
  'view:self',
  'view:all',
  'watch',
  'watch:self',
  'watch:all'
];

exports.up = function(knex, Promise) {
  return Promise.all([
    /*
     * Roles at application, organization, and group levels
     *
     *   Superuser     org_id == 0, group_id == 0
     *   Application   org_id == 0, group_id != 0
     *   Organization  org_id != 0, group_id == 0
     *   Group         org_id != 0, group_id != 0
     */
    knex.schema.createTable('roles', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('org_id')
        .unsigned()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');
      table
        .integer('group_id')
        .unsigned()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table.string('name');
      table.unique(['org_id', 'group_id', 'name']);

      table.string('displayName');
      table.string('description');
    }),

    knex.schema.createTable('role_permissions', table => {
      table.timestamps(true, true);
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE');
      table.string('resource'); // org_id.group_id.user_id.object
      table.enu('verb', verbs);
      table.unique(['role_id', 'resource', 'verb']);

      table.string('name');
      table.string('description');
    }),

    knex.schema.createTable('role_memberships', table => {
      table.timestamps(true, true);
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE');
      table.integer('subject_id').unsigned();
      table.enu('subject', ['group', 'user', 'serviceaccount']);
      table.unique(['role_id', 'subject_id', 'subject']);

      table
        .integer('group_id')
        .unsigned()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('serviceaccount_id')
        .unsigned()
        .references('id')
        .inTable('serviceaccounts')
        .onDelete('CASCADE');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('role_memberships'),
    knex.schema.dropTable('role_permissions'),
    knex.schema.dropTable('role')
  ]);
};
