// Helpers
import { camelizeKeys } from 'humps';
import knex from '../../../server/sql/connector';

// Actual query fetching and transformation in DB
export default class User {
  public async getUsers() {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'la.email')
        .from('user AS u')
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
    );
  }

  public async getUser(id: number) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'la.email')
        .from('user AS u')
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  public async getUserWithPassword(id: number) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin', 'u.is_active', 'la.password')
        .from('user AS u')
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  public async getUserWithSerial(serial: any) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.is_admin')
        .from('user AS u')
        .leftJoin('cert_auth AS ca', 'ca.user_id', 'u.id')
        .where('ca.serial', '=', serial)
        .first()
    );
  }

  public register({ username, isActive }: { username: string; isActive: boolean }) {
    return knex('user')
      .insert({ username, is_active: isActive })
      .returning('id');
  }

  public createLocalOuth({ email, password, userId }: any) {
    return knex('local_auth')
      .insert({ email, password, user_id: userId })
      .returning('id');
  }

  public UpdatePassword(id: number, password: string) {
    return knex('local_auth')
      .update({ password })
      .where({ user_id: id });
  }

  public updateActive(id: number, isActive: boolean) {
    return knex('user')
      .update({ is_active: isActive })
      .where({ id });
  }

  public async getLocalOuth(id: number) {
    return camelizeKeys(
      await knex
        .select('*')
        .from('local_auth')
        .where({ id })
        .first()
    );
  }

  public async getLocalOuthByEmail(email: string) {
    return camelizeKeys(
      await knex
        .select('*')
        .from('local_auth')
        .where({ email })
        .first()
    );
  }
}
