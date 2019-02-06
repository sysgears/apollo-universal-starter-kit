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
    delete user.password;
    return user;
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
          passwordHash: passwordHash || null
        });
    } catch (e) {
      errors = e.errorInfo;
    }
    return { errors, id };
  }

  async register({ userId, username, email, role = 'user', isActive, password }) {
    let id = userId;
    let errors;
    try {
      if (!userId) {
        const { uid, passwordHash } = await auth().createUser({
          email,
          password,
          displayName: username,
          emailVerified: isActive || false,
          disabled: false
        });
        id = uid;
        password = passwordHash;
      }

      await firestore()
        .collection('users')
        .doc(id)
        .set({
          id,
          username: username || 'user',
          email,
          role,
          isActive: isActive || false,
          password: password || null
        });
    } catch (e) {
      errors = e.errorInfo;
    }
    return { errors, id };
  }

  async registerWithProvider({ userId, providerId, profileId, name, link }) {
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('auth_social')
      .doc(providerId)
      .set({
        name,
        link,
        profileId
      });
  }

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
    let errors;
    try {
      const { passwordHash } = await auth().updateUser(id, { password: newPassword });
      await firestore()
        .collection('users')
        .doc(id)
        .update({ passwordHash });
    } catch (e) {
      errors = e.errorInfo;
    }
    return { errors, id };
  }

  async updateActive(id, isActive) {
    await auth().updateUser(id, {
      emailVerified: isActive
    });
    return await firestore()
      .collection('users')
      .doc(id)
      .update({ isActive });
  }
}
const userDAO = new User();

export default userDAO;
