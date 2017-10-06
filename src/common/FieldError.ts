interface Error {
  field: string;
  message: string;
}

export default class FieldError {
  public errors: Error[];

  constructor() {
    this.errors = [];
  }

  public hasAny() {
    return !!this.errors.length;
  }

  public setError(field: string, message: string) {
    this.errors.find((e: Error) => e.field === field).message = message;
  }

  public getErrors() {
    return this.errors;
  }

  public throwIf() {
    if (this.hasAny()) {
      throw this.getErrors();
    }
  }
}
