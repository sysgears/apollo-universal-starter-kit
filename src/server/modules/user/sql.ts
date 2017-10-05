import { camelizeKeys } from 'humps';
// Helpers
import db from '../../sql/connector';

// Actual query fetching and transformation in DB
export default class User {
  public async getUsers() {
    return camelizeKeys(
      await db
        .select('u.id', 'u.username', 'u.is_admin', 'la.email')
        .from('user AS u')
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
    );
  }

  public async getUser(id: number) {
    return camelizeKeys(
      await db
        .select('u.id', 'u.username', 'u.is_admin', 'la.email')
        .from('user AS u')
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  public async getUserWithPassword(id: number) {
    return camelizeKeys(
      await db
        .select('u.id', 'u.username', 'u.is_admin', 'la.password')
        .from('user AS u')
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  public register(user: any) {
    return db('user')
      .insert(user)
      .returning('id');
  }

  public createLocalAuth(localAuth: any) {
    return db('local_auth')
      .insert({ email: localAuth.email, password: localAuth.password, user_id: localAuth.userId })
      .returning('id');
  }

  public UpdatePassword(id: number, password: string) {
    return db('local_auth')
      .update({ password })
      .where({ user_id: id });
  }

  public async getLocalAuth(id: number) {
    return camelizeKeys(
      await db
        .select('*')
        .from('local_auth')
        .where({ id })
        .first()
    );
  }

  public async getLocalAuthByEmail(email: string) {
    return camelizeKeys(
      await db
        .select('*')
        .from('local_auth')
        .where({ email })
        .first()
    );
  }
}
