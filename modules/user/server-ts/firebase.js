import firebase from 'firebase-admin';

class User {
  async getUser(uid) {
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
    return uid;
  }
  controlSnapshot(snapshot) {
    if (snapshot.empty) {
      return false;
    } else {
      let user = {};
      snapshot.forEach(data => {
        user = data.data();
      });
      return user;
    }
  }
}
const userDAO = new User();

export default userDAO;
