import { createError } from 'apollo-errors';

const BaseError = createError('BaseError', {
  message: 'A error has occurred'
});

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
      throw new BaseError({ data: this.getErrors() });
    }
  }
}
