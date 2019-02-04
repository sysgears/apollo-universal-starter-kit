import { firestore, auth } from 'firebase-admin';

class User {
  async getUsers(orderBy, filter) {
    const docs = await firestore().collection('users');

    let usersWithOrderBy = docs;
    if (filter) {
      // add order by
      if (orderBy && orderBy.column) {
        usersWithOrderBy = await docs.orderBy(orderBy.column, orderBy.order);
      }
    }
    const getDocs = await usersWithOrderBy.get();
    if (getDocs.empty) return false;
    let users = [];
    getDocs.forEach(doc => {
      users.push(doc.data());
    });
    // add filter conditions
    if (filter) {
      if (filter.isActive !== null) {
        users = users.filter(isActiveFilter => {
          return isActiveFilter.isActive === filter.isActive;
        });
      }

      if (filter.role) {
        users = users.filter(roleFilter => {
          return roleFilter.role === filter.role;
        });
      }

      if (filter.searchText !== '') {
        users = users.filter(searchTextFilter => {
          return (
            searchTextFilter.username.toLowerCase() === filter.searchText ||
            searchTextFilter.email.toLowerCase() === filter.searchText
          );
        });
      }
    }
    return users;
  }
  async getUser(uid) {
    const doc = await firestore()
      .collection('users')
      .doc(uid)
      .get();
    if (doc.exist) return false;
    const user = doc.data();
    return user;
  }

  async getUserWithPassword(uid) {
    const doc = await firestore()
      .collection('users')
      .doc(uid)
      .get();
    if (doc.exist) return false;
    const user = doc.data();
    return user;
  }

  //   async getUserWithSerial(serial) {
  //     return camelizeKeys(
  //       await knex
  //         .select('u.id', 'u.username', 'u.role', 'u.is_active', 'ca.serial', 'up.first_name', 'up.last_name')
  //         .from('user AS u')
  //         .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
  //         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
  //         .where('ca.serial', '=', serial)
  //         .first()
  //     );
  //   }

  async register({ username, email, role = 'user', isActive, password }) {
    const active = isActive ? isActive : false;
    let id, errors;
    try {
      const { uid, passwordHash } = await auth().createUser({
        email,
        password,
        displayName: username,
        emailVerified: active,
        disabled: false
      });
      id = uid;
      await firestore()
        .collection('users')
        .doc(id)
        .set({
          id,
          username,
          email,
          role,
          isActive: active,
          passwordHash
        });
    } catch (e) {
      errors = e.errorInfo;
    }
    return { errors, id };
  }

  //   createFacebookAuth({ id, displayName, userId }) {
  //     return returnId(knex('auth_facebook')).insert({ fb_id: id, display_name: displayName, user_id: userId });
  //   }

  //   createGithubAuth({ id, displayName, userId }) {
  //     return returnId(knex('auth_github')).insert({ gh_id: id, display_name: displayName, user_id: userId });
  //   }

  //   createGoogleOAuth({ id, displayName, userId }) {
  //     return returnId(knex('auth_google')).insert({ google_id: id, display_name: displayName, user_id: userId });
  //   }

  //   createLinkedInAuth({ id, displayName, userId }) {
  //     return returnId(knex('auth_linkedin')).insert({ ln_id: id, display_name: displayName, user_id: userId });
  //   }

  async editUser({ id, username, email, role, isActive, password }) {
    const localAuthInput = password ? { email, password, displayName: username } : { email, displayName: username };
    let errors;
    try {
      const { passwordHash } = await auth().updateUser(id, localAuthInput);
      await firestore()
        .collection('users')
        .doc(id)
        .update({
          username,
          email,
          role,
          isActive,
          passwordHash
        });
    } catch (e) {
      errors = e.errorInfo;
    }
    return { errors, id };
  }

  //   async isUserProfileExists(userId) {
  //     return !!(await knex('user_profile')
  //       .count('id as count')
  //       .where(decamelizeKeys({ userId }))
  //       .first()).count;
  //   }

  //   editUserProfile({ id, profile }, isExists) {
  //     if (isExists) {
  //       return knex('user_profile')
  //         .update(decamelizeKeys(profile))
  //         .where({ user_id: id });
  //     } else {
  //       return returnId(knex('user_profile')).insert({ ...decamelizeKeys(profile), user_id: id });
  //     }
  //   }

