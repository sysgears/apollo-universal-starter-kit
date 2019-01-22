import firebase from 'firebase-admin';

class User {
  async getUsers(orderBy, filter) {
    const users = await firebase.firestore().collection('users');
    let userWithFilters;
    // add filter conditions
    if (filter) {
      if (filter.isActive !== null) {
        userWithFilters = await users.where('isActive', '==', filter.isActive);
      }

      if (filter.role) {
        userWithFilters = await users.where('role', '==', filter.role);
      }

      if (filter.searchText !== '') {
        userWithFilters = await users.where('username', '==', filter.searchText);
        userWithFilters = await users.where('email', '==', filter.searchText);
      }
      // add order by
      if (orderBy && orderBy.column) {
        userWithFilters = await users.orderBy(orderBy.column, orderBy.order);
      }
    }
    const snapshot = await userWithFilters.get();

    return this.controlSnapshot(snapshot);
  }

  async getUser(uid) {
    const snapshot = await firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .get();
    return this.controlSnapshot(snapshot);
  }
  async getUserWithPassword(uid) {
    const snapshot = await firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .get();
    return this.controlSnapshot(snapshot);
  }

  async getUserByUsername(username) {
    const snapshot = await firebase
      .firestore()
      .collection('users')
      .where('username', '==', username)
      .get();
    return this.controlSnapshot(snapshot);
  }

  async getUserByEmail(email) {
    const snapshot = await firebase
      .firestore()
      .collection('users')
      .where('email', '==', email)
      .get();
    return this.controlSnapshot(snapshot);
  }

  async getUserByUsernameOrEmail(usernameOrEmail) {
    // firebase auth supports only email autentification
    const snapshot = await firebase
      .firestore()
      .collection('users')
      .where('email', '==', usernameOrEmail)
      .get();
    return this.controlSnapshot(snapshot);
  }
  async register({ username, email, role = 'user', isActive, password }) {
    const { uid, passwordHash } = await firebase.auth().createUser({
      email,
      password
    });
    await firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .set({
        id: uid,
        username,
        email,
        role,
        isActive,
        passwordHash
      });
    // await firebase
    //   .firestore()
    //   .collection('users')
    //   .doc(uid)
    //   .collection('profile')
    //   .add
    return uid;
  }
  controlSnapshot(snapshot) {
    if (snapshot.empty) {
      return false;
    } else {
      if (snapshot.size) {
        let users = [];
        snapshot.forEach(data => {
          users.push(data.data());
        });
        return users.length > 1 ? users : users[0];
      }
      return snapshot.data();
    }
  }
}
const userDAO = new User();

export default userDAO;
