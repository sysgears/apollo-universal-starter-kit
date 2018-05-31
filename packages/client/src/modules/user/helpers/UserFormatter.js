export default class UserFormatter {
  static trimExtraSpaces(inputValues) {
    const insertValues = Object.assign({}, inputValues);
    const propsForTrim = ['username', 'email', 'firstName', 'lastName'];

    for (let prop in insertValues) {
      if (propsForTrim.includes(prop) && insertValues[prop]) {
        insertValues[prop] = insertValues[prop].trim();
      }

      if (prop === 'profile') {
        for (let prop in insertValues['profile']) {
          if (propsForTrim.includes(prop) && insertValues['profile'][prop]) {
            insertValues['profile'][prop] = insertValues['profile'][prop].trim();
          }
        }
      }
    }

    return insertValues;
  }
}
