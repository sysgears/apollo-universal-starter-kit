interface Error {
  field: string;
  message: string;
}

export default class FieldError {
  errors: Error[];

  constructor() {
    this.errors = [];
  }

  hasAny() {
    return !!this.errors.length;
  }

  setError(field: string, message: string) {
    this.errors.find((e: Error) => e.field == field).message = message;
  }

  getErrors() {
    return this.errors;
  }

  throwIf() {
    if (this.hasAny()) {
      throw this.getErrors();
    }
  }
}