  //   async editAuthCertificate({
  //     id,
  //     auth: {
  //       certificate: { serial }
  //     }
  //   }) {
  //     const userProfile = await knex
  //       .select('id')
  //       .from('auth_certificate')
  //       .where({ user_id: id })
  //       .first();

  //     if (userProfile) {
  //       return knex('auth_certificate')
  //         .update({ serial })
  //         .where({ user_id: id });
  //     } else {
  //       return returnId(knex('auth_certificate')).insert({ serial, user_id: id });
  //     }
  //   }

  async deleteUser(id) {
    let errors;
    try {
      await auth().deleteUser(id);
      await firestore()
        .collection('users')
        .doc(id)
        .delete();
    } catch (e) {
      errors = e.errorInfo;
    }

    return { errors, id };
  }

  async updatePassword(id, newPassword) {
    let user;
    try {
      const { passwordHash } = await auth().updateUser(id, { password: newPassword });
      user = await firestore()
        .collection('users')
        .doc(id)
        .update({ passwordHash });
    } catch (e) {
      return e;
    }
    return user;
  }

  updateActive(id, isActive) {
    return firestore()
      .collection('users')
      .doc(id)
      .update({ isActive });
  }

  async getUserByEmail(email) {
    const docs = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();
    let user = {};
    docs.forEach(doc => {
      user = doc.data();
    });
    return user;
  }

  //   async getUserByFbIdOrEmail(id, email) {
  //     return camelizeKeys(
  //       await knex
  //         .select(
  //           'u.id',
  //           'u.username',
  //           'u.role',
  //           'u.is_active',
  //           'fa.fb_id',
  //           'u.email',
  //           'u.password_hash',
  //           'up.first_name',
  //           'up.last_name'
  //         )
  //         .from('user AS u')
  //         .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
  //         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
  //         .where('fa.fb_id', '=', id)
  //         .orWhere('u.email', '=', email)
  //         .first()
  //     );
  //   }

  //   async getUserByLnInIdOrEmail(id, email) {
  //     return camelizeKeys(
  //       await knex
  //         .select(
  //           'u.id',
  //           'u.username',
  //           'u.role',
  //           'u.is_active',
  //           'lna.ln_id',
  //           'u.email',
  //           'u.password_hash',
  //           'up.first_name',
  //           'up.last_name'
  //         )
  //         .from('user AS u')
  //         .leftJoin('auth_linkedin AS lna', 'lna.user_id', 'u.id')
  //         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
  //         .where('lna.ln_id', '=', id)
  //         .orWhere('u.email', '=', email)
  //         .first()
  //     );
  //   }

  //   async getUserByGHIdOrEmail(id, email) {
  //     return camelizeKeys(
  //       await knex
  //         .select(
  //           'u.id',
  //           'u.username',
  //           'u.role',
  //           'u.is_active',
  //           'gha.gh_id',
  //           'u.email',
  //           'u.password_hash',
  //           'up.first_name',
  //           'up.last_name'
  //         )
  //         .from('user AS u')
  //         .leftJoin('auth_github AS gha', 'gha.user_id', 'u.id')
  //         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
  //         .where('gha.gh_id', '=', id)
  //         .orWhere('u.email', '=', email)
  //         .first()
  //     );
  //   }

  //   async getUserByGoogleIdOrEmail(id, email) {
  //     return camelizeKeys(
  //       await knex
  //         .select(
  //           'u.id',
  //           'u.username',
  //           'u.role',
  //           'u.is_active',
  //           'ga.google_id',
  //           'u.email',
  //           'u.password_hash',
  //           'up.first_name',
  //           'up.last_name'
  //         )
  //         .from('user AS u')
  //         .leftJoin('auth_google AS ga', 'ga.user_id', 'u.id')
  //         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
  //         .where('ga.google_id', '=', id)
  //         .orWhere('u.email', '=', email)
  //         .first()
  //     );
  //   }

  async getUserByUsername(username) {
    const snapshot = await firestore()
      .collection('users')
      .where('username', '==', username)
      .get();
    return this.controlSnapshot(snapshot);
  }
}
const userDAO = new User();

export default userDAO;
