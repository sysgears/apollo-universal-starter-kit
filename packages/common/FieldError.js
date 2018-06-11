import Translator from '../server/src/i18n/utils/Translator';

export default class FieldError {
  constructor() {
    this.errors = {};
  }

  hasAny() {
    return !!Object.keys(this.errors).length;
  }

  setError(field, cookie, moduleName, messageKey) {
    this.errors[field] = Translator.translate(cookie, moduleName, messageKey);
  }

  getErrors() {
    return Object.keys(this.errors).map(field => ({
      field,
      message: this.errors[field]
    }));
  }

  throwIf() {
    if (this.hasAny()) {
      throw this.getErrors();
    }
  }
}
