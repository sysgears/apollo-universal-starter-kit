/*
import settings from '../../../../../../settings';

let entities = settings.entities;
let authz = settings.auth.authorization;
*/

exports.up = function(knex, Promise) {
  // if (settings.posts.enabled)
  //
  let migs = [];

  let fn = knex.schema.createTable('posts', table => {
    table.timestamps(true, true);
    table
      .uuid('id')
      .notNullable()
      .unique();
    table
      .uuid('owner_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.boolean('is_public').defaultTo(true);
    table.boolean('is_draft').defaultTo(true);

    table.string('title');
    table.string('content');
  });
  migs.push(fn);

  // if comments

  fn = knex.schema.createTable('post_comments', table => {
    table.timestamps(true, true);
    table
      .uuid('id')
      .notNullable()
      .unique();

    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .uuid('post_id')
      .notNullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE');

    table.string('content');
  });
  migs.push(fn);

  fn = knex.schema.createTable('post_likes', table => {
    table.timestamps(true, true);

    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .uuid('post_id')
      .notNullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE');

    table.unique(['user_id', 'post_id']);

    table.string('like_type'); // normal, down, up, emoji
  });
  migs.push(fn);

  fn = knex.schema.createTable('comment_likes', table => {
    table.timestamps(true, true);

    table
      .uuid('user_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .uuid('post_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE');

    table
      .uuid('post_comment_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('post_comments')
      .onDelete('CASCADE');

    table.unique(['user_id', 'post_comment_id']);

    table.string('like_type'); // normal, down, up, emoji
  });
  migs.push(fn);

  /* Auth related stuff */
  fn = knex.schema.createTable('post_relation_permission_grants', table => {
    table.timestamps(true, true);

    table
      .uuid('post_id')
      .notNullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE');

    table.string('relation').notNullable();

    table
      .uuid('permission_id')
      .notNullable()
      .references('id')
      .inTable('permissions')
      .onDelete('CASCADE');

    table.unique(['post_id', 'relation', 'permission_id']);
  });
  migs.push(fn);

  fn = knex.schema.createTable('post_user_relation_grants', table => {
    table.timestamps(true, true);

    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .uuid('post_id')
      .notNullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE');

    table.string('relation').notNullable();

    table.unique(['user_id', 'post_id', 'relation']);
  });
  migs.push(fn);

  fn = knex.schema.createTable('post_group_role_relation_grants', table => {
    table.timestamps(true, true);

    table
      .uuid('group_role_id')
      .notNullable()
      .references('id')
      .inTable('group_roles')
      .onDelete('CASCADE');

    table
      .uuid('post_id')
      .notNullable()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE');

    table.string('relation').notNullable();

    table.unique(['group_role_id', 'post_id', 'relation']);
  });
  migs.push(fn);

  fn = knex.schema.createTable('post_org_role_permission_grants', table => {
    table.timestamps(true, true);

    table
      .uuid('org_role_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('org_roles')
      .onDelete('CASCADE');

    table
      .uuid('post_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE');

    table.string('relation').notNullable();

    table.unique(['org_role_id', 'post_id', 'relation']);
  });
  migs.push(fn);

  return Promise.all(migs);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('post_comments'), knex.schema.dropTable('post')]);
};
