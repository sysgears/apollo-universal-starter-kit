export default class FieldError {
  constructor() {
    this.errors = {};
  }

  hasAny() {
    return !!Object.keys(this.errors).length;
  }

  setError(field, message) {
    this.errors[field] = message;
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
