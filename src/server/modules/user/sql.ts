// Helpers
import db from "../../sql/connector";

const camelizeKeys = require("humps");

// Actual query fetching and transformation in DB
export default class User {
  async getUsers() {
    return camelizeKeys(
      await db
        .select('u.id', 'u.username', 'u.is_admin', 'la.email')
        .from('user AS u')
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
    );
  }

  async getUser(id: number) {
    return camelizeKeys(
      await db
        .select('u.id', 'u.username', 'u.is_admin', 'la.email')
        .from('user AS u')
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  async getUserWithPassword(id: number) {
    return camelizeKeys(
      await db
        .select('u.id', 'u.username', 'u.is_admin', 'la.password')
        .from('user AS u')
        .leftJoin('local_auth AS la', 'la.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  register(user: any) {
    return db('user')
      .insert(user)
      .returning('id');
  }

  createLocalAuth(localAuth: any) {
    return db('local_auth')
      .insert({ email: localAuth.email, password: localAuth.password, user_id: localAuth.userId })
      .returning('id');
  }

  UpdatePassword(id: number, password: string) {
    return db('local_auth')
      .update({ password })
      .where({ user_id: id });
  }

  async getLocalAuth(id: number) {
    return camelizeKeys(
      await db
        .select('*')
        .from('local_auth')
        .where({ id })
        .first()
    );
  }

  async getLocalAuthByEmail(email: string) {
    return camelizeKeys(
      await db
        .select('*')
        .from('local_auth')
        .where({ email })
        .first()
    );
  }
}
