export default class UserFormatter {
  static trimExtraSpaces(inputValues) {
    const userValues = Object.assign({}, inputValues);
    const propsForTrim = ['username', 'email', 'firstName', 'lastName'];

    for (let prop in userValues) {
      if (propsForTrim.includes(prop) && userValues[prop]) {
        userValues[prop] = userValues[prop].trim();
      }

      if (prop === 'profile') {
        for (let prop in userValues['profile']) {
          if (propsForTrim.includes(prop) && userValues['profile'][prop]) {
            userValues['profile'][prop] = userValues['profile'][prop].trim();
          }
        }
      }
    }

    return userValues;
  }
}
