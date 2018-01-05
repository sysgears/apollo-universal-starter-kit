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
    const error = this.errors.find((e: Error) => e.field === field);
    if (error) {
      error.message = message;
    } else {
      this.errors.push({ field, message });
    }
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
