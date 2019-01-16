import firebase from 'firebase-admin';

class User {
  async getUserByUsername(username) {
    return await firebase.database().ref('users' + username);
  }
  async register({ username, email, role = 'user', isActive, password }) {
    console.log(password);
    const { uid, passwordHash } = await firebase.auth().createUser({
      email,
      password
    });
    const user = await firebase
      .database()
      .ref('users')
      .push()
      .set({
        uid,
        username,
        email,
        role,
        isActive,
        passwordHash
      });
    console.log(user);
    return user;
  }
}
const userDAO = new User();

export default userDAO;
