export default class FieldError {
  constructor(errors) {
    this.errors = {};
    this.setErrors(errors);
  }

  hasAny() {
    return !!Object.keys(this.errors).length;
  }

  setError(field, message) {
    this.errors[field] = message;
  }

  setErrors(errors) {
    this.errors = Array.isArray(errors)
      ? errors.reduce((formattedErrors, error) => ({ ...formattedErrors, [error.field]: error.message }), {})
      : { ...this.errors, ...errors };
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
