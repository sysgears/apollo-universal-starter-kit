export type Errors = Array<{ field: string; message: string }> | { [key: string]: any };

export class FieldError {
  public errors: { [key: string]: any };

  constructor(errors?: Errors) {
    this.errors = {};
    this.setErrors(errors);
  }

  public hasAny() {
    return !!Object.keys(this.errors).length;
  }

  public setError(field: string, message: string) {
    this.errors[field] = message;
  }

  public setErrors(errors: Errors) {
    this.errors = Array.isArray(errors)
      ? errors.reduce((formattedErrors, error) => ({ ...formattedErrors, [error.field]: error.message }), {})
      : { ...this.errors, ...errors };
  }

  public getErrors() {
    return Object.keys(this.errors).map(field => ({
      field,
      message: this.errors[field]
    }));
  }

  public throwIf() {
    if (this.hasAny()) {
      throw this.getErrors();
    }
  }
}
