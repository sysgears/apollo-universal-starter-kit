/*
import settings from '../../../../../../settings';

let config = settings.entities;
*/

export async function up(knex) {
  let migs = [];

  let fn = knex.schema.createTable('uploads', table => {
    table.timestamps(true, true);
    table
      .uuid('id')
      .notNullable()
      .unique();
    table
      .uuid('owner_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.boolean('is_public').defaultTo(true);
    migs.push(fn);

    table.string('name').notNull();
    table.string('type').notNull();
    table.integer('size').notNull();
    table.string('path').notNull();

    fn = knex.schema.createTable('upload_relation_permission_grants', table => {
      table.timestamps(true, true);

      table
        .uuid('upload_id')
        .notNullable()
        .references('id')
        .inTable('uploads')
        .onDelete('CASCADE');

      table.string('relation').notNullable();

      table
        .uuid('permission_id')
        .notNullable()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE');

      table.unique(['upload_id', 'relation', 'permission_id']);
    });
    migs.push(fn);

    fn = knex.schema.createTable('upload_user_relation_grants', table => {
      table.timestamps(true, true);

      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table
        .uuid('upload_id')
        .notNullable()
        .references('id')
        .inTable('uploads')
        .onDelete('CASCADE');

      table.string('relation').notNullable();

      table.unique(['user_id', 'upload_id', 'relation']);
    });
    migs.push(fn);

    fn = knex.schema.createTable('upload_group_role_relation_grants', table => {
      table.timestamps(true, true);

      table
        .uuid('group_role_id')
        .notNullable()
        .references('id')
        .inTable('group_roles')
        .onDelete('CASCADE');

      table
        .uuid('upload_id')
        .notNullable()
        .references('id')
        .inTable('uploads')
        .onDelete('CASCADE');

      table.string('relation').notNullable();

      table.unique(['group_role_id', 'upload_id', 'relation']);
    });
    migs.push(fn);

    fn = knex.schema.createTable('upload_org_role_permission_grants', table => {
      table.timestamps(true, true);

      table
        .uuid('org_role_id')
        .notNullable()
        .unique()
        .references('id')
        .inTable('org_roles')
        .onDelete('CASCADE');

      table
        .uuid('upload_id')
        .notNullable()
        .unique()
        .references('id')
        .inTable('uploads')
        .onDelete('CASCADE');

      table.string('relation').notNullable();

      table.unique(['org_role_id', 'upload_id', 'relation']);
    });
    migs.push(fn);

    return Promise.all(migs);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('upload');
}
